'use client';

import React from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useWalletBalance } from '@/src/hooks/queries/useWalletQuery';
import { useFundEscrowMutation } from '@/src/hooks/mutations/useFundEscrowMutation';
import { Button } from '@/components/ui/Button';

interface FundEscrowModalProps {
  escrowId: string;
  amount: string;
  buyerPublicKey: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FundEscrowModal({ escrowId, amount, buyerPublicKey, isOpen, onClose }: FundEscrowModalProps) {
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance();
  const fundMutation = useFundEscrowMutation();

  const currentBalance = parseFloat(balanceData?.data?.balance || '0');
  const requiredAmount = parseFloat(amount);
  const hasInsufficientFunds = currentBalance < requiredAmount;

  if (!isOpen) return null;

  const handleFund = async () => {
    if (hasInsufficientFunds) return;

    await fundMutation.mutateAsync({
      walletAddress: buyerPublicKey,
      amount: amount,
      escrowId: escrowId,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={() => !fundMutation.isPending && onClose()}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
          <ShieldAlert className="h-6 w-6" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground">Fund Escrow</h2>
        <p className="mt-2 text-sm text-foreground/70">
          You are about to fund this escrow. The specified amount will be deducted from your wallet and locked in the smart contract until the terms are met.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
            <span className="text-sm font-medium text-foreground/60">Required Amount</span>
            <span className="text-base font-bold text-foreground">{amount} XLM</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
            <span className="text-sm font-medium text-foreground/60">Your Balance</span>
            {isBalanceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-foreground/50" />
            ) : (
              <span className={`text-base font-bold ${hasInsufficientFunds ? 'text-red-500' : 'text-green-600'}`}>
                {balanceData?.data?.balance || '0.00'} XLM
              </span>
            )}
          </div>

          {hasInsufficientFunds && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 font-medium">
              Insufficient funds. Please top up your wallet to proceed with funding this escrow.
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={fundMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleFund}
            disabled={hasInsufficientFunds || isBalanceLoading || fundMutation.isPending}
            isLoading={fundMutation.isPending}
            className={hasInsufficientFunds ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {hasInsufficientFunds ? 'Insufficient Funds' : 'Confirm & Fund'}
          </Button>
        </div>
      </div>
    </div>
  );
}
