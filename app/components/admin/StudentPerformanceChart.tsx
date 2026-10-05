'use client';

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { PerformanceDataPoint } from '../../services/StudentStatsService';

interface StudentPerformanceChartProps {
  data: PerformanceDataPoint[];
}

export function StudentPerformanceChart({ data }: StudentPerformanceChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="week" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF', fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            itemStyle={{ color: '#F3F4F6', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }}/>
          
          <Line type="monotone" dataKey="overall" name="Overall" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="math" name="Math" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="history" name="History" stroke="#A855F7" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="science" name="Science" stroke="#06B6D4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}