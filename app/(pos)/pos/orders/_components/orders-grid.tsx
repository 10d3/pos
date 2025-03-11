/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { OrderCard } from "./order-card";

// import { Order, OrderItem, MenuItem } from "@prisma/client";

// type OrderWithItems = Order & {
//   orderItems: (OrderItem & {
//     menuItem: MenuItem;
//   })[];
// };

export async function OrdersGrid() {
  const orders: any = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy:{
      createdAt: "desc"
    }
  });

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {orders.map((order: any) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
