'use client';

import React from 'react';
import { LogoutButton } from './LogoutButton';

interface TopNavProps {
  onToggleSidebar: () => void;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700 text-gray-100 shrink-0">
      
      <div className="flex items-center flex-1 gap-4">
        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none rounded-md hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar - hidden on tiny mobile screens to save space */}
        <div className="hidden sm:block flex-1 max-w-xl">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-full py-2 px-4 focus:outline-none focus:border-blue-500 text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto pl-4">
        <LogoutButton />
        
        <div className="relative cursor-pointer">
          <span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-gray-900"></span>
          <button className="text-gray-400 hover:text-white p-1">🔔</button>
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
            {/* Profile placeholder */}
          </div>
          <span className="font-medium text-sm hidden sm:block">Sarah J.</span>
        </div>
      </div>
    </header>
  );
}