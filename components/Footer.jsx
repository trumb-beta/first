// components/FinanceFooter.jsx
'use client';

import { FaApple, FaAndroid } from 'react-icons/fa';

const sections = [
  {
    title: 'Application Forms',
    columns: [
      [
        'Personal Loan',
        'Wallet Care',
        'Loan for Chartered Accountants',
        'Loan Against Car',
        'Used Tractor Loan',
      ],
      [
        'Business Loan',
        'Health Insurance',
        'Open Demat Account',
        'Car Loan Balance Transfer and Top-up',
        'Loan Against Tractor',
      ],
      [
        'Home Loan',
        'Loan for Doctors',
        'Two-wheeler Loan',
        'Mutual Fund',
        'Tractor Loan Balance Transfer',
      ],
      [
        'Gold Loan',
        'Fixed Deposit',
        'New Car Finance',
        'Secured Business Loan',
      ],
      [
        'Insta EMI Card',
        'Loan Against Property',
        'Used Car Loan',
        'Loan for Lawyer',
      ],
    ],
  },
];

const reachUsColumns = [
  {
    heading: 'Corporate Office',
    lines: [
      '6th Floor Bajaj Finserv Corporate Office, Off Pune-Ahmednagar Road,',
      'Viman Nagar, Pune - 411014',
    ],
  },
  {
    heading: 'Bajaj Finance Limited Regd. Office',
    lines: [
      'Akurdi, Pune - 411035',
      'Ph No: 020 7157-6403',
      'Email ID: investor.service@bajajfinserv.in',
    ],
  },
  {
    heading: 'Bajaj Finserv Limited Regd. Office',
    lines: [
      'Bajaj Auto Limited Complex Mumbai - Pune Road,',
      'Pune - 411035 MH (IN)',
      'Ph No: 020 7157-6064',
      'Email ID: investors@bajajfinserv.in',
    ],
  },
  {
    heading: 'Our Companies',
    lines: [
      'Bajaj Finserv Ltd.',
      'Bajaj Finance Ltd.',
      'Bajaj General Insurance Ltd.',
      'Bajaj Life Insurance Limited',
      'Bajaj Markets',
      'Bajaj Housing Finance Ltd.',
      'Bajaj Broking',
      'Bajaj Finserv Health Ltd.',
      'Bajaj Finserv Asset Management Ltd.',
    ],
  },
];

export default function FinanceFooter() {
  return (
    <footer className="bg-[#003057] text-slate-200 text-[16px] sm:text-md md:text-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-700 pt-4">
          <p className="font-semibold text-white cursor-pointer">
            Products Portfolio
          </p>
          <p className="font-semibold text-white cursor-pointer">Calculators</p>
          <p className="font-semibold text-white cursor-pointer">
            Important Links
          </p>
          <p className="font-semibold text-white cursor-pointer">Reach Us</p>
        </div>

        {/* Reach Us + apps */}
        <div className="border-t border-slate-700 pt-6 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Address columns */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reachUsColumns.map((col) => (
              <div key={col.heading}>
                <p className="font-semibold text-white mb-2">{col.heading}</p>
                {col.lines.map((line) => (
                  <p key={line} className="leading-snug">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Brand + app buttons */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center">
                <span className="text-[10px] font-bold">BF</span>
              </div>
              <span className="font-semibold text-white">FINANCE</span>
            </div>

            <div className="space-y-2 text-center lg:text-right">
              <p className="font-semibold text-white">Download App</p>
              <div className="flex gap-3 justify-center lg:justify-end">
                <button className="flex items-center gap-2 px-3 py-2 rounded border border-slate-400 hover:border-white hover:bg-white/5 transition-colors">
                  <FaAndroid className="w-4 h-4" />
                  <span className="text-[11px] leading-tight">Google Play</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded border border-slate-400 hover:border-white hover:bg-white/5 transition-colors">
                  <FaApple className="w-4 h-4" />
                  <span className="text-[11px] leading-tight">App Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-slate-700 pt-4 text-[10px] sm:text-[11px] text-slate-300 flex flex-col md:flex-row justify-between gap-2">
          <p>Corporate Identity Number (CIN): L65910MH1987PLC042961</p>
          <p>IRDAI Corporate Agency (Composite) Regn No. CA0101</p>
        </div>
      </div>
    </footer>
  );
}
