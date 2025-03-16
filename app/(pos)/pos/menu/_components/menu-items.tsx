"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuItem, OrderItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface MenuItemsProps {
  items: MenuItem[];
  orderItems: OrderItem[];
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function MenuItems({
  items,
  orderItems,
  onAddItem,
  onUpdateQuantity,
}: MenuItemsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-2 overflow-y-auto">
      {items.map((item) => {
        const orderItem = orderItems.find((i) => i.id === item.id);
        const quantity = orderItem?.quantity || 0;

        return (
          <div
            key={item.id}
            className="flex flex-col bg-muted/20 rounded-lg overflow-hidden border"
          >
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                  Orders → Kitchen
                </div>
              </div>
              <div className="font-medium">{item.name}</div>
              <div className="text-primary mt-1">
                {formatCurrency(Number(item.price.toFixed(2)))} HTG
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-background border-t">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() =>
                  quantity > 0 && onUpdateQuantity(item.id, quantity - 1)
                }
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => onAddItem(item)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
