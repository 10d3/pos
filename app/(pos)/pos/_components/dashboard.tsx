// app/(dashboard)/dashboard/_components/dashboard.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  format,
  startOfWeek,
  startOfMonth,
  startOfYear,
  startOfDay,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachHourOfInterval,
  addHours,
} from "date-fns";

export function Overview({
  data,
  timeframe,
}: {
  data: Array<{
    createdAt: Date;
    _sum: { total: number | null };
  }>;
  timeframe: "day" | "week" | "month" | "year";
}) {
  // Get the appropriate date range based on timeframe
  const now = new Date();
  let dates: Date[] = [];
  let groupFormat: string;
  let xAxisFormat: (date: Date) => string;

  switch (timeframe) {
    case "day":
      // For day view, show hourly data
      const dayStart = startOfDay(now);
      dates = eachHourOfInterval({
        start: dayStart,
        end: addHours(dayStart, 23),
      });
      groupFormat = "yyyy-MM-dd-HH";
      xAxisFormat = (date) => format(date, "HH:mm");
      break;

    case "week":
      const weekStart = startOfWeek(now);
      dates = eachDayOfInterval({ start: weekStart, end: now });
      groupFormat = "yyyy-MM-dd";
      xAxisFormat = (date) => format(date, "EEE");
      break;

    case "month":
      const monthStart = startOfMonth(now);
      dates = eachDayOfInterval({ start: monthStart, end: now });
      groupFormat = "yyyy-MM-dd";
      xAxisFormat = (date) => format(date, "d");
      break;

    case "year":
      const yearStart = startOfYear(now);
      dates = eachMonthOfInterval({ start: yearStart, end: now });
      groupFormat = "yyyy-MM";
      xAxisFormat = (date) => format(date, "MMM");
      break;

    default:
      // Default to week if timeframe is invalid
      const defaultWeekStart = startOfWeek(now);
      dates = eachDayOfInterval({ start: defaultWeekStart, end: now });
      groupFormat = "yyyy-MM-dd";
      xAxisFormat = (date) => format(date, "EEE");
  }

  // Create initial dataset with zero values
  const initialData = dates.map((date) => ({
    dateKey: format(date, groupFormat),
    name: xAxisFormat(date),
    total: 0,
  }));

  // Aggregate data
  const aggregatedData = data.reduce((acc, item) => {
    // Ensure item.createdAt is a Date object
    const createdAt =
      item.createdAt instanceof Date
        ? item.createdAt
        : new Date(item.createdAt);

    const dateKey = format(createdAt, groupFormat);
    const existing = acc.find((d) => d.dateKey === dateKey);
    const total = item._sum.total || 0;

    if (existing) {
      existing.total += total;
    }
    return acc;
  }, initialData);

  // Format for chart - keep all data points for better visualization
  const chartData = aggregatedData.map(({ name, total }) => ({
    name,
    total: parseFloat(total.toFixed(2)),
  }));

  console.log(data)

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary/10"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
