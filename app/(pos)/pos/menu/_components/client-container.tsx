/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CategoryGrid } from "./category-grid";
import { MenuItems } from "./menu-items";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data";
import type { MenuItem } from "@/lib/types";
import { CheckoutModal } from "@/components/shared/pos/checkout-modal";
import { OrderConfirmationModal } from "@/components/shared/pos/order-confirmation-modal";
import { OrderHistoryDrawer } from "@/components/shared/pos/order-history-drawer";
import { useCartStore } from "@/lib/store/cart-store";
import { CartSection } from "@/components/shared/pos/cart-section";
import { CategoryType } from "@prisma/client";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out items that are out of stock or not available
  const availableMenuItems = useMemo(() => {
    return menuItems.filter((item: any) => {
      // Check if item is available and has stock > 0
      return (
        item.available && (!item.hasOwnProperty("stock") || item.stock > 0)
      );
    });
  }, [menuItems]);

  const categoriesWithCounts = useMemo(() => {
    const counts = availableMenuItems.reduce(
      (acc: Record<string, number>, item: any) => {
        // Normalize category key to lowercase to match category.id format
        const categoryKey = item.category.toLowerCase();
        acc[categoryKey] = (acc[categoryKey] || 0) + 1;
        return acc;
      },
      {}
    );

    return categories.map((category) => ({
      ...category,
      itemCount: counts[category.id] || 0,
    }));
  }, [availableMenuItems]);

  const { items, addItem, updateQuantity } = useCartStore();

  const handleOrderComplete = (orderData: any) => {
    setIsCheckoutOpen(false);
    setLastOrderData(orderData);
    setIsConfirmationOpen(true);
  };

  // Utility function to normalize category strings
  const normalizeCategory = (str: string) =>
    str
      .toLowerCase()
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/&/g, "et") // Handle "Vins & Alcools" case
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .trim();

  const filteredItems = useMemo(() => {
    let filtered = availableMenuItems;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((item: any) => {
        // Normalize the selected category
        const cleanSelected = normalizeCategory(selectedCategory);

        // Normalize the item's category
        const itemCategoryNormalized = normalizeCategory(item.category);

        // Find matching category in the enum mapping
        const matchedCategory = Object.entries(CategoryType).find(
          ([key, value]) => {
            const enumKeyNormalized = normalizeCategory(key);
            const displayNameNormalized = normalizeCategory(value);

            return (
              enumKeyNormalized === cleanSelected ||
              displayNameNormalized === cleanSelected
            );
          }
        );

        // Check if the item's category matches
        return (
          matchedCategory &&
          (normalizeCategory(matchedCategory[0]) === itemCategoryNormalized ||
            normalizeCategory(matchedCategory[1]) === itemCategoryNormalized)
        );
      });
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item: any) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [availableMenuItems, selectedCategory, searchQuery]);

  const handleAddItem = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
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
            <Input
              className="pl-9 bg-muted/50 border-0"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
    </div>
  );
}
