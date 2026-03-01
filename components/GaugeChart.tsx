import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  score: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ score }) => {
  // Data for the gauge: [Score, Remaining]
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  // Determine color based on score
  let color = '#EF4444'; // Red (Fraud)
  if (score >= 80) color = '#10B981'; // Green (Authentic)
  else if (score >= 50) color = '#F59E0B'; // Yellow (Suspicious)

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="score" fill={color} />
            <Cell key="remaining" fill="#1e293b" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-4xl font-bold font-mono text-white tracking-tighter">
          {score}%
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">
          Trust Score
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
