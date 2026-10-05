'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { TopNav } from '../../components/TopNav';
import { HomeworkCard } from '../../components/HomeworkCard';

const HomeworkPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const filters = ['All', 'Active', 'Submitted', 'Missing', 'Drafts'];

  const fetchMyHomework = async () => {
    try {
      const response = await fetch('/api/student/homework');
      if (response.ok) {
        const data = await response.json();
        setHomeworkList(data.homework || []);
      }
    } catch (error) {
      console.error("Error fetching homework:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHomework();
  }, []);

  // Handler passed to each card to process file submission
  const handleAssignmentSubmit = async (assignmentId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId.toString());
      formData.append('file', file);

      const response = await fetch('/api/student/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      alert('Assignment submitted successfully!');
      fetchMyHomework(); // Refresh the list to reflect the new "SUBMITTED" status
    } catch (error) {
      console.error("Error submitting homework:", error);
      alert('Failed to submit assignment. Please try again.');
    }
  };

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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">My Homework</h2>
          
          {/* Filter Pills - Made horizontally scrollable on mobile to prevent wrapping breaks */}
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

          {/* Homework Grid - Already responsive, but gaps adjusted slightly for mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-pulse flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p>Loading your assignments...</p>
                </div>
              </div>
            ) : homeworkList.length === 0 ? (
              <p className="col-span-full text-gray-400 text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                No homework assigned yet! 🎉
              </p>
            ) : (
              homeworkList.map((submission) => {
                const assignment = submission.assignment;
                const isPdf = assignment.inputMode === 'PDF';
                // If score > 0, we consider it submitted
                const isSubmitted = submission.score > 0;

                return (
                  <HomeworkCard 
                    key={submission.id}
                    subject={assignment.subject?.name || "General"}
                    title={assignment.title}
                    icon={isPdf ? "📄" : "✏️"}
                    assigned={new Date(assignment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    due="TBD"
                    status={isSubmitted ? "SUBMITTED" : "ASSIGNED"}
                    contentType={isPdf ? 'pdf' : 'text'}
                    contentPayload={isPdf ? assignment.fileUrl : assignment.textContent}
                    fileUrl={assignment.fileUrl || ""}
                    onSubmit={(file) => handleAssignmentSubmit(assignment.id, file)}
                  />
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeworkPage;