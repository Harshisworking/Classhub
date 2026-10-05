'use client';

import React, { useState } from 'react';

export interface HomeworkCardProps {
  subject: string;
  title: string;
  icon: string;
  due: string;
  assigned: string;
  status: 'ASSIGNED' | 'SUBMITTED';
  subtext?: string;
  contentType?: 'text' | 'pdf';
  contentPayload?: string; // Text content or PDF URL
  fileUrl:string
  onSubmit?: (file: File) => void;
}

function getStatusColors(status: string) {
  switch (status) {
    case 'ASSIGNED':
      return 'bg-blue-900 text-blue-300 border-blue-700';
    case 'SUBMITTED':
      return 'bg-green-900 text-green-300 border-green-700';
    default:
      return 'bg-gray-700 text-gray-300 border-gray-600';
  }
}

export function HomeworkCard({
  fileUrl,
  subject,
  title,
  icon,
  due,
  assigned,
  status,
  subtext,
  contentType = 'text',
  contentPayload = 'No content provided for this assignment.',
  onSubmit
}: HomeworkCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const statusClasses = getStatusColors(status);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit?.(selectedFile);
      setIsModalOpen(false);
      setSelectedFile(null);
    }
  };

  return (
    <>
      {/* Card UI */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{subject}</span>
          <button className="text-gray-500 hover:text-gray-300">•••</button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl bg-gray-900 p-2 rounded-lg border border-gray-700">
            {icon}
          </div>
          <h3 className="font-bold text-lg text-white leading-tight">{title}</h3>
        </div>

        <div className="text-sm text-gray-400 mb-6 flex-1">
          Due {due} | Assigned {assigned}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <span className={`text-xs font-bold px-2 py-1 rounded border ${statusClasses}`}>
              {status}
            </span>
          </div>
          {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
        </div>

        <div className="flex gap-4 text-sm font-medium pt-4 border-t border-gray-700">
          {status === 'ASSIGNED' ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Start Work
            </button>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              View Submission
            </button>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl flex flex-col max-h-[90vh] shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{icon}</span> {title}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Assignment Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-950/50">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Instructions / Materials</h4>
              {contentType === 'pdf' ? (
                <iframe 
                  src={contentPayload} 
                  className="w-full h-96 rounded-lg border border-gray-700 bg-white"
                  title="Homework PDF"
                />
              ) : (
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {contentPayload}
                </div>
              )}
            </div>

            {/* Modal Footer - Submission Area */}
            {status === 'ASSIGNED' && (
              <div className="p-6 border-t border-gray-800 bg-gray-900 rounded-b-xl">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Submit Your Work</h4>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-900/50 file:text-blue-300
                      hover:file:bg-blue-900/80 cursor-pointer"
                  />
                  <button 
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                      selectedFile 
                        ? 'bg-blue-600 text-white hover:bg-blue-500' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Assignment
                  </button>
                </div>
              </div>
            )}
            
            {status === 'SUBMITTED' && (
              <div className="p-6 border-t border-gray-800 bg-gray-900 rounded-b-xl">
                <div className="text-green-400 font-medium flex items-center gap-2">
                  ✓ Assignment submitted successfully
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </>
  );
}