
import React, { useState, useMemo } from 'react';
import { classNames } from '@/lib/utils';

// Create a simple bar chart component that doesn't rely on external dependencies
interface DataPoint {
  date?: string;
  value: number;
  label: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  width?: string;
  title?: string;
  subtitle?: string;
  chartColor?: string;
  className?: string;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  width = '100%',
  title,
  subtitle,
  chartColor = '#4f46e5',
  className,
}) => {
  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value)) * 1.1; // Add 10% padding
  }, [data]);

  return (
    <div className={classNames("flex flex-col", className)} style={{ width }}>
      {title && <h3 className="text-base font-medium">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      
      <div className="mt-6" style={{ height }}>
        <div className="flex h-full">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between pr-2 text-xs text-gray-500">
            <span>{Math.round(maxValue)}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="flex-1">
            <div className="relative h-full">
              {/* Grid lines */}
              <div className="absolute w-full h-full flex flex-col justify-between">
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
              </div>
              
              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around">
                {data.map((d, i) => {
                  const heightPercentage = (d.value / maxValue) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center" style={{ width: `${100 / data.length}%` }}>
                      <div 
                        className="w-9 mb-1 rounded-t"
                        style={{ 
                          height: `${heightPercentage}%`,
                          backgroundColor: chartColor,
                        }}
                        title={`${d.label}: ${d.value}`}
                      ></div>
                      <span className="text-xs text-gray-500">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  width?: number;
  height?: number;
  className?: string;
}

export const SimplePieChart: React.FC<PieChartProps> = ({
  data,
  width = 300,
  height = 300,
  className,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;
  
  return (
    <div className={classNames("flex flex-col items-center", className)}>
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {data.map((item, i) => {
              const percent = item.value / total;
              const startAngle = 2 * Math.PI * cumulativePercent;
              const endAngle = 2 * Math.PI * (cumulativePercent + percent);
              
              const startX = Math.cos(startAngle) * width/2.5;
              const startY = Math.sin(startAngle) * height/2.5;
              const endX = Math.cos(endAngle) * width/2.5;
              const endY = Math.sin(endAngle) * height/2.5;
              
              const largeArcFlag = percent > 0.5 ? 1 : 0;
              
              cumulativePercent += percent;
              
              const pathData = [
                `M ${startX} ${startY}`,
                `A ${width/2.5} ${height/2.5} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`
              ].join(' ');
              
              return (
                <path
                  key={i}
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        </svg>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm">{item.label} ({Math.round(item.value / total * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LineChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
  width?: string;
  lineColor?: string;
  className?: string;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  height = 300,
  width = '100%',
  lineColor = '#4f46e5',
  className,
}) => {
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
  const minValue = Math.min(0, ...data.map(d => d.value));
  
  // Generate points for the polyline
  const points = data.map((d, i) => {
    const x = `${(i / (data.length - 1)) * 100}%`;
    const y = `${100 - ((d.value - minValue) / (maxValue - minValue)) * 100}%`;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className={classNames("flex flex-col", className)} style={{ width }}>
      <div style={{ height }}>
        <div className="relative h-full">
          {/* Grid lines */}
          <div className="absolute w-full h-full flex flex-col justify-between">
            <div className="border-t border-gray-200"></div>
            <div className="border-t border-gray-200"></div>
            <div className="border-t border-gray-200"></div>
            <div className="border-t border-gray-200"></div>
            <div className="border-t border-gray-200"></div>
          </div>
          
          {/* Chart */}
          <svg width="100%" height="100%" className="overflow-visible">
            <polyline
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
              points={points}
            />
            
            {/* Data points */}
            {data.map((d, i) => {
              const x = `${(i / (data.length - 1)) * 100}%`;
              const y = `${100 - ((d.value - minValue) / (maxValue - minValue)) * 100}%`;
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke={lineColor}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between transform translate-y-6">
            {data.map((d, i) => {
              // Only show some x-axis labels to prevent overcrowding
              if (i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 5) === 0) {
                return (
                  <span key={i} className="text-xs text-gray-500">
                    {d.date}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
