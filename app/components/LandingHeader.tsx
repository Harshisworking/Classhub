'use client';

import React from 'react';
import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="flex justify-between items-center p-4 md:p-6 bg-gray-900 border-b border-gray-800">
      {/* Logo Section */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-md shrink-0"></div>
        <span className="text-xl md:text-2xl font-bold text-white">ClassHub</span>
      </div>
      
      {/* Search Bar - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* CTA Button as Next.js Link */}
      <Link 
        href="/login" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold md:font-bold py-2 px-4 md:px-6 text-sm md:text-base rounded-full transition-colors whitespace-nowrap shrink-0"
      >
        GET STARTED <span className="hidden sm:inline">FOR FREE</span>
      </Link>
    </header>
  );
}