"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal } from "../ui/Modal"
import { TextInput } from "../forms/TextInput"
import { CurrencyInput } from "../forms/CurrencyInput"
import { useApi } from "../../src/hooks/useApi"
import { toast } from "sonner"
import { ArrowUpRight, Loader2 } from "lucide-react"

// Dynamic schema builder to validate amount against available balance
export const getWithdrawSchema = (availableBalance: number) =>
  z.object({
    destinationAddress: z
      .string()
      .trim()
      .length(56, "Address must be exactly 56 characters")
      .startsWith("G", "Address must start with 'G'")
      .regex(/^G[a-zA-Z0-9]{55}$/, "Address must be a valid Stellar public address"),
    amount: z
      .number({ message: "Amount is required and must be a valid number" })
      .positive("Amount must be greater than zero")
      .max(availableBalance, `Insufficient balance. Available is $${availableBalance}`),
  })

type WithdrawFormData = {
  destinationAddress: string
  amount: number
}

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  mutateBalance: () => Promise<any>
}

export function WithdrawModal({
  isOpen,
  onClose,
  availableBalance = 0,
  mutateBalance,
}: WithdrawModalProps) {
  const { request, isLoading } = useApi<{ success: boolean; message?: string }>()

  const validationSchema = useMemo(() => getWithdrawSchema(availableBalance), [availableBalance])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      destinationAddress: "",
      amount: undefined,
    },
    mode: "onChange",
  })

  const onSubmit = async (data: WithdrawFormData) => {
    const { data: resData, error } = await request({
      url: "/api/wallets/withdraw",
      method: "POST",
      data: {
        destinationAddress: data.destinationAddress,
        amount: data.amount,
      },
    })

    if (!error) {
      toast.success("Withdrawal initiated successfully! Your balance will reflect this transfer shortly.")
      await mutateBalance()
      reset()
      onClose()
    } else {
      console.error("Withdrawal failed:", error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Withdraw Funds">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl bg-orange-500/5 p-4 border border-orange-500/10 mb-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600 mb-1">
            Available to Withdraw
          </div>
          <div className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(availableBalance)}{" "}
            USDC
          </div>
        </div>

        <TextInput
          label="Destination Stellar Address"
          placeholder="e.g. GC3..."
          error={errors.destinationAddress?.message}
          disabled={isLoading}
          {...register("destinationAddress")}
        />

        <CurrencyInput
          label="Amount (USDC)"
          placeholder="0.00"
          error={errors.amount?.message}
          disabled={isLoading}
          {...register("amount", { valueAsNumber: true })}
        />

        <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-surface-variant/40 text-on-surface transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-on-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowUpRight className="h-4 w-4" />
                Withdraw USDC
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
