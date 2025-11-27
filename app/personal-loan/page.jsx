'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaShieldAlt, 
  FaClock, 
  FaFileAlt,
  FaRupeeSign,
  FaCalculator,
  FaUserCheck,
  FaChartLine
} from 'react-icons/fa';
import LoanApplicationForm from '@/components/LoanApplicationForm';
import LoanCalculator from '@/components/LoanCalculator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';



export default function PersonalLoanPage() {
  const [showForm, setShowForm] = useState(false);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanPeriod, setLoanPeriod] = useState(12);

  const features = [
    { icon: FaCheckCircle, title: 'Approval in 5 Minutes', desc: 'Quick digital verification' },
    { icon: FaShieldAlt, title: 'Minimal Documentation', desc: 'Just 2-3 documents needed' },
    { icon: FaClock, title: 'Flexible Tenure', desc: 'Up to 60 months repayment' },
    { icon: FaFileAlt, title: 'No Collateral', desc: '100% paperless process' },
  ];

  const eligibility = [
    { label: 'Age', value: '21-58 years' },
    { label: 'Employment', value: 'Salaried, Self-employed, Business' },
    { label: 'Monthly Income', value: '₹15,000+' },
    { label: 'Credit Score', value: '650+' },
  ];

  const calculateEMI = () => {
    const rate = 10.99 / 12 / 100;
    const emi = (loanAmount * rate * Math.pow(1 + rate, loanPeriod)) / 
                (Math.pow(1 + rate, loanPeriod) - 1);
    return Math.round(emi);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Personal Loan
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-blue-100">
                Loan of up to ₹55 lakh*
              </p>
              <p className="text-lg mb-8 text-blue-200">
                Get instant approval with minimal documentation. Interest rates starting from 10.99% p.a.
              </p>

              {/* Loan Amount Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                <label className="block text-sm mb-2">Enter Loan Amount</label>
                <div className="flex items-center gap-2 mb-4">
                  <FaRupeeSign className="text-2xl" />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="bg-transparent text-3xl font-bold border-b-2 border-white/50 focus:border-white outline-none w-full"
                  />
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5500000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300"
              >
                Apply Now - Get Instant Approval
              </button>

              <p className="text-sm mt-4 text-blue-200">
                ✓ Instant approval • ✓ Minimal docs • ✓ Disbursal in 24 hours
              </p>
            </motion.div>

            {/* Right Image/Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 text-center">
                  <FaRupeeSign className="text-6xl mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">Up to ₹55 Lakh</h3>
                  <p className="text-lg">Instant Personal Loan</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <FaCalculator className="text-orange-500" />
                  EMI Calculator
                </h2>
                <p className="text-gray-600 mb-6">
                  Calculate your monthly EMI and plan your finances better
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="5500000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Period: {loanPeriod} months
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="60"
                      value={loanPeriod}
                      onChange={(e) => setLoanPeriod(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Your EMI Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-600">Monthly EMI</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{calculateEMI().toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-semibold text-gray-800">
                      ₹{((calculateEMI() * loanPeriod) - loanAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-gray-800">
                      ₹{(calculateEMI() * loanPeriod).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  *Calculated at 10.99% p.a. interest rate
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Why Choose Our Personal Loan?
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-blue-100 to-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Eligibility Criteria
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {eligibility.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              Check Your Eligibility Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showForm && (
        <LoanApplicationForm
          onClose={() => setShowForm(false)}
          defaultAmount={loanAmount}
          defaultPeriod={loanPeriod}
        />
      )}
    </div>
    </>
  );
}
