"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments?.length > 0) {
      const formattedData = assessments
        .map((assessment) => ({
          date: format(new Date(assessment.createdAt), "MMM dd"),
          score: assessment.quizScore,
          fullDate: format(new Date(assessment.createdAt), "yyyy-MM-dd"),
        }))
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
      setChartData(formattedData);
    }
  }, [assessments]);

  // Calculate average score for reference line
  const averageScore = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length 
    : 0;

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Performance Trend
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Your progress over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                strokeOpacity={0.2} 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background border rounded-lg p-4 shadow-xl">
                        <p className="font-bold text-lg text-primary">
                          {payload[0].value}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payload[0].payload.date}
                        </p>
                        <p className="text-xs mt-1">
                          {payload[0].value > averageScore 
                            ? "↑ Above your average" 
                            : "↓ Below your average"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey={() => averageScore}
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={`Average (${averageScore.toFixed(1)}%)`}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-muted-foreground text-sm">{value}</span>
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}