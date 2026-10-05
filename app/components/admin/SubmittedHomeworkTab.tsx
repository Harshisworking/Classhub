'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HomeworkRow } from './HomeworkRow';
import { HomeworkService, HomeworkSubmission } from '../../services/HomeworkService';

export function SubmittedHomeworkTab() {
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // Use a ref to hold the service instance
  const homeworkService = useRef(new HomeworkService());

  useEffect(() => {
    // Fetch data when the component mounts
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await homeworkService.current.getSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMarkAsChecked = async (id: string) => {
    // Set this specific row to loading state
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      // 1. Call the database via the service
      const success = await homeworkService.current.markSubmissionChecked(id);
      
      if (success) {
        // 2. If the database update succeeds, update the local UI state
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === id ? { ...sub, status: 'Checked' } : sub
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status in database", error);
    } finally {
      // Remove loading state for this row
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDownload = (fileUrl: string) => {
    if (!fileUrl) {
      alert("No file attached to this submission.");
      return;
    }
    
    // This tells the browser to actually open the PDF path in a new tab
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 border-b border-gray-700">
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Student</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Assignment Title</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Date Submitted</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Status</th>
            <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-500 animate-pulse">
                Loading submissions from database...
              </td>
            </tr>
          ) : submissions.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-500">
                No homework submissions to display yet.
              </td>
            </tr>
          ) : (
            submissions.map((sub) => (
              <HomeworkRow 
                key={sub.id} 
                submission={sub}
                isUpdating={updatingIds.has(sub.id)}
                onMarkChecked={handleMarkAsChecked}
                onDownload={handleDownload}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}