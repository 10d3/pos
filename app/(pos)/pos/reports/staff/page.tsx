/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { subDays, subWeeks, subMonths } from "date-fns";
import {
  AlertCircle,
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StaffPerformance {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersPerDay: number;
  trend?: "up" | "down" | "neutral";
}

interface Order {
  id: string;
  staffId: string;
  staff?: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function StaffPerformancePage() {
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>(
    []
  );
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalStats, setTotalStats] = useState({
    orders: 0,
    revenue: 0,
    averageOrder: 0,
    staffCount: 0,
  });

  const currencySymbol = "HTG";

  useEffect(() => {
    const fetchStaffPerformance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get date range based on timeframe
        let startDate = new Date();
        switch (timeframe) {
          case "day":
            startDate = subDays(new Date(), 1);
            break;
          case "week":
            startDate = subWeeks(new Date(), 1);
            break;
          case "month":
            startDate = subMonths(new Date(), 1);
            break;
        }

        // Fetch orders within the timeframe
        console.log(`Fetching orders since ${startDate.toISOString()}`);
        const ordersResponse = await fetch(
          `/api/orders?startDate=${startDate.toISOString()}`
        );

        if (!ordersResponse.ok) {
          throw new Error(
            `Failed to fetch orders: ${ordersResponse.statusText}`
          );
        }

        const ordersData: Order[] = await ordersResponse.json();
        console.log(`Received ${ordersData.length} orders`);

        // Extract unique staff members from orders
        const staffMap = new Map<string, User>();

        // First try to get staff from the staff property
        ordersData.forEach((order) => {
          if (order.staff && order.staff.id) {
            staffMap.set(order.staff.id, {
              id: order.staff.id,
              name: order.staff.name || "Unknown",
              email: order.staff.email || "",
            });
          } else if (order.staffId) {
            // Fallback to staffId if staff object is not available
            if (!staffMap.has(order.staffId)) {
              staffMap.set(order.staffId, {
                id: order.staffId,
                name: `Staff #${order.staffId.substring(0, 6)}`,
                email: "",
              });
            }
          }
        });

        // If no staff found in orders, try to fetch them directly
        if (staffMap.size === 0) {
          const staffResponse = await fetch("/api/users?role=STAFF");
          if (!staffResponse.ok) {
            throw new Error(
              `Failed to fetch staff: ${staffResponse.statusText}`
            );
          }
          const staffData: User[] = await staffResponse.json();
          staffData.forEach((staff) => staffMap.set(staff.id, staff));
        }

        const staffData = Array.from(staffMap.values());
        console.log(`Processing data for ${staffData.length} staff members`);

        // Calculate performance metrics for each staff member
        const performance = staffData.map((staff) => {
          const staffOrders = ordersData.filter(
            (order) =>
              order.staffId === staff.id || order.staff?.id === staff.id
          );

          const totalOrders = staffOrders.length;
          const totalRevenue = staffOrders.reduce(
            (sum, order) =>
              sum + (typeof order.total === "number" ? order.total : 0),
            0
          );
          const averageOrderValue =
            totalOrders > 0 ? totalRevenue / totalOrders : 0;
          const daysDiff =
            (new Date().getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24);
          const ordersPerDay = totalOrders / Math.max(1, daysDiff);

          // Randomly assign trend for demo purposes
          // In a real app, you would compare with previous period
          const trends = ["up", "down", "neutral"];
          const randomTrend = trends[
            Math.floor(Math.random() * trends.length)
          ] as "up" | "down" | "neutral";

          return {
            id: staff.id,
            name: staff.name || "Unknown",
            email: staff.email || "",
            totalOrders,
            totalRevenue,
            averageOrderValue,
            ordersPerDay,
            trend: randomTrend,
          };
        });

        // Sort by total revenue (highest first)
        performance.sort((a, b) => b.totalRevenue - a.totalRevenue);
        setStaffPerformance(performance);

        // Calculate total stats
        const totalOrders = performance.reduce(
          (sum, staff) => sum + staff.totalOrders,
          0
        );
        const totalRevenue = performance.reduce(
          (sum, staff) => sum + staff.totalRevenue,
          0
        );
        const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setTotalStats({
          orders: totalOrders,
          revenue: totalRevenue,
          averageOrder: averageOrder,
          staffCount: performance.length,
        });

        // Prepare chart data
        const chartData = performance.map((staff) => ({
          name: staff.name.split(" ")[0] || "Unknown", // Use first name for chart
          orders: staff.totalOrders,
          revenue: Number.parseFloat(staff.totalRevenue.toFixed(2)),
          average: Number.parseFloat(staff.averageOrderValue.toFixed(2)),
        }));
        setChartData(chartData);

        if (performance.length === 0) {
          setError(
            "No staff performance data available for the selected timeframe."
          );
        }
      } catch (error) {
        console.error("Error fetching staff performance:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load staff performance data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffPerformance();
  }, [timeframe]);

  // Chart configurations
  const chartConfig = {
    orders: {
      label: "Orders",
      color: "hsl(250, 70%, 60%)",
      icon: ShoppingBag,
    },
    revenue: {
      label: "Revenue",
      color: "hsl(170, 80%, 40%)",
      icon: DollarSign,
    },
    average: {
      label: "Average",
      color: "hsl(30, 90%, 60%)",
      icon: BarChart3,
    },
  };

  const formatTimeframeLabel = () => {
    switch (timeframe) {
      case "day":
        return "Last 24 Hours";
      case "week":
        return "Last 7 Days";
      case "month":
        return "Last 30 Days";
      default:
        return "Selected Period";
    }
  };

  const renderTrendIcon = (trend?: "up" | "down" | "neutral") => {
    if (trend === "up") {
      return (
        <div className="rounded-full bg-emerald-100 p-1.5 dark:bg-emerald-900/30">
          <ArrowUpIcon className="h-3.5 w-3.5 text-emerald-500" />
        </div>
      );
    } else if (trend === "down") {
      return (
        <div className="rounded-full bg-rose-100 p-1.5 dark:bg-rose-900/30">
          <ArrowDownIcon className="h-3.5 w-3.5 text-rose-500" />
        </div>
      );
    }
    return null;
  };

  const renderSummaryCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-950">
            <ShoppingBag className="h-4 w-4 text-indigo-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStats.orders}</div>
          <p className="text-xs text-muted-foreground">
            {formatTimeframeLabel()}
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-950">
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalStats.revenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {currencySymbol}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatTimeframeLabel()}
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Order</CardTitle>
          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-950">
            <BarChart3 className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalStats.averageOrder.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {currencySymbol}
          </div>
          <p className="text-xs text-muted-foreground">Per order</p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStats.staffCount}</div>
          <p className="text-xs text-muted-foreground">With orders in period</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-6">
      {renderSummaryCards()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Performance
          </h1>
          <p className="text-muted-foreground">
            Monitor and analyze your staff&apos;s sales performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select
            value={timeframe}
            onValueChange={(value) =>
              setTimeframe(value as "day" | "week" | "month")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        renderLoadingState()
      ) : staffPerformance.length === 0 && !error ? (
        <div className="flex flex-col justify-center items-center h-64 bg-muted/20 rounded-lg border border-dashed">
          <Users className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-lg font-medium">
            No staff performance data available
          </p>
          <p className="text-sm text-muted-foreground">
            Try selecting a different timeframe or check back later
          </p>
        </div>
      ) : (
        <>
          {renderSummaryCards()}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 p-1 bg-muted/50">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Charts
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Detailed View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {staffPerformance.map((staff) => (
                  <Card
                    key={staff.id}
                    className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{staff.name}</CardTitle>
                        {renderTrendIcon(staff.trend)}
                      </div>
                      <CardDescription className="truncate">
                        {staff.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Orders:</span>
                          <span className="font-medium">
                            {staff.totalOrders}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Revenue:
                          </span>
                          <span className="font-medium">
                            {staff.totalRevenue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {currencySymbol}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Avg. Order:
                          </span>
                          <span className="font-medium">
                            {staff.averageOrderValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {currencySymbol}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Orders/Day:
                          </span>
                          <span className="font-medium">
                            {staff.ordersPerDay.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 pt-2">
                      <Badge
                        variant={
                          staff.trend === "up"
                            ? "default"
                            : staff.trend === "down"
                            ? "destructive"
                            : "outline"
                        }
                        className="w-full justify-center"
                      >
                        {staff.trend === "up"
                          ? "Improving"
                          : staff.trend === "down"
                          ? "Declining"
                          : "Stable"}
                      </Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-indigo-500" />
                    Orders by Staff
                  </CardTitle>
                  <CardDescription>
                    Number of orders processed by each staff member
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig} className="h-full">
                      <BarChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="ordersGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(250, 70%, 60%)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(250, 70%, 60%)"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={12}
                        />
                        <Bar
                          dataKey="orders"
                          fill="url(#ordersGradient)"
                          radius={[6, 6, 0, 0]}
                          barSize={40}
                          animationDuration={1500}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent className="shadow-lg border-none bg-indigo-50 dark:bg-indigo-950 p-3 rounded-lg" />
                          }
                          cursor={{ fill: "rgba(200, 200, 255, 0.1)" }}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    Revenue by Staff
                  </CardTitle>
                  <CardDescription>
                    Total revenue generated by each staff member
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig} className="h-full">
                      <BarChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(170, 80%, 40%)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(170, 80%, 40%)"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={12}
                          tickFormatter={(value) =>
                            `${value.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}`
                          }
                        />
                        <Bar
                          dataKey="revenue"
                          fill="url(#revenueGradient)"
                          radius={[6, 6, 0, 0]}
                          barSize={40}
                          animationDuration={1500}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) =>
                                `${value.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} ${currencySymbol}`
                              }
                              className="shadow-lg border-none bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg"
                            />
                          }
                          cursor={{ fill: "rgba(200, 255, 200, 0.1)" }}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                    Average Order Value
                  </CardTitle>
                  <CardDescription>
                    Average value of orders processed by each staff member
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig} className="h-full">
                      <BarChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="averageGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(30, 90%, 60%)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(30, 90%, 60%)"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={12}
                          tickFormatter={(value) =>
                            `${value.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}`
                          }
                        />
                        <Bar
                          dataKey="average"
                          fill="url(#averageGradient)"
                          radius={[6, 6, 0, 0]}
                          barSize={40}
                          animationDuration={1500}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) =>
                                `${value.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} ${currencySymbol}`
                              }
                              className="shadow-lg border-none bg-amber-50 dark:bg-amber-950 p-3 rounded-lg"
                            />
                          }
                          cursor={{ fill: "rgba(255, 230, 200, 0.1)" }}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader>
                  <CardTitle>Staff Performance Details</CardTitle>
                  <CardDescription>
                    Comprehensive view of all staff performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Staff Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">
                            Total Orders
                          </TableHead>
                          <TableHead className="text-right">
                            Total Revenue
                          </TableHead>
                          <TableHead className="text-right">
                            Avg. Order Value
                          </TableHead>
                          <TableHead className="text-right">
                            Orders/Day
                          </TableHead>
                          <TableHead className="text-center">Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staffPerformance.map((staff, index) => (
                          <TableRow
                            key={staff.id}
                            className={index % 2 === 0 ? "bg-muted/10" : ""}
                          >
                            <TableCell className="font-medium">
                              {staff.name}
                            </TableCell>
                            <TableCell>{staff.email}</TableCell>
                            <TableCell className="text-right">
                              {staff.totalOrders}
                            </TableCell>
                            <TableCell className="text-right">
                              {staff.totalRevenue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              {currencySymbol}
                            </TableCell>
                            <TableCell className="text-right">
                              {staff.averageOrderValue.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  // minimumFractionDigits: 2,
                                }
                              )}{" "}
                              {currencySymbol}
                            </TableCell>
                            <TableCell className="text-right">
                              {staff.ordersPerDay.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                {renderTrendIcon(staff.trend)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
