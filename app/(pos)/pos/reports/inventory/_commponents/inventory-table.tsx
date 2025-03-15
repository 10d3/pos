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
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Types basés sur le modèle Prisma
export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  available: boolean;
  createdAt: Date;
};

// Données fictives pour la démonstration
// const demoItems: MenuItem[] = [
//   {
//     id: "1",
//     name: "Pizza Margherita",
//     description: "Tomate, mozzarella, basilic frais",
//     category: "Pizzas",
//     price: 10.99,
//     available: true,
//     createdAt: new Date("2023-01-15"),
//   },
//   {
//     id: "2",
//     name: "Burger Classic",
//     description: "Bœuf, cheddar, salade, tomate, oignon, sauce maison",
//     category: "Burgers",
//     price: 12.99,
//     available: true,
//     createdAt: new Date("2023-02-10"),
//   },
//   {
//     id: "3",
//     name: "Salade César",
//     description: "Laitue romaine, parmesan, croûtons, sauce césar",
//     category: "Salades",
//     price: 8.99,
//     available: false,
//     createdAt: new Date("2023-03-05"),
//   },
//   {
//     id: "4",
//     name: "Pâtes Carbonara",
//     description: "Pâtes, lardons, œuf, parmesan, poivre",
//     category: "Pâtes",
//     price: 11.99,
//     available: true,
//     createdAt: new Date("2023-04-20"),
//   },
//   {
//     id: "5",
//     name: "Tiramisu",
//     description: "Mascarpone, café, cacao, biscuits",
//     category: "Desserts",
//     price: 6.99,
//     available: true,
//     createdAt: new Date("2023-05-12"),
//   },
// ];

interface InventoryTableProps {
  searchQuery: string;
  menuItems: any;
  selectedCategory: string;
}

export function InventoryTable({
  searchQuery,
  menuItems,
  selectedCategory,
}: InventoryTableProps) {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  //   const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setDeletingItem(null);
  };

  const handleEdit = (updatedItem: MenuItem) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  const handleAdd = (newItem: MenuItem) => {
    setItems([...items, newItem]);
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Pizzas: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Burgers:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      Salades:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Pâtes: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Desserts:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };

    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
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
              paginatedItems.map((item) => (
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
                        <DropdownMenuItem onClick={() => setEditingItem(item)}>
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
              ))
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
          onSave={handleEdit}
        />
      )}

      {deletingItem && (
        <DeleteItemDialog
          item={deletingItem}
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          onDelete={() => handleDelete(deletingItem.id)}
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
