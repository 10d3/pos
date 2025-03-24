/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { InventoryHeader } from "./inventory-header";
import { InventoryTable } from "./inventory-table";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

// Define stock threshold constants
const LOW_STOCK_THRESHOLD = 6;
const OUT_OF_STOCK_THRESHOLD = 0;

export default function Wrapper({ menuItems }: any) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const categories = React.useMemo(() => {
    const uniqueCategories = [
      ...new Set(menuItems.map((item: any) => item.category)),
    ];
    return uniqueCategories.sort(); // Sort alphabetically
  }, [menuItems]);

  // Calculate stock statistics
  const stockStats = React.useMemo(() => {
    const lowStockItems = menuItems.filter(
      (item: any) =>
        item.stock <= LOW_STOCK_THRESHOLD && item.stock > OUT_OF_STOCK_THRESHOLD
    );

    const outOfStockItems = menuItems.filter(
      (item: any) => item.stock <= OUT_OF_STOCK_THRESHOLD
    );

    const healthyStockItems = menuItems.filter(
      (item: any) => item.stock > LOW_STOCK_THRESHOLD
    );

    return {
      lowStock: lowStockItems.length,
      outOfStock: outOfStockItems.length,
      healthyStock: healthyStockItems.length,
      totalItems: menuItems.length,
    };
  }, [menuItems]);

  return (
    <div className="p-5">
      <InventoryHeader
        onSearch={(query) => setSearchQuery(query)}
        onCategoryChange={(category) => setSelectedCategory(category)}
        categories={categories as string[]}
      />

      {/* Stock Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card
          className={`border ${
            stockStats.outOfStock > 0
              ? "border-red-500 bg-red-50"
              : "border-gray-200"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Produits en rupture
                </p>
                <h3 className="text-2xl font-bold">{stockStats.outOfStock}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {(
                    (stockStats.outOfStock / stockStats.totalItems) *
                    100
                  ).toFixed(1)}
                  % du catalogue
                </p>
              </div>
              <AlertCircle
                className={`h-8 w-8 ${
                  stockStats.outOfStock > 0 ? "text-red-500" : "text-gray-300"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border ${
            stockStats.lowStock > 0
              ? "border-amber-500 bg-amber-50"
              : "border-gray-200"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Stock faible
                </p>
                <h3 className="text-2xl font-bold">{stockStats.lowStock}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {(
                    (stockStats.lowStock / stockStats.totalItems) *
                    100
                  ).toFixed(1)}
                  % du catalogue
                </p>
              </div>
              <AlertTriangle
                className={`h-8 w-8 ${
                  stockStats.lowStock > 0 ? "text-amber-500" : "text-gray-300"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Stock suffisant
                </p>
                <h3 className="text-2xl font-bold">
                  {stockStats.healthyStock}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {(
                    (stockStats.healthyStock / stockStats.totalItems) *
                    100
                  ).toFixed(1)}
                  % du catalogue
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for critical stock issues */}
      {stockStats.outOfStock > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            {stockStats.outOfStock} produit
            {stockStats.outOfStock > 1 ? "s" : ""} en rupture de stock. Veuillez
            réapprovisionner dès que possible.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8">
        <InventoryTable
          menuItems={menuItems}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          lowStockThreshold={LOW_STOCK_THRESHOLD}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            // Create CSV content
            const headers = ["Nom", "Catégorie", "Prix", "Stock"];
            const csvContent = [
              headers.join(","),
              ...menuItems.map((item: any) =>
                [item.name, item.category, item.price, item.stock].join(",")
              ),
            ].join("\n");

            // Create blob and download link
            const blob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            link.setAttribute("href", url);
            link.setAttribute("download", "inventory_report.csv");
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Exporter en CSV
        </button>
      </div>
    </div>
  );
}
