'use client';

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export interface PerformanceDataPoint {
  day:string,
  overall: number;
  math: number;
  history: number;
  science: number;
}

interface PerformanceChartProps {
  data?: PerformanceDataPoint[];
}

const DUMMY_DATA: PerformanceDataPoint[] = [
  { day: 'day 1', overall: 50, math: 10, history: 42, science: 35 },
  { day: 'day 2', overall: 60, math: 45, history: 30, science: 55 },
  { day: 'day 3', overall: 65, math: 60, history: 50, science: 45 },
  { day: 'day 4', overall: 60, math: 55, history: 50, science: 40 },
  { day: 'day 5', overall: 59, math: 45, history: 30, science: 40 },
  { day: 'day 6', overall: 70, math: 75, history: 60, science: 63 },
  { day: 'day 7', overall: 73, math: 68, history: 78, science: 55 },
];

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = DUMMY_DATA;

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="day" 
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