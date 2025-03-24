/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Download } from "lucide-react";
import { AddItemDialog } from "./add-item-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCSV, getFormattedDate } from "@/lib/export-utils";

interface InventoryHeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  onExport?: () => void;
  items?: any[]; // Add items for export functionality
}

export function InventoryHeader({
  onSearch,
  onCategoryChange,
  categories,
  items = [],
}: InventoryHeaderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === "all" ? "" : value);
  };

  const refresh = () => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 300);
    return () => clearTimeout(timer);
  };

  const handleExport = () => {
    if (!items || items.length === 0) {
      alert("No items to export");
      return;
    }

    // Format data for export
    const exportData = items.map((item) => ({
      Name: item.name,
      Category: item.category,
      Price: item.price,
      Stock: item.stock || 0,
      Available: item.available ? "Yes" : "No",
      Description: item.description || "",
    }));

    // Export to CSV
    exportToCSV(exportData, `inventory-report-${getFormattedDate()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaire</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre catalogue de produits et leurs disponibilités
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Select defaultValue="all" onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AddItemDialog
        onAdd={refresh}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
