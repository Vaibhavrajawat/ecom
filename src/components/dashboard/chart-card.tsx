import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  className?: string;
  chart: React.ReactNode;
  filter?: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  className,
  chart,
  filter,
}: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {filter && <div>{filter}</div>}
      </CardHeader>
      <CardContent className="p-0">{chart}</CardContent>
    </Card>
  );
}
