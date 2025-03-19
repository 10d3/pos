// app/(dashboard)/dashboard/page.tsx
import {
  getTotalRevenue,
  getPaidOrders,
  getDishesSold,
  getTopDishes,
  getOrderTrends,
} from "@/lib/dashboard";
import { DashboardClient } from "./_components/dashboard-client";

export default async function DashboardPage() {
  const timeframe = "week";

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
    <DashboardClient
      totalRevenue={totalRevenue}
      paidOrders={paidOrders}
      dishesSold={dishesSold}
      topDishes={topDishes}
      orderTrends={formattedOrderTrends}
      initialTimeframe={timeframe}
    />
  );
}
