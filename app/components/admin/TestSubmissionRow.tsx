'use client';

import React, { useState } from 'react';
import { TestSubmission } from '../../services/TestSubmissionService';

interface TestSubmissionRowProps {
  submission: TestSubmission;
  onUpdateScore: (id: string, score: number) => void;
  onViewAnswers: (id: string) => void;
  isUpdating: boolean;
}

export function TestSubmissionRow({ submission, onUpdateScore, onViewAnswers, isUpdating }: TestSubmissionRowProps) {
  const [scoreInput, setScoreInput] = useState<string>('');

  const handleSubmitScore = () => {
    const numericScore = parseInt(scoreInput, 10);
    if (!isNaN(numericScore) && numericScore >= 0 && numericScore <= 100) {
      onUpdateScore(submission.id, numericScore);
    } else {
      alert('Please enter a valid percentage between 0 and 100.');
    }
  };

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4 font-medium text-white">{submission.studentName}</td>
      <td className="p-4 text-gray-300 font-medium">{submission.testName}</td>
      <td className="p-4 text-gray-400 text-sm">{submission.dateSubmitted}</td>
      <td className="p-4">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${
          submission.status === 'Graded' 
            ? 'bg-green-900 text-green-300 border-green-700' 
            : 'bg-orange-900 text-orange-300 border-orange-700'
        }`}>
          {submission.status}
        </span>
      </td>
      <td className="p-4 flex justify-end gap-3 items-center">
        
        {/* View Answers Button */}
        <button 
          onClick={() => onViewAnswers(submission.id)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
        >
          View Answers
        </button>

        {/* Score Assignment Area */}
        {submission.status === 'Graded' ? (
          <div className="flex items-center justify-center w-32 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-green-400 font-bold text-sm">
            {submission.score}%
          </div>
        ) : (
          <div className="flex items-center gap-2 w-48">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                max="100"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="Score"
                className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg py-1.5 pl-3 pr-6 focus:outline-none focus:border-blue-500"
                disabled={isUpdating}
              />
              <span className="absolute right-2 top-1.5 text-gray-500 text-sm">%</span>
            </div>
            
            <button 
              onClick={handleSubmitScore}
              disabled={isUpdating || !scoreInput}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                !scoreInput || isUpdating
                  ? 'bg-blue-600/50 text-white/50 border-blue-500/50 cursor-not-allowed'
                  : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
              }`}
            >
              {isUpdating ? 'Saving...' : 'Assign'}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}