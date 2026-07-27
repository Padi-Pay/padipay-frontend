"use client"

import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Toast as ToastType } from "@/store/toastStore"
import { useToastStore } from "@/store/toastStore"

const variantConfig = {
	success: {
		icon: CheckCircle,
		containerClass: "bg-primary-container border-primary/20 text-on-primary-container",
	},
	error: {
		icon: AlertCircle,
		containerClass: "bg-tertiary-container border-tertiary/20 text-on-tertiary-container",
	},
	info: {
		icon: Info,
		containerClass: "bg-surface-container-high border-outline-variant/30 text-on-surface",
	},
}

interface ToastItemProps {
	toast: ToastType
}

export function ToastItem({ toast }: ToastItemProps) {
	const removeToast = useToastStore((s) => s.removeToast)
	const config = variantConfig[toast.variant]
	const Icon = config.icon

	return (
		<div
			role="alert"
			aria-live="polite"
			className={cn(
				"flex items-center gap-3 w-80 px-4 py-3 rounded-xl border shadow-lg",
				"animate-in slide-in-from-right-full fade-in duration-300",
				config.containerClass
			)}>
			<Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
			<p className="flex-1 text-sm font-medium">{toast.message}</p>
			<button
				type="button"
				onClick={() => removeToast(toast.id)}
				aria-label="Dismiss notification"
				className="shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current">
				<X className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	)
}
