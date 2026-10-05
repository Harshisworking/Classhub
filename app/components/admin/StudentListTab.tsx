'use client';

import React, { useState } from 'react';
import { StudentRow } from './StudentRow';
import { AssignmentModal } from './AssignmentModal';
import { StudentStatsModal } from './StudentStatsModal';

export function StudentListTab({ 
  initialStudents, 
  subjects 
}: { 
  initialStudents: any[], 
  subjects: any[] 
}) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  
  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalStudentId, setAssignModalStudentId] = useState<number>(0); // NEW: Track the Student ID
  const [assignModalStudentName, setAssignModalStudentName] = useState('');
  const [assignModalType, setAssignModalType] = useState<'Test' | 'Homework'>('Homework');

  // Stats Modal State
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [statsStudentId, setStatsStudentId] = useState<number | null>(null);
  const [statsStudentName, setStatsStudentName] = useState('');

  const handleSelect = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents(initialStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // NEW: Updated to accept `id` as the first parameter
  const openAssignModal = (id: number, studentName: string, type: 'Test' | 'Homework') => {
    setAssignModalStudentId(id);
    setAssignModalStudentName(studentName);
    setAssignModalType(type);
    setIsAssignModalOpen(true);
  };

  const openStatsModal = (id: number, name: string) => {
    setStatsStudentId(id);
    setStatsStudentName(name);
    setIsStatsModalOpen(true);
  };

  const isAllSelected = selectedStudents.length === initialStudents.length && initialStudents.length > 0;

  return (
    <>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="accent-blue-500 w-4 h-4 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                />
              </th>
              <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider w-1/4">Student Name</th>
              <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Performance Stats</th>
              <th className="p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider text-right">Available Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialStudents.map((student) => (
              <StudentRow
                key={student.id}
                id={student.id}
                name={student.name}
                stats={student.stats}
                isSelected={selectedStudents.includes(student.id)}
                onSelect={handleSelect}
                onOpenAssignModal={openAssignModal} 
                onViewStats={openStatsModal}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AssignmentModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        studentId={assignModalStudentId} // NEW: Pass the ID into the modal
        studentName={assignModalStudentName}
        assignmentType={assignModalType}
        subjects={subjects} 
      />

      <StudentStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        studentId={statsStudentId}
        studentName={statsStudentName}
      />
    </>
  );
}