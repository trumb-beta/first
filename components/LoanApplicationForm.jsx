'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { db } from '../lib/Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function LoanApplicationForm({ onClose, defaultAmount, defaultPeriod }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: defaultAmount || 100000,
    loanPeriod: defaultPeriod || 12,
    loanType: 'personal',
    mobileNumber: '',
    address: '',
    fullName: '',
    email: '',
    panNumber: '',
    employmentType: 'salaried',
    monthlyIncome: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'loanApplications'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending',
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {success ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-gray-600">
                We'll review your application and contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl md:text-3xl font-bold">Apply for Loan</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                <p className="text-blue-200 mt-2">Step {step} of 2</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Loan Details</h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loan Type *
                      </label>
                      <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      >
                        <option value="personal">Personal Loan</option>
                        <option value="home">Home Loan</option>
                        <option value="car">Car Loan</option>
                        <option value="medical">Medical Loan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loan Amount (₹) *
                      </label>
                      <input
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        required
                        min="10000"
                        max="5500000"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loan Period (months) *
                      </label>
                      <input
                        type="number"
                        name="loanPeriod"
                        value={formData.loanPeriod}
                        onChange={handleChange}
                        required
                        min="6"
                        max="60"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                    >
                      Next Step
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complete Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Employment Type *
                        </label>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        >
                          <option value="salaried">Salaried</option>
                          <option value="self-employed">Self-employed</option>
                          <option value="business">Business Owner</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Monthly Income (₹) *
                        </label>
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleChange}
                          required
                          min="15000"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
