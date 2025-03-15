"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { addCustomer } from "@/lib/customer";

// Schéma de validation avec Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
  phone: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export function AddCustomerDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setSubmitStatus("loading");

    try {
      await addCustomer(data);

      // Afficher l'état de succès brièvement avant de fermer
      setSubmitStatus("success");

      toast.success(`Client ajouté`, {
        description: `${data.name} a été ajouté avec succès.`,
      });

      // Attendre un court instant pour montrer l'animation de succès
      setTimeout(() => {
        // Réinitialiser le formulaire et fermer le dialogue
        form.reset();
        setOpen(false);
        // Réinitialiser l'état après la fermeture
        setTimeout(() => setSubmitStatus("idle"), 300);
      }, 800);
    } catch (error) {
      setSubmitStatus("error");
      toast.error("Erreur", {
        description: `Une erreur est survenue lors de l'ajout du client: ${error}.`,
      });
      // Réinitialiser l'état d'erreur après un court délai
      setTimeout(() => setSubmitStatus("idle"), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser l'état quand le dialogue se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Réinitialiser le formulaire et l'état quand on ferme le dialogue
      setTimeout(() => {
        if (submitStatus !== "loading") {
          form.reset();
          setSubmitStatus("idle");
        }
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter un client
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px] transition-all duration-300 ${
          submitStatus === "loading" ? "opacity-95" : "opacity-100"
        }`}
      >
        {submitStatus === "loading" && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
            <div className="flex flex-col items-center gap-2 p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="font-medium text-center">
                Enregistrement en cours...
              </p>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-xl">
            Ajouter un nouveau client
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du client ci-dessous. Les champs marqués
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
                  <FormLabel className="font-medium">Nom complet *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jean Dupont"
                      {...field}
                      disabled={isLoading}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jean.dupont@exemple.fr"
                      {...field}
                      disabled={isLoading}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      {...field}
                      disabled={isLoading}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormDescription>
                    Format recommandé: 06 12 34 56 78
                  </FormDescription>
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOpenChange(false)}
                className="sm:order-1"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full sm:w-auto sm:order-2 transition-all duration-300 ${
                  submitStatus === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }`}
              >
                {submitStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Client ajouté
                  </>
                ) : (
                  "Enregistrer le client"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
