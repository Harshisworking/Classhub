'use client';

import React, { useState } from 'react';
import { AdminTabs } from './AdminTabs';
import { StudentListTab } from './StudentListTab';
import { AssignedWorkTab } from './AssignedWorkTab';
import { SubmittedHomeworkTab } from './SubmittedHomeworkTab';
import { TestSubmittedTab } from './TestSubmittedTab';

// 1. Add subjects to your interface
interface AdminDashboardClientProps {
  initialStudents: any[]; 
  subjects: any[]; // NEW: Add subjects here
}

// 2. Destructure subjects from the props
export function AdminDashboardClient({ initialStudents, subjects }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 3. Pass subjects down to the StudentListTab */}
      {activeTab === 'students' && (
        <StudentListTab 
          initialStudents={initialStudents} 
          subjects={subjects} 
        />
      )}
      
      {activeTab === 'assigned' && <AssignedWorkTab />}
      {activeTab === 'homework' && <SubmittedHomeworkTab />}
      {activeTab === 'tests' && <TestSubmittedTab />}
    </div>
  );
}