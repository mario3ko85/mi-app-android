import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CostBreakdown } from '../types';

interface ChartSectionProps {
  breakdown: CostBreakdown;
  currency: string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ breakdown, currency }) => {
  const data = [
    { name: 'Material', value: breakdown.materialCost, color: '#22d3ee' }, // cyan-400
    { name: 'Tiempo Máquina', value: breakdown.printTimeCost, color: '#a855f7' }, // purple-500
    { name: 'Post-Proceso', value: breakdown.postProcessCost, color: '#34d399' }, // emerald-400
  ];

  // Filter out zero values so labels don't clutter
  const activeData = data.filter(d => d.value > 0);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatValue(value)}
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              borderRadius: '12px', 
              border: '1px solid #334155', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              color: '#f8fafc'
            }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
