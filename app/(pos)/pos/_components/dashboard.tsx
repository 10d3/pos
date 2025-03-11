"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Sun",
    total: 450,
  },
  {
    name: "Mon",
    total: 300,
  },
  {
    name: "Tue",
    total: 350,
  },
  {
    name: "Wed",
    total: 400,
  },
  {
    name: "Thu",
    total: 350,
  },
  {
    name: "Fri",
    total: 450,
  },
  {
    name: "Sat",
    total: 200,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `${value}`}
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
