/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CategoryGrid } from "./category-grid";
import { MenuItems } from "./menu-items";
// import { OrderSummary } from "./_components/order-summary";
// import { TableStatus } from "./_components/table-status";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data";
import type { MenuItem } from "@/lib/types";
// import { useOrderStore } from "@/lib/store/useOrderStore";
import { CheckoutModal } from "@/components/shared/pos/checkout-modal";
import { OrderConfirmationModal } from "@/components/shared/pos/order-confirmation-modal";
import { OrderHistoryDrawer } from "@/components/shared/pos/order-history-drawer";
import { useCartStore } from "@/lib/store/cart-store";
import { CartSection } from "@/components/shared/pos/cart-section";

interface user {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RestaurantPOSType {
  user: user;
  menuItems: any;
}
export default function RestaurantPOS({ user, menuItems }: RestaurantPOSType) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState<any>(null);

  const categoriesWithCounts = useMemo(() => {
    const counts = menuItems.reduce((acc: any, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return categories.map((category) => ({
      ...category,
      itemCount: counts[category.id] || 0,
    }));
  }, [menuItems]);

  console.log(menuItems);

  const { items, addItem, updateQuantity } = useCartStore();

  const handleOrderComplete = (orderData: any) => {
    setIsCheckoutOpen(false);
    setLastOrderData(orderData);
    setIsConfirmationOpen(true);
  };

  const filteredItems = menuItems.filter(
    (item: any) => item.category === selectedCategory
  );

  const handleAddItem = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      // quantity: 1,
    });
  };

  return (
    <div className="flex h-full bg-background text-foreground">
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-muted/50 border-0" placeholder="Search" />
          </div>
        </div>

        {/* Categories */}
        <CategoryGrid
          categories={categoriesWithCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Menu items */}
        <MenuItems
          items={filteredItems}
          orderItems={items}
          onAddItem={handleAddItem}
          onUpdateQuantity={updateQuantity}
        />

        {/* Table status */}
        {/* <div className="mt-auto border-t">
          <TableStatus tables={tables} />
        </div> */}
      </div>

      {/* Order summary sidebar */}
      {items.length != 0 && (
        <CartSection onCheckout={() => setIsCheckoutOpen(true)} />
      )}

      <CheckoutModal
        user={user}
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleOrderComplete}
      />

      <OrderConfirmationModal
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        orderData={lastOrderData}
      />

      <OrderHistoryDrawer
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
