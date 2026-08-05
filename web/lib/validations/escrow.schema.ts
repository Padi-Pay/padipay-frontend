import { z } from "zod";

export const escrowIntentSchema = z.object({
  seller: z.string().min(56, "Stellar public key must be 56 characters").max(56),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
});

export type EscrowIntentFormData = z.infer<typeof escrowIntentSchema>;
