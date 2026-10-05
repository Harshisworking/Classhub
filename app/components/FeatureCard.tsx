'use client';

import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col h-full shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl bg-gray-900 p-3 rounded-lg border border-gray-700">
          {icon}
        </div>
        <h3 className="font-bold text-xl text-white uppercase">{title}</h3>
      </div>
      <p className="text-gray-400 mb-6 flex-1">{description}</p>
      
      <div className="bg-gray-900 rounded-lg h-40 border border-gray-700 flex items-center justify-center text-gray-600 text-sm overflow-hidden">
        [ UI Preview Thumbnail ]
      </div>
    </div>
  );
}