'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { TopNav } from '../../components/TopNav';
import { TestRow } from '../../components/TestRow';
import { TestService, TestRecord } from '../../services/TestService';

const TestsPage = () => {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Preserve the OOP service dependency using useMemo
  const testService = useMemo(() => new TestService(), []);

  useEffect(() => {
    const fetchTestRecords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch data from our OOP service class
        const fetchedTests = await testService.getUpcomingTests();
        setTests(fetchedTests);
      } catch (err) {
        console.error("Failed to load tests:", err);
        setError('Failed to load test data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestRecords();
  }, [testService]);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans relative">
      
      {/* Dark overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle props */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* min-w-0 prevents flex items from overflowing the viewport on mobile */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Adjusted padding: p-4 for mobile, md:p-8 for desktop */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-6 md:mb-8">
            Upcoming Tests & Quizzes (October 26, 2026)
          </h2>
          
          {/* Responsive Scrollable Table Container for Mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[700px]">
              {/* Table Headers */}
              <div className="flex text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-6 border-b border-gray-800 pb-2">
                <div className="w-1/5">Subject</div>
                <div className="w-1/4 px-4">Test Name</div>
                <div className="w-1/4 px-4">Scheduled Date & Time</div>
                <div className="w-32 px-4">Duration</div>
                <div className="flex-1 text-right pr-12">Status</div>
              </div>

              {/* Dynamic Test List */}
              <div className="flex flex-col">
                {isLoading && (
                  <div className="text-center py-10 text-gray-500 animate-pulse">
                    Loading test data from database...
                  </div>
                )}

                {error && (
                  <div className="text-center py-10 text-red-500">
                    {error}
                  </div>
                )}

                {!isLoading && !error && tests.map((test) => (
                  <TestRow 
                    key={test.id}
                    icon={test.icon}
                    subject={test.subject}
                    course={test.course}
                    testName={test.testName}
                    date={test.date}
                    duration={test.duration}
                    status={test.status}
                    action1={test.action1}
                    action2={test.action2}
                    action2Disabled={test.action2Disabled}
                  />
                ))}
                
                {!isLoading && tests.length === 0 && !error && (
                  <div className="text-center py-10 text-gray-500">
                    No upcoming tests scheduled.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestsPage;