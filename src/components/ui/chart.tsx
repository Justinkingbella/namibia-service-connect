
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from 'clsx';

// Rename the imported cn to avoid conflicts
import { cn as utilsCn } from "@/lib/utils";

const shadowOverlayClassName =
  "pointer-events-none absolute inset-0 rounded-md [mask-image:linear-gradient(black,transparent)]";

const lineBorderStyles = cva(
  "fill-none stroke-[1.5] [stroke-linejoin:round]",
  {
    variants: {
      variant: {
        default: "stroke-foreground/50",
        success: "stroke-success",
        info: "stroke-info",
        warning: "stroke-warning",
        danger: "stroke-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const lineAreaStyles = cva("fill-current opacity-[0.05]", {
  variants: {
    variant: {
      default: "fill-foreground/50",
      success: "fill-success",
      info: "fill-info",
      warning: "fill-warning",
      danger: "fill-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tooltipContentStyles = cva(
  "absolute flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-md transition-opacity",
  {
    variants: {
      position: {
        bottom:
          "top-full -translate-x-1/2 -translate-y-1 data-[align=start]:translate-x-0 data-[align=start]:left-0 data-[align=end]:translate-x-0 data-[align=end]:right-0",
        top: "bottom-full -translate-x-1/2 translate-y-1 data-[align=start]:translate-x-0 data-[align=start]:left-0 data-[align=end]:translate-x-0 data-[align=end]:right-0",
      },
      variant: {
        default: "bg-background text-foreground",
        success: "bg-success text-success-foreground",
        info: "bg-info text-info-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-danger text-danger-foreground",
      },
    },
    defaultVariants: {
      position: "top",
      variant: "default",
    },
  }
);

const timelineStyles = cva(
  "absolute inset-0 pointer-events-none border-l border-dashed",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/50",
        success: "border-success",
        info: "border-info",
        warning: "border-warning",
        danger: "border-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Chart root component
interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={utilsCn("relative rounded-md", className)}
        {...props}
      />
    );
  }
);
Root.displayName = "Chart";

// Tooltips
interface TooltipsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tooltips = React.forwardRef<HTMLDivElement, TooltipsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={utilsCn("absolute inset-0 z-10", className)}
        {...props}
      />
    );
  }
);
Tooltips.displayName = "ChartTooltips";

// Tooltip
interface TooltipProps
  extends VariantProps<typeof tooltipContentStyles>,
    Omit<React.HTMLAttributes<HTMLDivElement>, "align" | "height"> {
  align?: "start" | "center" | "end";
  height?: number;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    { className, position, variant, align = "center", height = 0, ...props },
    ref
  ) => {
    const [xPos, setXPos] = React.useState(0);

    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setXPos(e.clientX);
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    return (
      <div
        ref={ref}
        data-align={align}
        className={utilsCn(
          "opacity-0",
          tooltipContentStyles({ position, variant }),
          className
        )}
        style={{
          left: `${xPos}px`,
          top: position === "top" ? `${height / 2}px` : undefined,
          bottom: position === "bottom" ? `${height / 2}px` : undefined,
        }}
        {...props}
      />
    );
  }
);
Tooltip.displayName = "ChartTooltip";

// Area chart line
interface LineProps
  extends VariantProps<typeof lineBorderStyles>,
    React.SVGAttributes<SVGPathElement> {}

const Line = React.forwardRef<SVGPathElement, LineProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <path
        ref={ref}
        className={utilsCn(lineBorderStyles({ variant }), className)}
        {...props}
      />
    );
  }
);
Line.displayName = "ChartLine";

// Area chart fill
interface AreaProps
  extends VariantProps<typeof lineAreaStyles>,
    React.SVGAttributes<SVGPathElement> {}

const Area = React.forwardRef<SVGPathElement, AreaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <path
        ref={ref}
        className={utilsCn(lineAreaStyles({ variant }), className)}
        {...props}
      />
    );
  }
);
Area.displayName = "ChartArea";

// Bar
interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  showTooltip?: boolean;
}

const Bar = React.forwardRef<HTMLDivElement, BarProps>(
  ({ className, active, showTooltip, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={utilsCn(
          "relative flex h-full items-end bg-muted/50 hover:bg-muted/80 [&:has([data-show=true])]:bg-muted/80",
          className
        )}
        {...props}
      />
    );
  }
);
Bar.displayName = "ChartBar";

// Bar value
interface BarValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  maxValue?: number;
  animate?: boolean;
}

const BarValue = React.forwardRef<HTMLDivElement, BarValueProps>(
  ({ className, value = 0, maxValue = 100, animate = true, ...props }, ref) => {
    const percentage = React.useMemo(
      () => Math.min(100, Math.max(0, (value / maxValue) * 100)),
      [value, maxValue]
    );

    const [width, setWidth] = React.useState(animate ? 0 : percentage);

    React.useEffect(() => {
      if (animate) {
        // Small delay so it animates
        requestAnimationFrame(() => {
          setWidth(percentage);
        });
      } else {
        setWidth(percentage);
      }
    }, [animate, percentage]);

    return (
      <div
        ref={ref}
        className={utilsCn("h-full w-full bg-primary", className)}
        style={{
          width: `${width}%`,
          transition: animate ? "all 1500ms cubic-bezier(0.85, 0, 0.15, 1)" : undefined,
        }}
        {...props}
      />
    );
  }
);
BarValue.displayName = "ChartBarValue";

// Timeline
interface TimelineProps
  extends VariantProps<typeof timelineStyles>,
    React.HTMLAttributes<HTMLDivElement> {
  value: number | string;
  timeline?: boolean;
  dash?: boolean;
  dashed?: boolean; // Alias for dash for DX
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      variant,
      value,
      timeline = false,
      dash = false,
      dashed = false,
      ...props
    },
    ref
  ) => {
    return timeline ? (
      <div
        ref={ref}
        className={utilsCn(
          "absolute inset-0 z-0",
          dash || dashed
            ? timelineStyles({ variant })
            : "border-l pointer-events-none",
          className
        )}
        style={{
          left: `${value}%`,
        }}
        {...props}
      >
        <div
          className={utilsCn("h-2.5 w-2.5", {
            "w-1": dash || dashed,
            "w-0 border-[1.5px] border-dashed bg-transparent": dash || dashed,
            "my-0.5": dash || dashed,
          })}
        />
      </div>
    ) : null;
  }
);
Timeline.displayName = "ChartTimeline";

// Export as Chart component with sub-components
export const Chart = Object.assign(Root, {
  Line,
  Area,
  Bar,
  BarValue,
  Timeline,
  Tooltip,
  Tooltips,
});
