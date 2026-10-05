'use client';

import React from 'react';
import { LogoutButton } from '../LogoutButton';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  const tabs = [
    { id: 'students', label: 'Students' },
    { id: 'assigned', label: 'Assigned Work History' }, // New Tab
    { id: 'homework', label: 'Submitted Homework' },
    { id: 'tests', label: 'Test Submitted' },
  ];

  return (
    <div className="flex gap-6 mb-8 border-b border-gray-800 pb-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`pb-2 px-2 font-semibold whitespace-nowrap transition-colors ${
          activeTab === tab.id
          ? 'text-blue-500 border-b-2 border-blue-500'
          : 'text-gray-500 hover:text-gray-300'
        }`}
        >
          {tab.label}
        </button>
      ))}
      <LogoutButton></LogoutButton>
    </div>
  );
}