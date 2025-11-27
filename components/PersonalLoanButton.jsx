'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const PersonalLoanButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/personal-loan">
      <motion.button
        className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-700 to-purple-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/30 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <span className="relative z-10 flex items-center gap-2">
          Get Personal Loan
          <motion.span
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
          </motion.span>
        </span>
        
        {/* Gradient shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: -100 }}
          animate={isHovered ? { x: 100 } : { x: -100 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.button>
    </Link>
  );
};

export default PersonalLoanButton;
