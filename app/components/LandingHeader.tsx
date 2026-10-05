'use client';

import React from 'react';

export function LandingHeader() {
  return (
    <header className="flex justify-between items-center p-6 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
        <span className="text-2xl font-bold text-white">ClassHub</span>
      </div>
      
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
        GET STARTED FOR FREE
      </button>
    </header>
  );
}