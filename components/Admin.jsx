'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn, Download, Trash2, Clock, CheckCircle, XCircle, Loader2, Users, Database, AlertTriangle
} from 'lucide-react';

// ✅ FIXED Firebase Imports - Direct from lib
import { auth, db, analytics } from '@/lib/Firebase'; // lowercase 'firebase'
import { 
  collection, query, where, getDocs, deleteDoc, doc, runTransaction, 
  writeBatch, onSnapshot, serverTimestamp, addDoc 
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// --- Constants ---
const ADMIN_PASS = '9162';
const ACTION_PASS = '2024';
const COLLECTION_NAME = 'loanApplications';
const MAX_BATCH_SIZE = 500;

// --- Utility Functions ---
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  const allKeys = new Set();
  data.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
  const headers = Array.from(allKeys).filter(key => key !== 'id');
  const headerRow = ['id', ...headers].map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const dataRows = data.map(obj => {
    const values = ['id', ...headers].map(header => {
      let value = obj[header];
      if (value === undefined || value === null) value = '';
      else if (typeof value === 'object') {
        if (value.toDate) value = value.toDate().toLocaleString();
        else value = JSON.stringify(value);
      } else if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
      }
      return `"${value}"`;
    });
    return values.join(',');
  }).join('\n');
  return headerRow + '\n' + dataRows;
};

const downloadCSV = (csvString, filename) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Analytics Helper ---
const logAnalyticsEvent = (eventName, params = {}) => {
  if (analytics && typeof window !== 'undefined') {
    import('firebase/analytics').then(({ logEvent }) => {
      logEvent(analytics, eventName, params);
    });
  }
};

