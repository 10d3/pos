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
import { updateMenuItem } from "@/lib/reports";
import { CategoryType } from "@prisma/client";
import { categories } from "@/lib/data";

// Validation schema
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

interface EditItemDialogProps {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function EditItemDialog({
  item,
  open,
  onOpenChange,
  onSave,
}: EditItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      description: item.description || "",
      // Convert the enum value (ex: "ENTREES") to lowercase to match the category id ("entrees")
      category: item.category.toLowerCase(),
      price: item.price,
      available: item.available,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const updatedItem: MenuItem = {
        ...item,
        name: data.name,
        description: data.description || undefined,
        // Convert the selected id back to the enum format (ex: "entrees" becomes "ENTREES")
        category: data.category.toUpperCase() as CategoryType,
        price: data.price,
        available: data.available,
      };

      await updateMenuItem(item.id, updatedItem);

      toast.success("Produit modifié", {
        description: `${data.name} a été modifié avec succès.`,
      });

      // Refresh the page to reflect changes
      onSave();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la modification du produit.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Modifier un produit</DialogTitle>
          <DialogDescription>
            Modifiez les informations du produit ci-dessous. Les champs marqués
            d&apos;un * sont obligatoires.
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
                  "Enregistrer les modifications"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
