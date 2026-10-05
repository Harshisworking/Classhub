'use client';

import React from 'react';

interface StudentStats {
  avgScore: string;
  homeworkCompletion: string;
}

interface StudentRowProps {
  id: number;
  name: string;
  stats: StudentStats;
  isSelected: boolean;
  onSelect: (id: number) => void;
  // 1. Added `id: number` as the first argument here
  onOpenAssignModal: (id: number, studentName: string, type: 'Test' | 'Homework') => void;
  onViewStats: (id: number, name: string) => void; 
}

export function StudentRow({ id, name, stats, isSelected, onSelect, onOpenAssignModal, onViewStats }: StudentRowProps) {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          className="accent-blue-500 w-4 h-4 cursor-pointer"
          checked={isSelected}
          onChange={() => onSelect(id)}
        />
      </td>
      {/* Clickable Name */}
      <td className="p-4 font-medium text-white">
        <button 
          onClick={() => onViewStats(id, name)} 
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          {name}
        </button>
      </td>
      
      <td className="p-4 text-sm">
        <div className="flex gap-4">
          <span className="text-gray-400">
            Avg Score: <span className="font-semibold text-white">{stats.avgScore}</span>
          </span>
          <span className="text-gray-400">
            HW Done: <span className="font-semibold text-white">{stats.homeworkCompletion}</span>
          </span>
        </div>
      </td>

      <td className="p-4 flex justify-end gap-3">
        <button 
          // 2. Passed `id` as the first argument
          onClick={() => onOpenAssignModal(id, name, 'Test')}
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-800 text-green-400 border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          Assign Test
        </button>
        <button 
          // 3. Passed `id` as the first argument
          onClick={() => onOpenAssignModal(id, name, 'Homework')}
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 transition-colors"
        >
          Assign Homework
        </button>
      </td>
    </tr>
  );
}