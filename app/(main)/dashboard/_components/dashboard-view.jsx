"use client";
import {
  Clock,
  Briefcase,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  ArrowUpRight,
} from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardView = ({ insights }) => {
  const salaryData =
    insights.salaryRanges?.map((range, index) => ({
      name: range.role,
      min: range.min / 1000,
      max: range.max / 1000,
      median: range.median / 1000,
     
    })) ;

  const demandLevelMap = {
    high: { color: "bg-emerald-500", text: "text-emerald-500", label: "High Demand" },
    medium: { color: "bg-amber-500", text: "text-amber-500", label: "Moderate Demand" },
    low: { color: "bg-rose-500", text: "text-rose-500", label: "Low Demand" },
  };

  const outlookMap = {
    positive: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50/50" },
    neutral: { icon: LineChart, color: "text-amber-500", bg: "bg-amber-50/50" },
    negative: { icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50/50" },
  };

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "PP");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last updated
            </p>
            <p className="text-lg font-semibold">{lastUpdatedDate}</p>
          </div>
        </motion.div>

        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50/50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
        >
          Next update: {nextUpdateDistance}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -5 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Market Outlook
                </CardTitle>
                <CardDescription
                  className={`mt-1 text-2xl font-bold ${outlookMap[insights.marketOutlook.toLowerCase()]?.color}`}
                >
                  {insights.marketOutlook}
                </CardDescription>
              </div>
              <div className={`p-3 rounded-lg ${outlookMap[insights.marketOutlook.toLowerCase()]?.bg}`}>
                {React.createElement(outlookMap[insights.marketOutlook.toLowerCase()]?.icon, {
                  className: `h-6 w-6 ${outlookMap[insights.marketOutlook.toLowerCase()]?.color}`,
                })}
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Industry Growth
                </CardTitle>
                <CardDescription className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.growthRate.toFixed(1)}%
                </CardDescription>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <Progress
                value={insights.growthRate}
                className="h-2 bg-gray-200 dark:bg-gray-700"
                indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Demand Level
                </CardTitle>
                <CardDescription
                  className={`mt-1 text-2xl font-bold ${demandLevelMap[insights.demandLevel.toLowerCase()]?.text}`}
                >
                  {demandLevelMap[insights.demandLevel.toLowerCase()]?.label}
                </CardDescription>
              </div>
              <Briefcase className="h-6 w-6 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="relative pt-2">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${
                        demandLevelMap[insights.demandLevel.toLowerCase()]?.text
                      } ${demandLevelMap[insights.demandLevel.toLowerCase()]?.text.replace(
                        "text",
                        "bg"
                      )}/20`}
                    >
                      {insights.demandLevel}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full ${demandLevelMap[insights.demandLevel.toLowerCase()]?.color}`}
                    style={{
                      width: `${
                        insights.demandLevel === "high"
                          ? 90
                          : insights.demandLevel === "medium"
                          ? 60
                          : 30
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Top Skills
                </CardTitle>
                <CardDescription className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.topSkills.length} in demand
                </CardDescription>
              </div>
              <Brain className="h-6 w-6 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.topSkills.slice(0, 4).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-indigo-200 bg-indigo-50/50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
                  >
                    {skill}
                  </Badge>
                ))}
                {insights.topSkills.length > 4 && (
                  <Badge variant="outline" className="text-gray-500">
                    +{insights.topSkills.length - 4} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Salary Ranges Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div whileHover={{ scale: 1.01 }}>
          <Card className="border-0 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Key Industry Trends</span>
              </CardTitle>
              <CardDescription>Emerging patterns shaping the market</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {insights.keyTrends.map((trend, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <p className="font-medium">{trend}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Potential impact on your career path
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }}>
          <Card className="border-0 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-500" />
                <span>Recommended Skills Development</span>
              </CardTitle>
              <CardDescription>Prioritize these competencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {insights.recommendedSkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        index % 2 === 0
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-indigo-50 dark:bg-indigo-900/20"
                      }`}
                    >
                      <ArrowUpRight
                        className={`h-4 w-4 ${
                          index % 2 === 0
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-indigo-600 dark:text-indigo-400"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
//made it form gemini-styling 