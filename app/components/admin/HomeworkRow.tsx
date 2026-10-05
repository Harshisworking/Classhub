import React from 'react';
import { HomeworkSubmission } from '../../services/HomeworkService';

interface HomeworkRowProps {
  submission: HomeworkSubmission;
  isUpdating: boolean;
  onMarkChecked: (id: string) => void;
  onDownload: (fileUrl: string) => void; // Make sure this expects the URL!
}

export function HomeworkRow({ submission, isUpdating, onMarkChecked, onDownload }: HomeworkRowProps) {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4">
        <div className="font-medium text-white">{submission.studentName}</div>
      </td>
      
      <td className="p-4">
        <div className="text-gray-300">{submission.title}</div>
        {/* Displays the physical filename as a small subtext underneath the title */}
        <div className="text-xs text-gray-500 mt-1">{submission.fileName}</div>
      </td>
      
      <td className="p-4 text-gray-400 text-sm">
        {submission.dateSubmitted}
      </td>
      
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
          submission.status === 'Checked'
            ? 'bg-green-900/50 text-green-400 border-green-800/50'
            : 'bg-yellow-900/50 text-yellow-400 border-yellow-800/50'
        }`}>
          {submission.status}
        </span>
      </td>
      
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-3">
          
          {/* FIX: Pass the fileUrl to the onDownload handler */}
          <button
            onClick={() => onDownload(submission.studentFileUrl)}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            View PDF
          </button>
          
          {/* Only show the "Mark Checked" button if it is currently Pending */}
          {submission.status === 'Pending' && (
            <button
              onClick={() => onMarkChecked(submission.id)}
              disabled={isUpdating}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isUpdating 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Mark Checked'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}