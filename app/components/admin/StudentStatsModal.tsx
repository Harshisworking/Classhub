'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StudentStatsService, StudentFullStats } from '../../services/StudentStatsService';
import { StudentPerformanceChart } from './StudentPerformanceChart';

interface StudentStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
  studentName: string;
}

export function StudentStatsModal({ isOpen, onClose, studentId, studentName }: StudentStatsModalProps) {
  const [stats, setStats] = useState<StudentFullStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const statsService = useRef(new StudentStatsService());

  useEffect(() => {
    if (isOpen && studentId !== null) {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          const data = await statsService.current.getStudentStats(studentId);
          setStats(data);
        } catch (error) {
          console.error("Error fetching student stats", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStats();
    } else {
      // Reset state when closed
      setStats(null);
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{studentName}'s Performance Overview</h2>
            <p className="text-sm text-gray-400">Detailed statistics and historical trends</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading || !stats ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-pulse">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading student data from database...
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Overall Average Card */}
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Overall Average</h3>
                  <div className="text-3xl font-bold text-white">{stats.overallAverage}%</div>
                </div>
                <div className="text-green-400 flex items-center gap-1 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  On track
                </div>
              </div>

              {/* Subject Grid */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Subject Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.subjects.map((sub, idx) => (
                    <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                      <div className="text-sm text-gray-400 font-medium mb-2">{sub.subject}</div>
                      <div className="text-2xl font-bold text-white mb-1">{sub.average}%</div>
                      <div className="text-xs font-bold px-2 py-1 bg-gray-700 text-gray-300 rounded-full inline-block">Grade: {sub.grade}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Section */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Score History</h3>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <StudentPerformanceChart data={stats.chartData} />
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}