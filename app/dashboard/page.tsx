'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { StatCard } from '../components/StatCard';
import { PerformanceChart } from '../components/PerformanceChart';
import { StudentDashboardService, DashboardMetrics } from '../services/StudentDashboardService';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Utilize useRef to hold the OOP service instance without triggering re-renders
  const dashboardService = useRef(new StudentDashboardService());

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.current.getDashboardMetrics();
        if (data) {
          setMetrics(data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-gray-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans relative">
      {/* Dark overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar now accepts props to control mobile visibility */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* min-w-0 prevents flex items from overflowing the viewport on mobile */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Adjusted padding for mobile (p-4) vs desktop (md:p-8) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">
            Welcome to your Personal Learning Dashboard, {metrics?.studentName || 'Student'}!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatCard 
              title="ASSIGNMENTS ASSIGNED" 
              value={metrics?.totalAssigned?.toString() || "0"} 
              subtitle="Total platform workload" 
            />
            <StatCard 
              title="ASSIGNMENTS SUBMITTED" 
              value={metrics?.totalSubmitted?.toString() || "0"} 
              subtitle="Your completed tasks" 
            />
            <StatCard 
              title="COMPLETION RATE" 
              value={`${metrics?.completionRate || 0}%`} 
              subtitle="Overall Progress" 
            />
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
              <h3 className="text-lg font-semibold text-white">Detailed Performance Analysis (Scores)</h3>
            </div>
            
            <div className="h-64 md:h-80 w-full">
              <PerformanceChart data={metrics?.chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;