// --- Components ---
const ActionPasswordModal = ({ isVisible, actionName, onConfirm, onCancel, isLoading }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (password === ACTION_PASS) {
      setError('');
      onConfirm();
    } else {
      setError('गलत पासवर्ड! कृपया पुनः प्रयास करें।');
      setPassword('');
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border-t-4 border-indigo-500"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
            एक्शन कन्फर्मेशन
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            '{actionName}' एक्शन के लिए पासवर्ड डालें।
          </p>
          <input
            type="password"
            placeholder="एक्शन पासवर्ड (2024)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700"
          />
          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
          <div className="flex justify-end space-x-3">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg" disabled={isLoading}>
              कैंसिल
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center ${
                isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  प्रोसेसिंग...
                </>
              ) : (
                'कन्फर्म'
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function AdminPanel() {
  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ✅ FIXED: Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('anonymous');
      }
      setLoading(false);
    });

    // Sign in anonymously
    signInAnonymously(auth).catch(console.error);

    return () => unsubscribe();
  }, []);

  // ✅ FIXED: Data Fetching - Simplified & Direct
  useEffect(() => {
    if (!userId || loading) return;

    console.log('🔥 Starting data fetch for user:', userId);
    
    // Direct collection path - NO __app_id dependency
    const q = collection(db, COLLECTION_NAME);
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('📊 Fetched data:', data.length, 'records');
        
        // Sort by creation time
        data.sort((a, b) => {
          const timeA = a.createdAt?.toDate?.()?.getTime() || 0;
          const timeB = b.createdAt?.toDate?.()?.getTime() || 0;
          return timeB - timeA;
        });
        
        setLoanApplications(data);
        setLoading(false);
      },
      (err) => {
        console.error('❌ Firestore Error:', err);
        setError('डेटा लोड करने में त्रुटि: ' + err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Unsubscribing from Firestore');
      unsubscribe();
    };
  }, [userId]);

  // Filtering Logic
  const twentyFourHoursAgo = useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() - 24);
    return now;
  }, []);

  const getFilteredData = useCallback((type) => {
    if (type === '24hrs') {
      return loanApplications.filter(app => {
        const date = app.createdAt?.toDate?.();
        return date && date >= twentyFourHoursAgo;
      });
    }
    return loanApplications;
  }, [loanApplications, twentyFourHoursAgo]);

  const twentyFourHourDataCount = getFilteredData('24hrs').length;
  const allDataCount = loanApplications.length;

  // Action Handlers
  const handleDownload = (type) => {
    setModalAction({
      type: 'download',
      dataType: type,
      name: type === 'all' ? 'सभी डेटा डाउनलोड' : '24 घंटे का डेटा',
    });
    setIsModalVisible(true);
  };

  const handleDelete = (type) => {
    setModalAction({
      type: 'delete',
      dataType: type,
      name: type === 'all' ? 'सभी डेटा डिलीट' : '24 घंटे का डेटा डिलीट',
    });
    setIsModalVisible(true);
  };

  const confirmAction = async () => {
    setIsActionLoading(true);
    const { type, dataType } = modalAction;
    const dataToProcess = getFilteredData(dataType);

    try {
      if (type === 'download') {
        const csv = convertToCSV(dataToProcess);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        downloadCSV(csv, `${dataType}_loans_${timestamp}.csv`);
        setActionStatus({ type: 'success', message: '✅ डेटा डाउनलोड हो गया!' });
      } else if (type === 'delete') {
        const batch = writeBatch(db);
        dataToProcess.forEach(item => {
          batch.delete(doc(db, COLLECTION_NAME, item.id));
        });
        await batch.commit();
        setActionStatus({ type: 'success', message: `✅ ${dataToProcess.length} रिकॉर्ड डिलीट हो गए!` });
      }
    } catch (e) {
      console.error('❌ Action failed:', e);
      setActionStatus({ type: 'error', message: '❌ एक्शन फेल: ' + e.message });
    } finally {
      setIsActionLoading(false);
      setIsModalVisible(false);
      setModalAction(null);
    }
  };

  const handleLogin = () => {
    if (authPassword === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('❌ गलत पासवर्ड!');
      setAuthPassword('');
    }
  };

  // Render functions
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50"
        >
          <div className="text-center mb-8">
            <LogIn className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              एडमिन पैनल
            </h1>
          </div>
          <input
            type="password"
            placeholder="पासवर्ड डालें (9162)"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-4 mb-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            लॉगिन करें
          </motion.button>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded-xl text-center font-medium"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <AnimatePresence>
        {actionStatus && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-6 right-6 p-6 rounded-2xl shadow-2xl text-white font-semibold flex items-center z-50 max-w-sm ${
              actionStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {actionStatus.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <XCircle className="w-6 h-6 mr-3" />}
            <span>{actionStatus.message}</span>
            <button onClick={() => setActionStatus(null)} className="ml-auto text-xl font-bold">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>

      <ActionPasswordModal
        isVisible={isModalVisible}
        actionName={modalAction?.name}
        onConfirm={confirmAction}
        onCancel={() => setIsModalVisible(false)}
        isLoading={isActionLoading}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mr-4" />
          <span className="text-xl text-gray-600">डेटा लोड हो रहा है...</span>
        </div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-8"
          >
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent mb-2">
              📊 लोन एप्लीकेशन डैशबोर्ड
            </h1>
            <p className="text-gray-600">कुल: <span className="font-bold text-2xl text-indigo-600">{allDataCount}</span> | 
              आज: <span className="font-bold text-2xl text-green-600">{twentyFourHourDataCount}</span></p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'कुल एप्लीकेशन', count: allDataCount, color: 'border-indigo-500', icon: <Users className="w-8 h-8 text-indigo-500" /> },
              { title: 'पिछले 24 घंटे', count: twentyFourHourDataCount, color: 'border-yellow-500', icon: <Clock className="w-8 h-8 text-yellow-500" /> },
              { title: 'अप्रूव्ड', count: loanApplications.filter(a => a.status === 'approved').length, color: 'border-green-500', icon: <CheckCircle className="w-8 h-8 text-green-500" /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-l-4 ${stat.color} hover:shadow-2xl transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">{stat.title}</h3>
                  {stat.icon}
                </div>
                <p className="text-4xl font-black text-gray-900">{stat.count}</p>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-t-4 border-indigo-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center"><Download className="w-8 h-8 mr-3 text-indigo-500" /> डाउनलोड</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDownload('24hrs')}
                  disabled={twentyFourHourDataCount === 0}
                  className="w-full p-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  📥 24 घंटे का डेटा ({twentyFourHourDataCount})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDownload('all')}
                  disabled={allDataCount === 0}
                  className="w-full p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  📥 सभी डेटा ({allDataCount})
                </motion.button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-t-4 border-red-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center"><Trash2 className="w-8 h-8 mr-3 text-red-500" /> डिलीट</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDelete('24hrs')}
                  disabled={twentyFourHourDataCount === 0}
                  className="w-full p-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  🗑️ 24 घंटे का डेटा ({twentyFourHourDataCount})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDelete('all')}
                  disabled={allDataCount === 0}
                  className="w-full p-6 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  🗑️ सभी डेटा ({allDataCount})
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Data Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-h-[70vh] overflow-auto"
          >
            <h2 className="text-2xl font-bold mb-6">📋 हाल ही के एप्लीकेशन (Top 20)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">ID</th>
                    <th className="p-4 text-left font-semibold">नाम</th>
                    <th className="p-4 text-left font-semibold">ईमेल</th>
                    <th className="p-4 text-left font-semibold">लोन राशि</th>
                    <th className="p-4 text-left font-semibold">स्थिति</th>
                    <th className="p-4 text-left font-semibold">समय</th>
                  </tr>
                </thead>
                <tbody>
                  {loanApplications.slice(0, 20).map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 border-b">
                      <td className="p-4 font-mono text-sm text-gray-500">{app.id.slice(0, 8)}...</td>
                      <td className="p-4 font-semibold">{app.fullName || 'N/A'}</td>
                      <td className="p-4 text-gray-600">{app.email || 'N/A'}</td>
                      <td className="p-4">₹{app.loanAmount?.toLocaleString() || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString('hi-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {loanApplications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-500">
                        📭 कोई डेटा नहीं मिला
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
