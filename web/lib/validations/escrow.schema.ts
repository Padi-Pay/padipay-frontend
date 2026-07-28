import { z } from "zod";

export const escrowIntentSchema = z.object({
  sellerReference: z.string().min(1, "Seller reference is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().min(1, "Description is required"),
});

export type EscrowIntentFormData = z.infer<typeof escrowIntentSchema>;
