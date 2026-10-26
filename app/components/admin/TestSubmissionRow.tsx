"use client"

import { TestSubmission } from "@/app/services/TestSubmissionService";
import React, { useState, useEffect } from "react";

interface TestSubmissionRowProps {
  submission: TestSubmission;
  isUpdating: boolean;
  onUpdateScore: (id: number, score: number) => void;
  onViewAnswers: (id: number) => void;
}

export function TestSubmissionRow({
  submission,
  isUpdating,
  onUpdateScore,
  onViewAnswers,
}: TestSubmissionRowProps) {
  const [scoreInput, setScoreInput] = useState<string>(
    submission.score !== null && submission.score !== undefined ? submission.score.toString() : ''
  );

  // Sync internal state if the submission score prop is updated from parent
  useEffect(() => {
    if (submission.score !== null && submission.score !== undefined) {
      setScoreInput(submission.score.toString());
    }
  }, [submission.score]);

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scoreInput.trim() === '') return;
    
    const parsedScore = parseFloat(scoreInput);
    if (!isNaN(parsedScore)) {
      onUpdateScore(submission.id, parsedScore);
    }
  };

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4 text-gray-200 font-medium">{submission.studentName}</td>
      <td className="p-4 text-gray-300">{submission.testName}</td>
      <td className="p-4 text-gray-400 text-sm">{submission.dateSubmitted}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            submission.status === 'Graded'
              ? 'bg-green-900/50 text-green-400 border border-green-800'
              : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
          }`}
        >
          {submission.status}
        </span>
      </td>
      <td className="p-4 text-right pr-6">
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => onViewAnswers(submission.id)}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            View
          </button>
          
          <form onSubmit={handleScoreSubmit} className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              placeholder="Score"
              disabled={isUpdating}
              className="w-16 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 text-center focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isUpdating || scoreInput === ''}
              className="px-3 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors disabled:opacity-50"
            >
              {isUpdating ? '...' : 'Save'}
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}