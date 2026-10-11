'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export interface PerformanceDataPoint {
  day:string,
  overall: number;
  marks:Record<string,number>;
}

interface PerformanceChartProps {
  data?: PerformanceDataPoint[];
}

const DUMMY_DATA: PerformanceDataPoint[] = [
  { day: 'day 2', overall: 50, marks:{"history":15,"math":10,"hindi":100} },
  { day: 'day 1', overall: 40, marks:{"history":10,"math":20,"hindi":30} },
  { day: 'day 2', overall: 50, marks:{"history":15,"math":10,} },
  { day: 'day 2', overall: 50, marks:{"history":15,"math":10,"hindi":100} },
  { day: 'day 2', overall: 50, marks:{"history":15,"math":10,"hindi":100} },
];

export function PerformanceChart({ data }: PerformanceChartProps) {
  const rawChartData = DUMMY_DATA;
  const chartData = rawChartData.map((data) =>{
    let rawData : Record<string,any> = {
      day:data.day,
      overall:data.overall,
    }
    if(data.marks){
      Object.entries(data.marks).map(([subject,mark])=>{
        rawData[subject] = mark
      })
    }

    return rawData;
  })

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
          <Line type="monotone" dataKey="hindi" name="Hindi" stroke="#5ba6e4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}