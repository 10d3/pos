/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { InventoryHeader } from "./inventory-header";
import { InventoryTable } from "./inventory-table";

export default function Wrapper({ menuItems }: any) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const categories = React.useMemo(() => {
    const uniqueCategories = [
      ...new Set(menuItems.map((item:any) => item.category)),
    ];
    return uniqueCategories.sort(); // Sort alphabetically
  }, []);

  console.log(categories)

  return (
    <div className="p-5">
      <InventoryHeader
        onSearch={(query) => setSearchQuery(query)}
        onCategoryChange={(category) => setSelectedCategory(category)}
        categories={categories as string[]}
      />
      <div className="mt-8">
        <InventoryTable menuItems={menuItems} searchQuery={searchQuery} selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}
