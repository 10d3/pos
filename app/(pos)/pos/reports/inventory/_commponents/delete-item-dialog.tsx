/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import type { MenuItem } from "./inventory-table";
import { deleteMenuItem } from "@/lib/reports";

interface DeleteItemDialogProps {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onDelete,
}: DeleteItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Simuler un appel API
      await deleteMenuItem(item.id);

      onDelete();

      toast.success("Produit supprimé", {
        description: `${item.name} a été supprimé avec succès.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la suppression du produit.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir supprimer ce produit ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le produit{" "}
            <span className="font-medium">{item.name}</span> sera définitivement
            supprimé de l&apos;inventaire.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: any) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
