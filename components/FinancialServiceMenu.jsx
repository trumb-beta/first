// components/FinancialServicesMenu.jsx - Bajaj Finance Theme
'use client';

import { motion } from 'framer-motion';
import { 
  FaUserAlt, 
  FaMobileAlt, 
  FaHome, 
  FaMotorcycle, 
  FaCoins, 
  FaFire,
  FaBriefcase,
  FaCreditCard
} from 'react-icons/fa';
import Link from 'next/link';

const services = [
  { id: 1, name: 'Personal Loan', icon: FaUserAlt, color: 'from-emerald-500 to-teal-600', path: '/personal-loan' },
  { id: 2, name: 'Electronics on EMI', icon: FaMobileAlt, color: 'from-blue-500 to-emerald-500', path: '/personal-loan' },
  { id: 3, name: 'Home Loan', icon: FaHome, color: 'from-orange-500 to-amber-500', path: '/personal-loan' },
  { id: 4, name: 'Two Wheeler', icon: FaMotorcycle, color: 'from-indigo-500 to-blue-500', path: '/personal-loan' },
  { id: 5, name: 'Gold Loan', icon: FaCoins, color: 'from-yellow-500 to-orange-500', path: '/personal-loan' },
  { id: 7, name: 'Hot Deals', icon: FaFire, color: 'from-red-500 to-orange-500', badge: '50% OFF', path: '/personal-loan' },
  { id: 9, name: 'Business Loan', icon: FaBriefcase, color: 'from-purple-500 to-indigo-500', path: '/personal-loan' },
  { id: 10, name: 'Easy EMI Loan', icon: FaCreditCard, color: 'from-pink-500 to-rose-500', path: '/personal-loan' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

export default function FinancialServicesMenu() {
  return (
    <section className="w-full bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Bajaj Finance Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Bajaj Finance Services
          </h2>
          
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6 lg:gap-8"
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={item}
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  transition: { type: 'spring', stiffness: 400, damping: 17 }
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer"
              >
                <Link href={service.path}>
                  <div className="block w-full h-full">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100/50 hover:border-emerald-200/50 transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center aspect-square hover:bg-white">
                      {/* Badge for Hot Deals */}
                      {service.badge && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10"
                        >
                          {service.badge}
                        </motion.div>
                      )}

                      {/* Bajaj Finance Icon Container */}
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 md:mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                        <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" />
                      </div>

                      {/* Service Name */}
                      <h3 className="text-xs md:text-sm font-semibold text-gray-800 text-center leading-tight px-2">
                        {service.name}
                      </h3>

                      {/* Bajaj Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bajaj CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link href="/personal-loan">
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 hover:from-emerald-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/30 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                Explore All Services
                <span className="w-5 h-5 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
