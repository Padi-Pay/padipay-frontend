"use client"

import { useToastStore } from "@/store/toastStore"
import { ToastItem } from "./Toast"

export function ToastContainer() {
	const toasts = useToastStore((s) => s.toasts)

	if (toasts.length === 0) return null

	return (
		<div
			aria-label="Notifications"
			className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
			{toasts.map((toast) => (
				<div key={toast.id} className="pointer-events-auto">
					<ToastItem toast={toast} />
				</div>
			))}
		</div>
	)
}
