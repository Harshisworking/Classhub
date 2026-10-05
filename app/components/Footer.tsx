'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-950 py-8 text-center border-t border-gray-900">
      <div className="flex justify-center gap-8 mb-6 text-gray-400">
        <a href="#" className="hover:text-white transition-colors">Features</a>
        <a href="#" className="hover:text-white transition-colors">About</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
        <a href="#" className="hover:text-white transition-colors">Help</a>
        <a href="#" className="hover:text-white transition-colors">Support</a>
      </div>
      <p className="text-gray-600 text-sm">© 2026 ClassHub Inc.</p>
    </footer>
  );
}