'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { TopNav } from '../../components/TopNav';
import McqTestModal from '../../components/MCQModal';
import { TestApiService } from '../../services/TestApiService';

interface TestItem {
  id: number;
  type: 'PDF' | 'MCQ';
  isCompleted: boolean;
  title: string;
  createdAt: string;
  totalScore: number;
  duration: number;
  startTime: string | null;
  remainingSeconds: number;
  status: 'COMPLETED' | 'EXPIRED' | 'IN_PROGRESS' | 'PENDING';
}

const TestPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [testList, setTestList] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  
  const filters = ['All', 'Pending', 'In Progress', 'Completed', 'Missed'];

  const fetchMyTests = async () => {
    setIsLoading(true);
    try {
      const api = TestApiService.getInstance();
      const data = await api.getTestList();
      setTestList(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTests();
  }, []);

  const handleStartTest = (test: TestItem) => {
    // Prevent launching expired tests
    if (test.status === 'EXPIRED') return;

    if (test.type === 'MCQ') {
      setActiveTest(test);
    } else {
      alert("PDF viewer modal is not integrated yet.");
    }
  };

  const handleModalClose = () => {
    setActiveTest(null);
    fetchMyTests(); 
  };

  const filteredTests = testList.filter((test) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return test.status === 'PENDING';
    if (activeFilter === 'In Progress') return test.status === 'IN_PROGRESS';
    if (activeFilter === 'Completed') return test.status === 'COMPLETED';
    if (activeFilter === 'Missed') return test.status === 'EXPIRED';
    return true; 
  });

  const renderStatusBadge = (status: TestItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">COMPLETED</span>;
      case 'IN_PROGRESS':
        return <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">IN PROGRESS</span>;
      case 'EXPIRED':
        return <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">EXPIRED</span>;
      default:
        return <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">PENDING</span>;
    }
  };

  const renderActionButtonText = (status: TestItem['status']) => {
    switch (status) {
      case 'COMPLETED': return 'View Results';
      case 'EXPIRED': return 'Time Expired';
      case 'IN_PROGRESS': return 'Resume Test';
      default: return 'Start Test';
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans relative">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">My Tests</h2>
          
          <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide whitespace-nowrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${
                  activeFilter === filter 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-pulse flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p>Loading your tests...</p>
                </div>
              </div>
            ) : filteredTests.length === 0 ? (
              <p className="col-span-full text-gray-400 text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                No tests match this filter! 🎉
              </p>
            ) : (
              filteredTests.map((test) => {
                // Disable ONLY EXPIRED tests (COMPLETED tests can now be opened to view results)
                const isDisabled = test.status === 'EXPIRED';

                return (
                  <div 
                    key={test.id} 
                    className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col hover:border-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{test.type === 'PDF' ? '📄' : '📝'}</span>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-800 text-gray-300">
                          {test.type}
                        </span>
                      </div>
                      {renderStatusBadge(test.status)}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{test.title}</h3>
                    
                    <div className="flex flex-col gap-1 mt-2 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">⏱️</span> {test.duration} Minutes
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">🏆</span> {test.totalScore} Points Max
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📅</span> Assigned: {new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTest(test)}
                      disabled={isDisabled}
                      className={`mt-auto w-full py-2 rounded-lg font-medium transition-colors ${
                        isDisabled
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : test.status === 'COMPLETED'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : test.status === 'IN_PROGRESS'
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {renderActionButtonText(test.status)}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {activeTest && activeTest.type === 'MCQ' && (
        <McqTestModal
          testId={activeTest.id}
          initialRemainingSeconds={activeTest.remainingSeconds}
          title={activeTest.title}
          isCompleted={activeTest.status === 'COMPLETED'}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default TestPage;