
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreatePurchaseData } from "@/types/client";

const purchaseSchema = z.object({
  product_name: z.string().min(1, { message: "Le nom du produit est requis" }),
  quantity: z.coerce.number().min(1, { message: "La quantité doit être d'au moins 1" }),
  price: z.coerce.number().min(0, { message: "Le prix ne peut pas être négatif" }),
});

type PurchaseFormProps = {
  clientId: string;
  onSubmit: (data: CreatePurchaseData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

export default function PurchaseForm({
  clientId,
  onSubmit,
  onCancel,
  isSubmitting,
}: PurchaseFormProps) {
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      product_name: "",
      quantity: 1,
      price: 0,
    },
  });

  const handleSubmit = async (data: z.infer<typeof purchaseSchema>) => {
    try {
      const purchaseData: CreatePurchaseData = {
        client_id: clientId,
        product_name: data.product_name,
        quantity: data.quantity,
        price: data.price,
      };
      
      await onSubmit(purchaseData);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input placeholder="Nom du produit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Ajouter le produit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
