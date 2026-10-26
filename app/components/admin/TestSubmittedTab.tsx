'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TestSubmissionRow } from './TestSubmissionRow';
import { TestSubmissionService, TestSubmission } from '../../services/TestSubmissionService';

// Interface for the detailed answer data returned from the backend
export interface AnswerDetail {
  id: number;
  text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  ansSelected: string | number;
}

export function TestSubmittedTab() {
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<AnswerDetail[]>([]);
  const [isFetchingAnswers, setIsFetchingAnswers] = useState(false);

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

  const handleUpdateScore = async (id: number, score: number) => {
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      const success = await testService.current.updateScore(id, score);

      if (success) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === id ? { ...sub, status: 'Graded', score } : sub
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

  const handleViewAnswers = async (id: number) => {
  setIsFetchingAnswers(true);
  try {
    const data = await testService.current.viewAnswers(id);
    
    // Fall back to [] if data is undefined
    setModalData(data ?? []); 
    setIsModalOpen(true);
  } catch (error) {
    console.error("Failed to fetch answers details", error);
  } finally {
    setIsFetchingAnswers(false);
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData([]);
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
                Loading test submissions...
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

      {/* Answer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 text-gray-100 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-800/50">
              <h3 className="text-xl font-bold text-gray-100">Submission Answer Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {modalData.length === 0 ? (
                <p className="text-gray-400 text-center">No answer records found for this submission.</p>
              ) : (
                modalData.map((item, index) => {
                  const isCorrect = String(item.ansSelected) === String(item.answer);

                  return (
                    <div key={item.id || index} className="p-4 rounded-lg bg-gray-800/40 border border-gray-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg text-gray-200">
                          {index + 1}. {item.text}
                        </h4>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          isCorrect 
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
                            : 'bg-red-950/80 text-red-400 border-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {[item.option1, item.option2, item.option3, item.option4].map((opt, optIdx) => {
                          const isUserSelection = String(opt) === String(item.ansSelected);
                          const isCorrectAnswer = String(opt) === String(item.answer);

                          let style = "bg-gray-800/60 border-gray-700 text-gray-300";
                          if (isCorrectAnswer) {
                            style = "bg-emerald-900/30 border-emerald-500 text-emerald-300 font-semibold";
                          } else if (isUserSelection && !isCorrect) {
                            style = "bg-red-900/30 border-red-500 text-red-300";
                          }

                          return (
                            <div key={optIdx} className={`p-3 rounded-md border text-sm flex justify-between items-center ${style}`}>
                              <span>{opt}</span>
                              <div className="flex gap-1">
                                {isUserSelection && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-700 text-gray-200">
                                    Selected
                                  </span>
                                )}
                                {isCorrectAnswer && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-700 text-emerald-100">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/30 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg border border-gray-700 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}