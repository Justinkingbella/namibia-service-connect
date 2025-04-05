
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils";

export interface ChartProps {
  title: string
  description?: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
    }[]
  }
  isLoading?: boolean
  className?: string
}

export function Chart({
  title,
  description,
  data,
  isLoading,
  className,
}: ChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
            <p className="text-muted-foreground">
              Chart visualization requires chart.js. Please install: chart.js and react-chartjs-2
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
