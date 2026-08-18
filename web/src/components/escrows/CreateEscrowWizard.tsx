'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { escrowIntentSchema, EscrowIntentFormData } from '@/lib/validations/escrow.schema';
import { TextInput } from '@/components/forms/TextInput';
import { CurrencyInput } from '@/components/forms/CurrencyInput';
import { Button } from '@/components/ui/Button';

interface CreateEscrowWizardProps {
  buyerPublicKey: string | null;
  onSubmit: (data: EscrowIntentFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateEscrowWizard({ buyerPublicKey, onSubmit, isSubmitting }: CreateEscrowWizardProps) {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<EscrowIntentFormData>({
    resolver: zodResolver(escrowIntentSchema),
    mode: 'onTouched',
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger('seller');
    } else if (step === 2) {
      valid = await trigger(['amount', 'description']);
    }

    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const formData = getValues();

  return (
    <div className="flex flex-col gap-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-outline-variant/30 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        {[
          { num: 1, label: 'Counterparty', icon: ShieldCheck },
          { num: 2, label: 'Terms', icon: FileText },
          { num: 3, label: 'Review', icon: CheckCircle2 }
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          
          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                isActive ? 'border-primary bg-primary text-white' :
                isCompleted ? 'border-primary bg-primary/10 text-primary' :
                'border-outline-variant/60 bg-surface-container text-foreground/40'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${isActive || isCompleted ? 'text-primary' : 'text-foreground/40'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Who are you transacting with?</h3>
              <p className="mt-1 text-sm text-foreground/60">Enter the Stellar public key of the seller.</p>
            </div>
            
            <TextInput
              label="Seller Public Key"
              placeholder="G..."
              error={errors.seller?.message}
              {...register('seller')}
            />

            <div className="flex justify-end pt-4">
              <Button type="button" onClick={nextStep} variant="primary">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Set Escrow Terms</h3>
              <p className="mt-1 text-sm text-foreground/60">Define the amount and describe the conditions of this trade.</p>
            </div>
            
            <CurrencyInput
              label="Amount (XLM)"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount')}
            />

            <div className="space-y-1.5 flex flex-col w-full">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                placeholder="E.g., Payment for freelance design work..."
                className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors min-h-[100px] resize-y ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                {...register('description')}
              />
              {errors.description && (
                <span className="text-sm text-red-500" role="alert">{errors.description.message}</span>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" onClick={prevStep} variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={nextStep} variant="primary">
                Review <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Review & Confirm</h3>
              <p className="mt-1 text-sm text-foreground/60">Please review the details before finalizing the intent.</p>
            </div>
            
            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6 space-y-4">
              <div className="flex flex-col gap-1 border-b border-outline-variant/30 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Seller</span>
                <span className="text-sm font-mono text-foreground break-all">{formData.seller}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-outline-variant/30 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Amount</span>
                <span className="text-lg font-bold text-foreground">{formData.amount} XLM</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Description</span>
                <span className="text-sm text-foreground whitespace-pre-wrap">{formData.description || 'No description provided.'}</span>
              </div>
            </div>

            {buyerPublicKey ? (
              <div className="rounded-xl bg-primary/5 p-4 text-xs leading-relaxed text-primary/80 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  You are acting as the <strong>Buyer</strong>. Your wallet ({buyerPublicKey.substring(0,8)}...{buyerPublicKey.substring(50)}) will be used as the funding source. You will need to fund this escrow in the next step.
                </p>
              </div>
            ) : (
               <div className="rounded-xl bg-orange-50 p-4 text-xs leading-relaxed text-orange-800 flex items-start gap-3">
                 <p>Wallet not loaded. Please wait...</p>
               </div>
            )}

            <div className="flex justify-between pt-4">
              <Button type="button" onClick={prevStep} variant="secondary" disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting || !buyerPublicKey} isLoading={isSubmitting}>
                Create Intent
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
