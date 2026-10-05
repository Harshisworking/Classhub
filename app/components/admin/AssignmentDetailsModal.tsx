'use client';

import React from 'react';

export interface AssignmentRecord {
  id: string;
  studentName: string;
  type: 'Test' | 'Homework';
  title: string;
  dateAssigned: string;
  content: string;
  isUploadedFile: boolean;
}

interface AssignmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentRecord | null;
}

export function AssignmentDetailsModal({ isOpen, onClose, assignment }: AssignmentDetailsModalProps) {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {assignment.title}
            </h2>
            <p className="text-sm text-gray-400">
              Assigned to <span className="text-white font-medium">{assignment.studentName}</span> on {assignment.dateAssigned}
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            assignment.type === 'Test' ? 'bg-green-900 text-green-300 border-green-700' : 'bg-blue-900 text-blue-300 border-blue-700'
          }`}>
            {assignment.type}
          </span>
        </div>

        {/* Assignment Content Area */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 min-h-[200px] text-gray-300 whitespace-pre-wrap">
          {assignment.isUploadedFile ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium text-white mb-1">Attached File</p>
              <p className="text-sm text-blue-400 cursor-pointer hover:underline">{assignment.content}</p>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Instructions</h4>
              {assignment.content}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}