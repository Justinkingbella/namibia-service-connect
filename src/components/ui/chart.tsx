
// Just need to fix the cn import and usage
import * as React from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, Bar, Line, LinePath } from "@visx/shape";
import { defaultStyles, Tooltip, useTooltip } from "@visx/tooltip";
import { extent } from "d3-array";
import { Vignette } from "@visx/vignette";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { withScreenSize } from "@visx/responsive";
import { WithScreenSizeProps } from "@visx/responsive/lib/enhancers/withScreenSize";
import { curveMonotoneX } from "@visx/curve";

// Custom cn function to avoid conflict with imported one
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

// Extra styles for the chart tooltip
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(25, 25, 28, 0.9)",
  color: "white",
  fontSize: "12px",
  padding: "8px",
  borderRadius: "4px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  textAlign: "center" as const,
};

// Chart data types
export type ChartData = {
  date: Date;
  value: number;
};

// Chart props
interface ChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  tooltipContent?: (data: ChartData) => React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showTooltip?: boolean;
  showVignette?: boolean;
  showAxis?: boolean;
  showGrid?: boolean;
  showArea?: boolean;
  areaOpacity?: number;
  lineWidth?: number;
  lineColor?: string;
  areaColor?: string;
  axisColor?: string;
  valueFormatter?: (value: number) => string;
  dateFormatter?: (date: Date) => string;
  curveType?: typeof curveMonotoneX;
  minYValue?: number;
  maxYValue?: number;
  horizontalLineAtY?: number;
  strokeDasharray?: string;
  strokeLinecap?: "butt" | "round" | "square";
}

type FullChartProps = ChartProps & WithScreenSizeProps;

