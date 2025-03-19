/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format } from "date-fns"

interface OverviewProps {
  data: any[]
  timeframe: "day" | "week" | "month" | "year"
}

export function EnhancedOverview({ data, timeframe }: OverviewProps) {
  // Process and format the data based on timeframe
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Sort data by date
    const sortedData = [...data].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    // Format dates based on timeframe
    return sortedData.map((item) => {
      const date = new Date(item.createdAt)
      let formattedDate

      switch (timeframe) {
        case "day":
          formattedDate = format(date, "HH:mm")
          break
        case "week":
          formattedDate = format(date, "EEE")
          break
        case "month":
          formattedDate = format(date, "dd MMM")
          break
        case "year":
          formattedDate = format(date, "MMM")
          break
        default:
          formattedDate = format(date, "dd/MM")
      }

      return {
        name: formattedDate,
        total: item._sum.total || 0,
      }
    })
  }, [data, timeframe])

  // Generate empty data for demo if no data is available
  const emptyData = useMemo(() => {
    if (chartData.length > 0) return null

    const today = new Date()
    const demoData = []

    switch (timeframe) {
      case "day":
        for (let i = 0; i < 24; i += 2) {
          const hour = i < 10 ? `0${i}` : `${i}`
          demoData.push({
            name: `${hour}:00`,
            total: 0,
          })
        }
        break
      case "week":
        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        weekDays.forEach((day) => {
          demoData.push({
            name: day,
            total: 0,
          })
        })
        break
      case "month":
        for (let i = 1; i <= 30; i += 3) {
          const date = new Date(today.getFullYear(), today.getMonth(), i)
          demoData.push({
            name: format(date, "dd MMM"),
            total: 0,
          })
        }
        break
      case "year":
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        months.forEach((month) => {
          demoData.push({
            name: month,
            total: 0,
          })
        })
        break
    }

    return demoData
  }, [chartData, timeframe])

  const displayData = chartData.length > 0 ? chartData : emptyData || []

  // Format the tooltip value
  const formatTooltipValue = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm font-bold text-indigo-500">{formatTooltipValue(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[350px] w-full px-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(226, 70%, 55%)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="hsl(226, 70%, 55%)"
            strokeWidth={2}
            fill="url(#colorTotal)"
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

