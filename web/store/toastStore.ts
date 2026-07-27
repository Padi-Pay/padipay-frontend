import { create } from "zustand"

export type ToastVariant = "success" | "error" | "info"

export interface Toast {
	id: string
	message: string
	variant: ToastVariant
}

interface ToastState {
	toasts: Toast[]
	addToast: (message: string, variant?: ToastVariant) => void
	removeToast: (id: string) => void
}

const MAX_VISIBLE_TOASTS = 3
const AUTO_DISMISS_MS = 5000

let toastCounter = 0

export const useToastStore = create<ToastState>((set) => ({
	toasts: [],

	addToast: (message, variant = "info") => {
		const id = `toast-${++toastCounter}`

		set((state) => {
			const updated = [...state.toasts, { id, message, variant }]
			return { toasts: updated.slice(-MAX_VISIBLE_TOASTS) }
		})

		setTimeout(() => {
			set((state) => ({
				toasts: state.toasts.filter((t) => t.id !== id),
			}))
		}, AUTO_DISMISS_MS)
	},

	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id),
		})),
}))
