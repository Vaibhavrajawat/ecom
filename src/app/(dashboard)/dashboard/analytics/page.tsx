"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { BarChart3, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed metrics and performance insights
        </p>
      </div>

      {/* Main analytics charts */}
      <div className="grid gap-6">
        <ChartCard
          title="User Activity"
          description="Daily visits over time"
          chart={<ActivityChart />}
          filter={
            <div className="flex items-center bg-muted/50 rounded-md px-2 text-xs">
              <span>This Week</span>
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </div>
          }
        />

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Page Views",
              icon: <BarChart3 className="h-4 w-4 text-purple-500" />,
              data: [
                { label: "Home", value: "42%" },
                { label: "Products", value: "28%" },
                { label: "Pricing", value: "18%" },
                { label: "Blog", value: "12%" },
              ],
            },
            {
              title: "Traffic Sources",
              icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
              data: [
                { label: "Direct", value: "35%" },
                { label: "Organic", value: "25%" },
                { label: "Referral", value: "22%" },
                { label: "Social", value: "18%" },
              ],
            },
            {
              title: "Conversion Rates",
              icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
              data: [
                { label: "Signup", value: "3.2%" },
                { label: "Premium", value: "1.8%" },
                { label: "Purchase", value: "2.5%" },
                { label: "Retention", value: "68%" },
              ],
            },
          ].map((chart, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {chart.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                  {chart.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chart.data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="font-medium text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Real-time metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border border-border bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm">
                      User_{Math.floor(Math.random() * 1000)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {
                        [
                          "Viewing products",
                          "Added to cart",
                          "Completed checkout",
                          "Browsing homepage",
                          "Subscribed",
                        ][index - 1]
                      }
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {index} {index === 1 ? "minute" : "minutes"} ago
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
