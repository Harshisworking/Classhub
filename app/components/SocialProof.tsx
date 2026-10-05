'use client';

import React from 'react';

export function SocialProof() {
  return (
    <section className="py-20 px-8 text-center bg-gray-900 border-t border-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-10 uppercase tracking-wide">
          Over <span className="text-5xl text-blue-500">1,000,000</span><br />
          Students Ace ClassHub.
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-500 shadow-md">
              Logo {i}
            </div>
          ))}
        </div>
        
        <p className="text-2xl text-gray-300 font-medium mb-16">
          Organized Study. Clear Timelines. Perfect Materials.<br />
          <span className="text-blue-400">ACE IT ALL.</span>
        </p>

        <div className="bg-blue-900/30 p-12 rounded-2xl border border-blue-800/50">
          <h3 className="text-3xl font-bold text-white mb-6 uppercase">
            Ready to transform your studies?
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl transition-colors shadow-lg">
            SIGN UP - IT'S FREE!
          </button>
        </div>
      </div>
    </section>
  );
}