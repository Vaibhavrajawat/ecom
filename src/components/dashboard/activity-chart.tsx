import React from "react";

interface ActivityData {
  date: string;
  value: number;
}

// Mock data for the chart
const mockActivityData: ActivityData[] = [
  { date: "Jan", value: 12 },
  { date: "Feb", value: 28 },
  { date: "Mar", value: 18 },
  { date: "Apr", value: 34 },
  { date: "May", value: 42 },
  { date: "Jun", value: 30 },
  { date: "Jul", value: 56 },
];

export function ActivityChart() {
  // Find the maximum value for scaling
  const maxValue = Math.max(...mockActivityData.map((item) => item.value));

  return (
    <div className="w-full h-[200px] p-6">
      <div className="relative h-full flex items-end justify-between">
        {mockActivityData.map((item, index) => {
          const heightPercentage = (item.value / maxValue) * 100;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end"
              style={{ height: "100%" }}
            >
              <div
                className="w-8 rounded-t-md bg-gradient-to-t from-purple-600 to-blue-600 relative group"
                style={{ height: `${heightPercentage}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-background border rounded px-2 py-1 text-xs whitespace-nowrap">
                    {item.value} visits
                  </div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                {item.date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
