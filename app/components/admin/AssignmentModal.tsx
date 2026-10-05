'use client';

import React, { useState } from 'react';

export interface Subject {
  id: number;
  name: string;
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
  assignmentType: 'Test' | 'Homework';
  subjects: Subject[];
}

export function AssignmentModal({ isOpen, onClose, studentId, studentName, assignmentType, subjects }: AssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [inputMode, setInputMode] = useState<'type' | 'upload'>('type');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAssign = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', assignmentType.toUpperCase()); 
      formData.append('inputMode', inputMode === 'type' ? 'TEXT' : 'PDF'); 
      formData.append('subjectId', selectedSubjectId);
      formData.append('studentId', studentId.toString());

      if (inputMode === 'type') {
        formData.append('textContent', textContent);
      } else if (inputMode === 'upload' && selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('/api/assignments', {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to assign work');
      }

      setTitle('');
      setTextContent('');
      setSelectedSubjectId('');
      setSelectedFile(null);
      onClose();
      
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to assign work. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !title.trim() || !selectedSubjectId || (inputMode === 'type' ? !textContent.trim() : !selectedFile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          Assign {assignmentType} to {studentName}
        </h2>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Assignment Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., Chapter 5 Review"
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
            <select 
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Select a subject...</option>
              {subjects?.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>

          {/* Format Toggle Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => setInputMode('type')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  inputMode === 'type' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  inputMode === 'upload' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
              >
                PDF Upload
              </button>
            </div>
          </div>

          {/* Dynamic Input (Text vs File) */}
          {inputMode === 'type' ? (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Questions / Instructions</label>
              <textarea 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Type the assignment details here..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Upload PDF</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700 cursor-pointer"
              />
            </div>
          )}
        </div>
        
        {/* Footer Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleAssign}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
              isSubmitDisabled || isSubmitting
                ? 'bg-blue-600/50 text-white/50 border-blue-500/50 cursor-not-allowed'
                : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
            }`}
            disabled={isSubmitDisabled || isSubmitting}
          >
            {isSubmitting ? 'Assigning...' : `Assign ${assignmentType}`}
          </button>
        </div>

      </div>
    </div>
  );
}