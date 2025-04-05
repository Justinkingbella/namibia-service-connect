
import React from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
  date?: string | Date;
  value: number;
  label?: string;
}

export interface ChartProps {
  data: DataPoint[];
  height?: number;
  width?: number;
  title?: string;
  description?: string;
  className?: string;
}

export function SimpleChart({
  data,
  height = 300,
  width = 500,
  title,
  description,
  className,
}: ChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div 
        className="w-full overflow-hidden rounded-md border bg-background"
        style={{ height }}
      >
        <div className="flex h-full">
          {data.map((d, i) => (
            <div 
              key={i} 
              className="group relative flex h-full flex-1 flex-col justify-end px-1"
            >
              <div 
                className="relative flex flex-col items-center"
                style={{ height: `${(d.value / max) * 100}%` }}
              >
                <div className="w-full bg-primary opacity-80 rounded-sm" style={{ height: '100%' }}></div>
              </div>
              <div className="pt-1 text-center text-[10px]">
                {typeof d.date === 'string' ? d.date.slice(5, 10) : d.label || ''}
              </div>
              <div className="absolute bottom-[30px] left-1/2 z-10 min-w-max -translate-x-1/2 rounded-md bg-black p-2 text-xs text-white opacity-0 group-hover:opacity-100">
                <div>{d.value}</div>
                <div>{typeof d.date === 'string' ? d.date : d.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LineChart({ data, height = 300, width = 500, title, description, className }: ChartProps) {
  return <SimpleChart data={data} height={height} width={width} title={title} description={description} className={className} />;
}

export function BarChart({ data, height = 300, width = 500, title, description, className }: ChartProps) {
  return <SimpleChart data={data} height={height} width={width} title={title} description={description} className={className} />;
}

export function PieChart({ data, height = 300, width = 500, title, description, className }: ChartProps) {
  // For simplicity, we're just using the SimpleChart for now
  return <SimpleChart data={data} height={height} width={width} title={title} description={description} className={className} />;
}

export function AreaChart({ data, height = 300, width = 500, title, description, className }: ChartProps) {
  return <SimpleChart data={data} height={height} width={width} title={title} description={description} className={className} />;
}

export { SimpleChart as Chart };
