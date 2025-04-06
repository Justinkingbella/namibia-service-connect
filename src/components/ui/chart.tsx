
import React from 'react';
import { 
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar, Line, Pie,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell, 
  ResponsiveContainer 
} from 'recharts';

interface ChartProps {
  data: any[];
  height?: number;
  width?: number;
  className?: string;
}

export const BarChart = ({ 
  data, 
  height = 300, 
  width = 500,
  className 
}: ChartProps & { 
  xDataKey?: string;
  barDataKey?: string;
  fill?: string;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const LineChart = ({ 
  data, 
  height = 300, 
  width = 500,
  className 
}: ChartProps & { 
  xDataKey?: string;
  lineDataKey?: string;
  stroke?: string;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const PieChart = ({ 
  data, 
  height = 300, 
  width = 500,
  className 
}: ChartProps & {
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// Default export for convenience
export default {
  BarChart,
  LineChart,
  PieChart,
};
