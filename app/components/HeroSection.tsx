'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-12 py-16 px-8 max-w-7xl mx-auto">
      <div className="flex-1">
        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 uppercase">
          Classify your success.<br />
          The ultimate student study command center.
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Organize Tests, Study Guides, and Materials in One Place. Ace every class.
        </p>
        
        <Link href="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg">
            JOIN CLASSHUB NOW
          </button>
        </Link>
      </div>
      
      <div className="flex-1 w-full relative">
        <div className="bg-gray-800 h-80 rounded-xl border border-gray-700 shadow-2xl flex items-center justify-center text-gray-500 overflow-hidden">
           [ Device Mockup Presentation Image ]
        </div>
      </div>
    </section>
  );
}