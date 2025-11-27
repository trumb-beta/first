// components/LoanCalculator.jsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaRupeeSign, FaPercentage, FaClock } from 'react-icons/fa';

export default function LoanCalculator({
  defaultAmount = 100000,
  defaultRate = 10.99,
  defaultTenure = 12, // months
}) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);      // annual %
  const [tenure, setTenure] = useState(defaultTenure); // months

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const principal = Number(amount) || 0;
    const r = (Number(rate) || 0) / 12 / 100;   // monthly interest
    const n = Number(tenure) || 0;             // number of months

    if (principal <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0 };
    }

    const x = Math.pow(1 + r, n);
    const monthly = (principal * r * x) / (x - 1);
    const total = monthly * n;
    const interest = total - principal;

    return {
      emi: Math.round(monthly),
      totalInterest: Math.round(interest),
      totalAmount: Math.round(total),
    };
  }, [amount, rate, tenure]);

  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-6 md:p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <FaCalculator className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Loan EMI Calculator
            </h2>
            <p className="text-sm text-gray-500">
              Loan amount, interest rate aur tenure ke basis par EMI calculate karo.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaRupeeSign className="text-blue-600" />
                Loan Amount (₹)
              </label>
              <input
                type="number"
                min={1000}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              />
              <input
                type="range"
                min={10000}
                max={5500000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-2 accent-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Range: ₹10,000 – ₹55,00,000
              </p>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaPercentage className="text-blue-600" />
                Interest Rate (p.a.)
              </label>
              <input
                type="number"
                min={5}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              />
              <input
                type="range"
                min={5}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full mt-2 accent-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Typical personal loan rate range 10% – 24%.
              </p>
            </div>

            {/* Tenure */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaClock className="text-blue-600" />
                Loan Tenure (months)
              </label>
              <input
                type="number"
                min={6}
                max={84}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              />
              <input
                type="range"
                min={6}
                max={84}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full mt-2 accent-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                6 mahine se 84 mahine (7 saal) tak ka tenure choose kar sakte ho.
              </p>
            </div>
          </div>

          {/* Output Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">
                Estimated Monthly EMI
              </p>
              <p className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-4">
                ₹{emi.toLocaleString('en-IN')}
              </p>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Principal Amount</span>
                  <span className="font-semibold text-gray-800">
                    ₹{Number(amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Interest</span>
                  <span className="font-semibold text-gray-800">
                    ₹{totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="text-gray-700 font-semibold">Total Payment</span>
                  <span className="font-semibold text-gray-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              *Yeh sirf ek indicative EMI calculation hai. Actual EMI bank ki policy, processing fee
              aur final approved interest rate ke hisaab se thodi different ho sakti hai.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
