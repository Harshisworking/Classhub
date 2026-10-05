'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AssignedWorkRow } from './AssignedWorkRow';
import { AssignedWorkService, AssignedWorkItem } from '../../services/AssignedWorkService';

export function AssignedWorkTab() {
  const [workItems, setWorkItems] = useState<AssignedWorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Isolate the service instance
  const workService = useRef(new AssignedWorkService());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await workService.current.getAssignedWork();
        setWorkItems(data);
      } catch (error) {
        console.error("Failed to load assigned work", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewDetails = (id: string) => {
    // You can route this to a dynamic page (e.g., /admin/assignment/[id]) or open a modal
    console.log(`Viewing details for submission ID: ${id}`);
    alert(`View Details clicked for ID: ${id}`);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800/50 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <th className="p-4">Student</th>
            <th className="p-4">Type</th>
            <th className="p-4">Title</th>
            <th className="p-4">Date Assigned</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-500 animate-pulse">
                Loading assigned work...
              </td>
            </tr>
          ) : workItems.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-500">
                No work has been assigned yet.
              </td>
            </tr>
          ) : (
            workItems.map((item) => (
              <AssignedWorkRow 
                key={item.id} 
                item={item} 
                onViewDetails={handleViewDetails} 
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}