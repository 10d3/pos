// app/(dashboard)/dashboard/_components/top-dishes.tsx
"use client";

import { categories } from "@/lib/data";

export function TopDishes({
  dishes,
}: {
  dishes: Array<{
    menuItemId: string;
    _sum: {
      quantity: number; // Now guaranteed to be number
    };
    menuItem?: {
      name: string;
      category: string;
    };
  }>;
}) {
  const getCategoryIcon = (categoryName: string) => {
    const normalizedCategory = categoryName.toLowerCase().replace(/ /g, "_");
    const category = categories.find((c) => c.id === normalizedCategory);
    return category?.icon || "⭐";
  };

  return (
    <div className="space-y-4">
      {dishes.map((dish) => (
        <div
          key={dish.menuItemId}
          className="flex items-center gap-4 rounded-lg bg-muted/40 p-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-xl">
            {dish.menuItem?.category
              ? getCategoryIcon(dish.menuItem.category)
              : "⭐"}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {dish.menuItem?.name || "Unknown Dish"}
            </p>
            <p className="text-sm text-muted-foreground">
              Sold: {dish._sum.quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
