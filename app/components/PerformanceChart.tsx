'use client';

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export interface PerformanceDataPoint {
  week: string;
  overall: number;
  math: number;
  history: number;
  science: number;
}

interface PerformanceChartProps {
  data?: PerformanceDataPoint[];
}

const DUMMY_DATA: PerformanceDataPoint[] = [
  { week: 'Week 1', overall: 50, math: 10, history: 42, science: 35 },
  { week: 'Week 2', overall: 60, math: 45, history: 30, science: 55 },
  { week: 'Week 3', overall: 65, math: 60, history: 50, science: 45 },
  { week: 'Week 4', overall: 60, math: 55, history: 50, science: 40 },
  { week: 'Week 5', overall: 59, math: 45, history: 30, science: 40 },
  { week: 'Week 6', overall: 70, math: 75, history: 60, science: 63 },
  { week: 'Week 7', overall: 73, math: 68, history: 78, science: 55 },
  { week: 'Week 8', overall: 75, math: 85, history: 40, science: 80 },
  { week: 'Week 9', overall: 73, math: 78, history: 65, science: 43 },
  { week: 'Week 10', overall: 80, math: 80, history: 75, science: 85 },
  { week: 'Week 11', overall: 80, math: 95, history: 55, science: 65 },
  { week: 'Week 12', overall: 70, math: 75, history: 58, science: 52 },
];

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data || DUMMY_DATA;

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="week" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            itemStyle={{ color: '#F3F4F6' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>
          
          <Line type="monotone" dataKey="overall" name="OVERALL AVERAGE" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="math" name="Math" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="history" name="History" stroke="#A855F7" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="science" name="Science" stroke="#06B6D4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}