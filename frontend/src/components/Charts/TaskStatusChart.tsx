'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Task } from '@/constants/interfaces';

interface TaskStatusChartProps {
  tasks: Task[];
  type: 'status' | 'priority';
}

const STATUS_COLORS = {
  todo: '#9CA3AF',      // gray
  'in-progress': '#3B82F6', // blue
  done: '#10B981',      // green
};

const PRIORITY_COLORS = {
  low: '#10B981',       // green
  medium: '#F59E0B',    // yellow
  high: '#EF4444',      // red
};

const STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function TaskStatusChart({ tasks, type }: TaskStatusChartProps) {
  const chartData = useMemo(() => {
    if (type === 'status') {
      const statusCounts = {
        todo: tasks.filter(t => t.status === 'todo').length,
        'in-progress': tasks.filter(t => t.status === 'in-progress').length,
        done: tasks.filter(t => t.status === 'done').length,
      };

      return Object.entries(statusCounts)
        .map(([key, value]) => ({
          name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
          value,
          color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
        }))
        .filter(item => item.value > 0);
    } else {
      const priorityCounts = {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
      };

      return Object.entries(priorityCounts)
        .map(([key, value]) => ({
          name: PRIORITY_LABELS[key as keyof typeof PRIORITY_LABELS],
          value,
          color: PRIORITY_COLORS[key as keyof typeof PRIORITY_COLORS],
        }))
        .filter(item => item.value > 0);
    }
  }, [tasks, type]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border  border-gray-300 dark:border-white/20 rounded-lg p-3 shadow-xl backdrop-blur-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-white/80 text-sm">Tasks: {payload[0].value}</p>
          <p className="text-white/60 text-xs">
            {((payload[0].value / tasks.length) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/80 text-sm">{entry.value}</span>
            </div>
            <span className="text-white/60 text-sm">
              {entry.payload.value} ({((entry.payload.value / tasks.length) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/60">
        <p>No tasks to display</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/60">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
