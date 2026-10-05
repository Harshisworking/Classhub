import React from 'react';
import { AssignedWorkItem } from '../../services/AssignedWorkService';

interface AssignedWorkRowProps {
  item: AssignedWorkItem;
  onViewDetails: (id: string) => void;
}

export function AssignedWorkRow({ item, onViewDetails }: AssignedWorkRowProps) {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4">
        <div className="font-medium text-white">{item.studentName}</div>
      </td>
      
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded text-xs font-medium ${
          item.type === 'HOMEWORK'
            ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50'
            : 'bg-green-900/40 text-green-400 border border-green-800/50'
        }`}>
          {item.type === 'HOMEWORK' ? 'Homework' : 'Test'}
        </span>
      </td>
      
      <td className="p-4 text-gray-300">
        {item.title}
      </td>
      
      <td className="p-4 text-gray-400 text-sm">
        {item.dateAssigned}
      </td>
      
      <td className="p-4 text-right">
        <button
          onClick={() => onViewDetails(item.id)}
          className="px-3 py-1.5 text-sm text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}