// Simple chart component using visx
const Chart = withScreenSize(
  ({
    data,
    width = 500,
    height = 300,
    margin = { top: 40, right: 30, bottom: 50, left: 40 },
    tooltipContent,
    xAxisLabel,
    yAxisLabel,
    showTooltip = true,
    showVignette = false,
    showAxis = true,
    showGrid = true,
    showArea = true,
    areaOpacity = 0.5,
    lineWidth = 2,
    lineColor = "#2563eb",
    areaColor = "#3b82f6",
    axisColor = "#888888",
    valueFormatter = (value: number) => `${value}`,
    dateFormatter = (date: Date) => date.toLocaleDateString(),
    curveType = curveMonotoneX,
    minYValue,
    maxYValue,
    horizontalLineAtY,
    strokeDasharray,
    strokeLinecap,
  }: FullChartProps) => {
    // Tooltip hooks
    const {
      showTooltip: handleShowTooltip,
      hideTooltip,
      tooltipData,
      tooltipLeft = 0,
      tooltipTop = 0,
    } = useTooltip<ChartData>();

    if (!width || !height) return null;

    // Bounds
    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(height - margin.top - margin.bottom, 0);

    // Scales
    const timeScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, (d) => d.date) as [Date, Date],
    });

    const valueScale = scaleLinear({
      range: [yMax, 0],
      domain: [
        minYValue !== undefined ? minYValue : Math.min(...data.map((d) => d.value)),
        maxYValue !== undefined ? maxYValue : Math.max(...data.map((d) => d.value)),
      ],
      nice: true,
    });

    // Handle tooltip display
    const handleTooltip = React.useCallback(
      (
        event: React.MouseEvent<SVGRectElement> | React.TouchEvent<SVGRectElement>
      ) => {
        if (!showTooltip) return;

        const { x } = localPoint(event) || { x: 0 };
        const x0 = timeScale.invert(x - margin.left);

        // Find the closest data point to mouse position
        const bisectDate = (
          data: ChartData[],
          date: Date
        ): ChartData => {
          const bisector = (d: ChartData) => d.date;
          const index = data.findIndex((d) => bisector(d) > date);
          if (index === -1) return data[data.length - 1];
          if (index === 0) return data[0];
          
          const d0 = data[index - 1];
          const d1 = data[index];
          return date.valueOf() - d0.date.valueOf() > d1.date.valueOf() - date.valueOf()
            ? d1
            : d0;
        };

        const tooltipData = bisectDate(data, x0);
        const tooltipLeft = timeScale(tooltipData.date);
        const tooltipTop = valueScale(tooltipData.value);

        handleShowTooltip({
          tooltipData,
          tooltipLeft,
          tooltipTop,
        });
      },
      [
        timeScale,
        valueScale,
        data,
        margin,
        handleShowTooltip,
        showTooltip,
      ]
    );

    // Use string or boolean type for className
    const getClassName = (className: string): string | boolean => {
      return className;
    };

    return (
      <div style={{ position: "relative" }}>
        <svg width={width} height={height}>
          <LinearGradient
            id="area-gradient"
            from={areaColor}
            to={areaColor}
            toOpacity={areaOpacity}
          />

          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={12}
          />

          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Grid */}
            {showGrid && (
              <GridRows
                scale={valueScale}
                width={xMax}
                height={yMax}
                stroke="#e0e0e0"
                strokeDasharray="1,3"
                strokeOpacity={0.2}
                numTicks={5}
              />
            )}

            {/* Area */}
            {showArea && (
              <AreaClosed
                data={data}
                x={(d) => timeScale(d.date)}
                y={(d) => valueScale(d.value)}
                yScale={valueScale}
                fill="url(#area-gradient)"
                stroke={lineColor}
                strokeWidth={lineWidth}
                curve={curveType}
              />
            )}

            {/* Line */}
            <LinePath
              data={data}
              x={(d) => timeScale(d.date)}
              y={(d) => valueScale(d.value)}
              stroke={lineColor}
              strokeWidth={lineWidth}
              curve={curveType}
              strokeDasharray={strokeDasharray}
              strokeLinecap={strokeLinecap}
              className="transition-all duration-300 ease-in-out"
            />

            {/* Horizontal line at specific value */}
            {horizontalLineAtY !== undefined && (
              <Line
                from={{ x: 0, y: valueScale(horizontalLineAtY) }}
                to={{ x: xMax, y: valueScale(horizontalLineAtY) }}
                stroke={axisColor}
                strokeWidth={1}
                className={
                  classNames({
                    "w-1": true,
                    "w-0 border-[1.5px] border-dashed bg-transparent": true,
                    "my-0.5": true
                  })
                }
              />
            )}

            {/* Axes */}
            {showAxis && (
              <>
                <AxisBottom
                  top={yMax}
                  scale={timeScale}
                  numTicks={5}
                  stroke={axisColor}
                  tickStroke={axisColor}
                  tickFormat={(date) =>
                    dateFormatter(date as Date)
                  }
                  tickLabelProps={() => ({
                    fill: axisColor,
                    fontSize: 12,
                    textAnchor: "middle",
                    dy: "0.33em",
                  })}
                  label={xAxisLabel}
                  labelProps={{
                    fill: axisColor,
                    fontSize: 12,
                    textAnchor: "middle",
                    dy: "3.5em",
                  }}
                />
                <AxisLeft
                  left={0}
                  scale={valueScale}
                  numTicks={5}
                  stroke={axisColor}
                  tickStroke={axisColor}
                  tickFormat={(value) =>
                    valueFormatter(value as number)
                  }
                  tickLabelProps={() => ({
                    fill: axisColor,
                    fontSize: 12,
                    textAnchor: "end",
                    dy: "0.33em",
                    dx: "-0.33em",
                  })}
                  label={yAxisLabel}
                  labelProps={{
                    fill: axisColor,
                    fontSize: 12,
                    textAnchor: "middle",
                    transform: "rotate(-90)",
                    y: -30,
                  }}
                />
              </>
            )}

            {/* Overlay for tooltip */}
            {showTooltip && (
              <Bar
                x={0}
                y={0}
                width={xMax}
                height={yMax}
                fill="transparent"
                onMouseMove={handleTooltip}
                onMouseLeave={hideTooltip}
              />
            )}
          </g>

          {/* Vignette effect */}
          {showVignette && (
            <Vignette
              x={0}
              y={0}
              width={width}
              height={height}
              fill="transparent"
              radius={0.5}
              opacity={0.2}
              start={[0, 0]}
              end={[1, 1]}
            />
          )}
        </svg>

        {showTooltip && tooltipData && (
          <Tooltip
            top={tooltipTop + margin.top}
            left={tooltipLeft + margin.left}
            style={tooltipStyles}
          >
            {tooltipContent ? (
              tooltipContent(tooltipData)
            ) : (
              <div>
                <div>{dateFormatter(tooltipData.date)}</div>
                <div>{valueFormatter(tooltipData.value)}</div>
              </div>
            )}
          </Tooltip>
        )}
      </div>
    );
  }
);

export default Chart;
