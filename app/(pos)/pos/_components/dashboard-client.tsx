/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
//   CalendarIcon,
//   Search,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  BarChart3Icon,
  DollarSignIcon,
  ShoppingBagIcon,
  UtensilsIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopDishes } from "./top-dishes"
import { EnhancedOverview } from "./enhanced-overview"
import { getOrderTrends } from "@/lib/dashboard"
import { Badge } from "@/components/ui/badge"

interface DashboardClientProps {
  totalRevenue: any
  paidOrders: number
  dishesSold: any
  topDishes: any[]
  orderTrends: any[]
  initialTimeframe: "day" | "week" | "month" | "year"
}

export function DashboardClient({
  totalRevenue,
  paidOrders,
  dishesSold,
  topDishes,
  orderTrends: initialOrderTrends,
  initialTimeframe,
}: DashboardClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlTimeframe = searchParams.get("timeframe") as "day" | "week" | "month" | "year" | null

  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">(urlTimeframe || initialTimeframe)
  const [currentOrderTrends, setCurrentOrderTrends] = useState(initialOrderTrends)
  const [isLoading, setIsLoading] = useState(false)
  const [trendPercentage, setTrendPercentage] = useState<number | null>(null)

  // Update URL when timeframe changes
  const handleTimeframeChange = async (value: "day" | "week" | "month" | "year") => {
    setTimeframe(value)
    setIsLoading(true)
    router.push(`/pos?timeframe=${value}`, { scroll: false })

    try {
      // Fetch new order trends data based on selected timeframe
      const newOrderTrends = await getOrderTrends(value)

      // Format the data to match the expected structure
      const formattedOrderTrends = newOrderTrends
        ? newOrderTrends.map((item: any) => ({
            createdAt: item.createdAt,
            _sum: { total: item.total },
          }))
        : []

      setCurrentOrderTrends(formattedOrderTrends)

      // Calculate trend percentage (for demo purposes)
      if (formattedOrderTrends.length > 1) {
        const firstValue = formattedOrderTrends[0]?._sum?.total || 0
        const lastValue = formattedOrderTrends[formattedOrderTrends.length - 1]?._sum?.total || 0
        if (firstValue > 0) {
          const percentage = ((lastValue - firstValue) / firstValue) * 100
          setTrendPercentage(percentage)
        }
      }
    } catch (error) {
      console.error("Failed to fetch order trends:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sync with URL parameters on initial load
  useEffect(() => {
    if (urlTimeframe && urlTimeframe !== timeframe) {
      handleTimeframeChange(urlTimeframe)
    } else {
      // Calculate initial trend percentage
      if (initialOrderTrends.length > 1) {
        const firstValue = initialOrderTrends[0]?._sum?.total || 0
        const lastValue = initialOrderTrends[initialOrderTrends.length - 1]?._sum?.total || 0
        if (firstValue > 0) {
          const percentage = ((lastValue - firstValue) / firstValue) * 100
          setTrendPercentage(percentage)
        }
      }
    }
  }, [])

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "day":
        return "Today"
      case "week":
        return "This Week"
      case "month":
        return "This Month"
      case "year":
        return "This Year"
      default:
        return "Period"
    }
  }

  const formatTimeframeLabel = (value: string) => {
    switch (value) {
      case "day":
        return "Jour"
      case "week":
        return "Semaine"
      case "month":
        return "Mois"
      case "year":
        return "Année"
      default:
        return value
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-10 bg-muted/40 border-none" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-dashed">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div> */}

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Aperçu des performances de votre restaurant pour {getTimeframeLabel().toLowerCase()}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">Revenue Totale</CardTitle>
              <div className="rounded-full">
                <DollarSignIcon className="h-4 w-4 text-violet-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${(totalRevenue?._sum.total || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">{getTimeframeLabel()} revenue</p>
              {trendPercentage !== null && (
                <div className="flex items-center gap-1 mt-2">
                  {trendPercentage >= 0 ? (
                    <Badge variant="default" className="h-5 gap-1">
                      <ArrowUpIcon className="h-3 w-3" />
                      {Math.abs(trendPercentage).toFixed(1)}%
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="h-5 gap-1">
                      <ArrowDownIcon className="h-3 w-3" />
                      {Math.abs(trendPercentage).toFixed(1)}%
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">vs période précédente</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">Commandes Payées</CardTitle>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <ShoppingBagIcon className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{(paidOrders || 0).toString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{getTimeframeLabel()} commandes complétées</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">Plats Vendus</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                <UtensilsIcon className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{(dishesSold?._sum.quantity || 0).toString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{getTimeframeLabel()} plats totaux</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-3 overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 ">
              <div className="flex items-center gap-2">
                <BarChart3Icon className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base font-medium">Plats Populaires</CardTitle>
              </div>
              <Button variant="link" className="h-8 px-2 lg:px-3" asChild>
                <Link href="/pos/menu">Voir Tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <TopDishes dishes={topDishes || []} />
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-4 overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 ">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-base font-medium">Tendances des Commandes</CardTitle>
              </div>
              <Select
                value={timeframe}
                onValueChange={(value) => handleTimeframeChange(value as "day" | "week" | "month" | "year")}
                disabled={isLoading}
              >
                <SelectTrigger className="h-8 w-[120px] border-none bg-white/50 dark:bg-black/10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">{formatTimeframeLabel("day")}</SelectItem>
                  <SelectItem value="week">{formatTimeframeLabel("week")}</SelectItem>
                  <SelectItem value="month">{formatTimeframeLabel("month")}</SelectItem>
                  <SelectItem value="year">{formatTimeframeLabel("year")}</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-[350px]">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-[300px] w-full" />
                    <p className="text-sm text-muted-foreground">Loading trend data...</p>
                  </div>
                </div>
              ) : (
                <EnhancedOverview data={currentOrderTrends} timeframe={timeframe} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

