// app/(dashboard)/dashboard/page.tsx
import { CalendarIcon, Search } from "lucide-react";
import Link from "next/link";
import {
  getTotalRevenue,
  getPaidOrders,
  getDishesSold,
  getTopDishes,
  getOrderTrends,
} from "@/lib/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "./_components/stats-card";
import { TopDishes } from "./_components/top-dishes";
import { Overview } from "./_components/dashboard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { timeframe?: "day" | "week" | "month" | "year" };
}) {
  const timeframe = (await searchParams.timeframe) || "day";
  const [totalRevenue, paidOrders, dishesSold, topDishes, orderTrends] =
    await Promise.all([
      getTotalRevenue(),
      getPaidOrders(),
      getDishesSold(),
      getTopDishes(),
      getOrderTrends(timeframe),
    ]);

  const formattedOrderTrends = orderTrends
    ? orderTrends.map((item) => ({
        createdAt: item.createdAt,
        _sum: { total: item.total },
      }))
    : [];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-muted/40"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Revenue"
            value={`$${(totalRevenue?._sum.total || 0).toFixed(2)}`}
            icon="dollar"
            className="bg-violet-500/10"
          />
          <StatsCard
            title="Paid Orders"
            value={(paidOrders || 0).toString()}
            icon="receipt"
          />
          <StatsCard
            title="Dishes Sold"
            value={(dishesSold?._sum.quantity || 0).toString()}
            icon="dish"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Top Dishes
              </CardTitle>
              <Button variant="link" className="h-8 px-2 lg:px-3" asChild>
                <Link href="/pos/menu">See All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TopDishes dishes={topDishes || []} />
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Order Trends
              </CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <Link href="/pos?timeframe=day" className="block">
                    <SelectItem value="day">Jour</SelectItem>
                  </Link>
                  <Link href="/pos?timeframe=week" className="block">
                    <SelectItem value="week">Semaine</SelectItem>
                  </Link>
                  <Link href="/pos?timeframe=month" className="block">
                    <SelectItem value="month">Mois</SelectItem>
                  </Link>
                  <Link href="/pos?timeframe=year" className="block">
                    <SelectItem value="year">Annee</SelectItem>
                  </Link>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={formattedOrderTrends} timeframe={timeframe} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
