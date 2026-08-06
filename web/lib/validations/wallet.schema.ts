import { z } from "zod";

export const withdrawalSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .regex(/^\d+(\.\d+)?$/, 'Amount must be a positive number')
    .refine((value) => Number(value) > 0, 'Amount must be greater than zero'),
  destinationAddress: z
    .string()
    .length(56, "Address must be exactly 56 characters")
    .startsWith("G", "Address must start with 'G'"),
  asset: z.string().optional().default('XLM'),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;
