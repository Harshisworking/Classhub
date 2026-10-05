'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TestSubmissionRow } from './TestSubmissionRow';
import { TestSubmissionService, TestSubmission } from '../../services/TestSubmissionService';

export function TestSubmittedTab() {
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  
  const testService = useRef(new TestSubmissionService());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await testService.current.getSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch test submissions", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateScore = async (id: string, score: number) => {
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      // 1. Send update to the database via service
      const success = await testService.current.updateScore(id, score);
      
      if (success) {
        // 2. Update local state to reflect 'Graded' status and the new score
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === id ? { ...sub, status: 'Graded', score: score } : sub
          )
        );
      }
    } catch (error) {
      console.error("Failed to update score in database", error);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleViewAnswers = (id: string) => {
    // In production, this might open a modal or navigate to a grading page
    console.log(`Viewing answers for submission ID: ${id}`);
    alert(`Opening answers for submission ${id}...`);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 border-b border-gray-700">
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Student</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Test Name</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Date Submitted</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Status</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider text-right pr-12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-500 animate-pulse">
                Loading test submissions from database...
              </td>
            </tr>
          ) : submissions.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-500">
                No test submissions to display yet.
              </td>
            </tr>
          ) : (
            submissions.map((sub) => (
              <TestSubmissionRow 
                key={sub.id} 
                submission={sub}
                isUpdating={updatingIds.has(sub.id)}
                onUpdateScore={handleUpdateScore}
                onViewAnswers={handleViewAnswers}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}