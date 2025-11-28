"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function Section() {
  const primaryColor = "#194c7b";
  const secondaryColor = "#1e88e5";

  const [eligibilityForm, setEligibilityForm] = useState({
    loanType: "Personal Loan",
    loanAmount: "",
    tenure: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  // Dummy data for eligibility criteria cards
  const eligibility = [
    { label: "Minimum Age", value: "21 Years" },
    { label: "Maximum Age", value: "60 Years" },
    { label: "Minimum Income", value: "₹15,000 / Month" },
    { label: "CIBIL Score", value: "700+" },
  ];

  const [showForm, setShowForm] = useState(false);

  // Dummy Eligibility Check Function
  const handleEligibilityCheck = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const amount = Number(eligibilityForm.loanAmount);

      if (amount >= 50000) {
        setEligibilityResult({
          isEligible: true,
          amount: amount > 500000 ? 500000 : amount,
        });
      } else {
        setEligibilityResult({
          isEligible: false,
        });
      }

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div>
       <section
        className="relative overflow-hidden pt-16 pb-24"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/image/background.png"
            alt="Family and house"
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/1200x550/194c7b/ffffff?text=Happy+Family+with+House";
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 p-6 md:p-10 rounded-xl"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Unlock Your Potential with Bajaj Finance Loans
            </h1>

            <p className="text-lg text-blue-200 mb-6">
              Fast Approval, Fluid Data Terms, and Solutions Tailored for You.
            </p>

            <div className="flex space-x-4">
              <Link
                href="/personal-loan"
                className="relative z-20 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-100 text-sm shadow-md inline-block"
              >
                Apply for a Loan Now
              </Link>

              {/* <button className="text-white border-2 border-white font-semibold py-3 px-6 rounded-lg transition duration-300 hover:bg-white hover:text-gray-800 text-sm shadow-md">
                Explore Loan Options
              </button> */}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default Section;
