'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside 
      className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-700 
        flex flex-col h-full text-gray-300 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}
    >
      <div className="flex justify-between items-center border-b border-gray-700">
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)} // Auto-close on mobile click
          className="p-6 flex items-center gap-3 hover:bg-gray-800 transition-colors flex-1"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
          <span className="text-2xl font-bold text-white">ClassHub</span>
        </Link>
        
        {/* Mobile close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link 
          href="/dashboard" 
          onClick={() => setIsOpen(false)}
          className="flex flex-col items-center justify-center p-4 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
        >
          <span className="text-2xl mb-2">📊</span>
          <span className="text-xs font-bold text-center">PERSONAL DASHBOARD</span>
        </Link>
        
        <Link 
          href="/dashboard/homework" 
          onClick={() => setIsOpen(false)}
          className="flex flex-col items-center justify-center p-4 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
        >
          <span className="text-2xl mb-2">📋</span>
          <span className="text-xs font-bold text-center">HOMEWORK</span>
        </Link>
      </nav>
    </aside>
  );
}