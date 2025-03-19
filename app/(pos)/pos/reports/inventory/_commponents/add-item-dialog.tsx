"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { MenuItem } from "./inventory-table";
import { createMenuItem } from "@/lib/reports";
import { categories } from "@/lib/data";
import { CategoryType } from "@prisma/client";

// Schéma de validation avec Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie.",
  }),
  price: z.coerce.number().positive({
    message: "Le prix doit être un nombre positif.",
  }),
  available: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddItemDialog({
  open,
  onOpenChange,
  onAdd,
}: AddItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "", // will be set to category id (e.g. "entrees")
      price: 0,
      available: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Créer un nouvel élément avec un ID généré
      const newItem: MenuItem = {
        id: `temp-${Date.now()}`,
        name: data.name,
        description: data.description || undefined,
        // Convert the category id to uppercase so "entrees" becomes "ENTREES"
        category: data.category.toUpperCase() as CategoryType,
        price: data.price,
        available: data.available,
        createdAt: new Date(),
      };

      // Appeler l'API pour créer le menu item
      await createMenuItem(newItem);

      toast.success("Produit ajouté", {
        description: `${data.name} a été ajouté avec succès.`,
        duration: 3000,
      });

      // Réinitialiser le formulaire et fermer le dialogue
      form.reset();
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'ajout du produit.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Ajouter un produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit ci-dessous. Les champs
            marqués d&apos;un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Nom *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pizza Margherita"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Catégorie *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        // Use the category.id as value so that it transforms properly on submission
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} - {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre produit..."
                      className="resize-none min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    La description apparaîtra sur la carte du produit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Prix (HTG) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="9.99"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-medium">Disponibilité</FormLabel>
                    <div className="flex items-center gap-2 pt-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <span className="text-sm font-medium">
                        {field.value ? "Disponible" : "Indisponible"}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="sm:order-1"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto sm:order-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Ajouter le produit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
