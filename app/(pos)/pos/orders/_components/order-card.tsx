"use client";

import { Check, ChevronDown, Clock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OrderWithItems } from "@/lib/types";
import {
  cn,
  formatCurrency,
  getOrderStatusColor,
  getTimeElapsed,
} from "@/lib/utils";
import { updateOrderStatusServer } from "@/lib/orders";

// Define the OrderStatusEnum
const OrderStatusEnum = {
  PENDING: "PENDING",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

type OrderStatusEnum = keyof typeof OrderStatusEnum;

interface OrderCardProps {
  order: OrderWithItems;
}

export function OrderCard({ order: initialOrder }: OrderCardProps) {
  const [order, setOrder] = useState(initialOrder);
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const tableId = order.tableNumber || "Unknown";
  const tableZone = tableId.charAt(0);
  const tableNumber = tableId.slice(1);
  const statusColor = getOrderStatusColor(order.status);
  const timeElapsed = getTimeElapsed(order.createdAt);

  const updateOrderStatus = async (newStatus: OrderStatusEnum) => {
    setIsStatusUpdating(true);

    try {
      // Call API to update order status - fixed parameter order
      await updateOrderStatusServer(order.id, newStatus);

      // Update local state with new status
      setOrder({
        ...order,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "PREPARING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "READY":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DELIVERED":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-200 border-l-2 hover:shadow-md flex flex-col h-full"
      style={{ borderLeftColor: statusColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between shrink-0 space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">Table {tableZone}</span>
              <span className="text-primary font-medium text-sm">
                {tableNumber}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                #{order.orderId?.slice(-3) || "000"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-2 py-0 h-5 cursor-pointer transition-all duration-200",
                  getStatusBadgeStyles(order.status),
                  isStatusUpdating && "opacity-50"
                )}
              >
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {Object.values(OrderStatusEnum).map((status) => (
                <DropdownMenuItem
                  key={status}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer text-xs",
                    order.status === status && "bg-muted"
                  )}
                  onClick={() => updateOrderStatus(status as OrderStatusEnum)}
                  disabled={isStatusUpdating}
                >
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      status === "PENDING" && "bg-yellow-500",
                      status === "PREPARING" && "bg-blue-500",
                      status === "READY" && "bg-green-500",
                      status === "DELIVERED" && "bg-purple-500",
                      status === "COMPLETED" && "bg-emerald-500",
                      status === "CANCELLED" && "bg-red-500"
                    )}
                  />
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                  {order.status === status && (
                    <Check className="h-3 w-3 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-0.5" />
            {timeElapsed}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-1 flex flex-col">
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 text-xs">
          <div className="font-medium text-muted-foreground">QT</div>
          <div className="font-medium text-muted-foreground">Items</div>
          <div className="font-medium text-muted-foreground text-right">
            Price
          </div>

          <div className="contents col-span-3 flex-1">
            {order.orderItems.map((item) => (
              <div key={item.id} className="contents group">
                <div className="py-1 font-medium">{item.quantity}</div>
                <div className="py-1 truncate group-hover:text-primary transition-colors">
                  {item.menuItem.name}
                </div>
                <div className="py-1 text-right">
                  ${formatCurrency(item.menuItem.price)}
                </div>
              </div>
            ))}

            {/* Empty space filler for cards with fewer items */}
            {order.orderItems.length < 3 && (
              <div className="contents col-span-3">
                <div
                  className="col-span-3"
                  style={{
                    minHeight: `${(3 - order.orderItems.length) * 24}px`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 pt-2 border-t flex justify-between items-center">
          <div className="text-xs font-medium text-muted-foreground">Total</div>
          <div className="font-bold text-sm">
            {formatCurrency(order.total)} HTG
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/20 flex justify-between items-center shrink-0">
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => updateOrderStatus(OrderStatusEnum.CANCELLED)}
                  disabled={
                    order.status === OrderStatusEnum.CANCELLED ||
                    isStatusUpdating
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs py-1 px-2">
                <p>Cancel order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs py-1 px-2">
                <p>Edit order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant={isHovered ? "default" : "secondary"}
          size="sm"
          className={cn(
            "h-7 text-xs transition-all duration-300",
            isHovered ? "bg-primary text-primary-foreground" : ""
          )}
          onClick={() => {
            if (order.status !== OrderStatusEnum.COMPLETED) {
              updateOrderStatus(OrderStatusEnum.COMPLETED);
            }
          }}
          disabled={
            order.status === OrderStatusEnum.COMPLETED ||
            order.status === OrderStatusEnum.CANCELLED ||
            isStatusUpdating
          }
        >
          {order.status === OrderStatusEnum.COMPLETED ? "Paid" : "Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
