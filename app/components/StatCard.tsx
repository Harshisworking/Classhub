'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, subtitle, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center shadow-lg">
      <h3 className="text-gray-400 text-sm font-semibold tracking-wider mb-4 uppercase">{title}</h3>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-gray-400 text-sm flex items-center gap-2">
        {trend && (
          <span className={trendUp ? "text-green-400" : "text-red-400"}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}