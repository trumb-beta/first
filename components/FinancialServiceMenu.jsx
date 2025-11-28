"use client";

import React from "react";
import { User, Briefcase, Home, Car } from "lucide-react"; // Importing icons
import Link from "next/link";

// Colors
const primaryColor = "#194c7b";
const secondaryColor = "#1e88e5";

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => {
  return (
    <Link href="/personal-loan">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer border border-gray-100">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-full mb-4"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon size={30} color={color} />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

const FinancialServiceMenu = () => {
  return (
    <div>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 border-b-2 border-orange-500 inline-block pb-1">
            Our Loan Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={User}
              title="Personal Loans"
              description="Instant approval for salaried individuals. Flexible repayment options."
              color={primaryColor}
            />

            <FeatureCard
              icon={Briefcase}
              title="Business Loans"
              description="Fuel your business growth with collateral-free funding options."
              color={secondaryColor}
            />

            <FeatureCard
              icon={Home}
              title="Home Loans"
              description="Competitive interest rates for buying your dream home."
              color={primaryColor}
            />

            <FeatureCard
              icon={Car}
              title="Two-Wheeler Loans"
              description="Quick and easy financing for your new bike or scooter."
              color={secondaryColor}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialServiceMenu;
