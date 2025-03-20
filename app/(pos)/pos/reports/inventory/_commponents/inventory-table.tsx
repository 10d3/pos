/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditItemDialog } from "./edit-item-dialog";
import { DeleteItemDialog } from "./delete-item-dialog";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types basés sur le modèle Prisma
export type MenuItem = {
  id: string;
  name: string;
  description?: string | undefined;
  category: string;
  price: number;
  available: boolean;
  createdAt: Date;
  stock: number;
};

interface InventoryTableProps {
  searchQuery: string;
  menuItems: any;
  selectedCategory: string;
  lowStockThreshold: number;
}

export function InventoryTable({
  searchQuery,
  menuItems,
  selectedCategory,
  lowStockThreshold,
}: InventoryTableProps) {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  //   const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description &&
            item.description.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, searchQuery, selectedCategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const refresh = () => {
    const timer = setTimeout(() => {
      // router.refresh();
      window.location.reload();
    }, 300);
    return () => clearTimeout(timer);
  };

  //   const handleSearch = (query: string) => {
  //     setSearchQuery(query);
  //   };

  // Filtrer les éléments en fonction de la recherche
  //   const filteredItems = useMemo(() => {
  //     if (!searchQuery.trim()) return items;

  //     const query = searchQuery.toLowerCase().trim();
  //     return items.filter(
  //       (item) =>
  //         item.name.toLowerCase().includes(query) ||
  //         (item.description && item.description.toLowerCase().includes(query)) ||
  //         item.category.toLowerCase().includes(query)
  //     );
  //   }, [items, searchQuery]);
  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return {
        badge: "destructive",
        text: "Rupture",
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
      };
    } else if (stock <= lowStockThreshold) {
      return {
        badge: "outline",
        className: "bg-amber-100 text-amber-800 border-amber-300",
        text: `Faible: ${stock}`,
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
      };
    } else {
      return {
        badge: "outline",
        className: "bg-green-100 text-green-800 border-green-300",
        text: `${stock}`,
        icon: null,
      };
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Entrées:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      "Plats Principaux":
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      Pizzas: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Burgers:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      Salades:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Pâtes: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Grillades:
        "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
      "Fruits de Mer":
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
      Soupes:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
      Sandwiches:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Accompagnements:
        "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
      Vegan:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      DESSERTS:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Boissons: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
      "Vins & Alcools":
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      "Menu Enfant":
        "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
      "Petit Déjeuner":
        "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
      Spécialités:
        "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400",
    };

    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nom</TableHead>
              <TableHead className="hidden md:table-cell">Catégorie</TableHead>
              <TableHead className="hidden lg:table-cell">
                Description
              </TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Disponibilité</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>Aucun produit ne correspond à vos critères.</p>
                    <p className="text-sm">
                      {searchQuery && selectedCategory
                        ? "Essayez de modifier votre recherche ou de changer de catégorie."
                        : searchQuery
                        ? "Essayez avec d'autres termes."
                        : selectedCategory
                        ? "Essayez de sélectionner une autre catégorie."
                        : "Aucun produit disponible."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => {
                const stockStatus = getStockStatus(item.stock);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={getCategoryColor(item.category)}
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                      {item.description || "—"}
                    </TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Disponible" : "Indisponible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={stockStatus.badge as any}
                        className={`flex items-center ${
                          stockStatus.className || ""
                        }`}
                      >
                        {stockStatus.icon}
                        {stockStatus.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setEditingItem(item)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingItem(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredItems.length > 0 && searchQuery && (
        <p className="text-sm text-muted-foreground">
          {filteredItems.length} produit{filteredItems.length > 1 ? "s" : ""}{" "}
          trouvé
          {filteredItems.length > 1 ? "s" : ""}
        </p>
      )}

      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSave={refresh}
        />
      )}

      {deletingItem && (
        <DeleteItemDialog
          item={deletingItem}
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          onDelete={refresh}
        />
      )}

      {paginatedItems.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} produit{filteredItems.length > 1 ? "s" : ""}{" "}
            au total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <span className="flex items-center px-2">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
