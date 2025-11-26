'use client'
import { useState } from "react";
import { FiSearch, FiUser, FiBell, FiShoppingCart, FiGrid, FiMenu, FiX } from "react-icons/fi";
import { BiCard } from "react-icons/bi";
import { FaCrown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { icon: <FiGrid />, label: "English" },
  { icon: <FiUser />, label: "Sign In" },
  { icon: <BiCard />, label: "EMI Card" },
  { icon: <FiBell />, label: "Notifications" },
  { icon: <FiShoppingCart />, label: "Cart" },
  { icon: <FaCrown className="text-yellow-400"/>, label: "Prime" },
  { icon: <FiGrid />, label: "Partners" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#0c2a4d] p-4 px-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <img src="/image/bajaj-logo-12-11.avif" alt="Bajaj Logo" className="h-12" />
          
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-[400px] bg-white rounded flex items-center">
            <input
              type="text"
              placeholder="Search Bajajfinserv.in"
              className="flex-grow px-4 py-2 outline-none text-gray-700 rounded"
            />
            <button aria-label="Search" className="px-3">
              <FiSearch className="text-[#f27e26] h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Right: Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <span className="text-white text-xs font-bold">BAJAJ FINANCE LIMITED</span>
          <div className="flex items-center space-x-4">
            {navLinks.map((l, i) => (
              <button
                key={i}
                className="flex items-center text-white gap-1 hover:text-[#f27e26] focus:outline-dashed"
                aria-label={l.label}
              >
                {l.icon}
                <span className="text-xs">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Menu">
            {mobileOpen ? <FiX className="text-white h-6 w-6"/> : <FiMenu className="text-white h-6 w-6"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0c2a4d] mt-2 rounded shadow-lg"
          >
            <div className="p-2">
              {/* Search on Mobile */}
              <div className="mb-2">
                <div className="bg-white rounded flex items-center">
                  <input
                    type="text"
                    placeholder="Search Bajajfinserv.in"
                    className="flex-grow px-4 py-2 outline-none text-gray-700 rounded"
                  />
                  <button aria-label="Search" className="px-3">
                    <FiSearch className="text-[#f27e26] h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Nav Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((l, i) => (
                  <button
                    key={i}
                    className="flex items-center text-white gap-2 py-2 px-2 rounded hover:bg-[#123456]"
                    aria-label={l.label}
                  >
                    {l.icon}
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
