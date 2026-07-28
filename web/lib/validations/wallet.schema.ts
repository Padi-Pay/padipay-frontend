import { z } from "zod";

export const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  destinationAddress: z
    .string()
    .length(56, "Address must be exactly 56 characters")
    .startsWith("G", "Address must start with 'G'"),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;
