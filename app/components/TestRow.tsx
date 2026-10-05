'use client';

import React from 'react';

interface TestRowProps {
  icon: string;
  subject: string;
  course: string;
  testName: string;
  date: string;
  duration: string;
  status: string;
  action1: string;
  action2: string;
  action2Disabled?: boolean;
}

export function TestRow({
  icon,
  subject,
  course,
  testName,
  date,
  duration,
  status,
  action1,
  action2,
  action2Disabled
}: TestRowProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex items-center mb-4 hover:bg-gray-750 transition-colors">
      {/* Subject & Icon */}
      <div className="flex items-center gap-4 w-1/5">
        <div className="text-3xl bg-gray-900 p-2 rounded-lg border border-gray-700 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-white text-lg leading-tight">{subject}</h4>
          <p className="text-sm text-gray-400">{course}</p>
        </div>
      </div>

      {/* Test Name */}
      <div className="w-1/4 px-4 text-white font-medium">
        {testName}
      </div>

      {/* Scheduled Date & Time */}
      <div className="w-1/4 px-4 text-gray-300 text-sm">
        {date}
      </div>

      {/* Duration */}
      <div className="w-32 px-4 text-gray-300 text-sm">
        {duration}
      </div>

      {/* Status & Actions */}
      <div className="flex-1 flex flex-col items-end gap-3">
        <div className="flex justify-between items-center w-full justify-end gap-4">
           <span className="bg-green-900 text-green-300 border border-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {status}
          </span>
          <button className="text-gray-500 hover:text-gray-300">•••</button>
        </div>
       
        <div className="flex gap-2">
          <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-700 text-blue-400 border border-gray-600 hover:bg-gray-600 transition-colors">
            {action1}
          </button>
          <button 
            disabled={action2Disabled}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              action2Disabled 
                ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
            }`}
          >
            {action2}
          </button>
        </div>
      </div>
    </div>
  );
}