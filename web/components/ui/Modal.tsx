"use client"

import {
	useEffect,
	useRef,
	useCallback,
	type ReactNode,
} from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: ReactNode
	className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
	const overlayRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const previousFocusRef = useRef<HTMLElement | null>(null)

	const getFocusableElements = useCallback(() => {
		if (!panelRef.current) return []
		return Array.from(
			panelRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)
	}, [])

	useEffect(() => {
		if (isOpen) {
			previousFocusRef.current = document.activeElement as HTMLElement
			document.body.style.overflow = "hidden"

			const timer = setTimeout(() => {
				const focusable = getFocusableElements()
				if (focusable.length > 0) {
					focusable[0].focus()
				} else {
					panelRef.current?.focus()
				}
			}, 50)

			return () => {
				clearTimeout(timer)
				document.body.style.overflow = "unset"
				previousFocusRef.current?.focus()
			}
		}

		document.body.style.overflow = "unset"
		previousFocusRef.current?.focus()
	}, [isOpen, getFocusableElements])

	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose()
				return
			}

			if (e.key === "Tab") {
				const focusable = getFocusableElements()
				if (focusable.length === 0) return

				const first = focusable[0]
				const last = focusable[focusable.length - 1]

				if (e.shiftKey) {
					if (document.activeElement === first) {
						e.preventDefault()
						last.focus()
					}
				} else {
					if (document.activeElement === last) {
						e.preventDefault()
						first.focus()
					}
				}
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, onClose, getFocusableElements])

	if (!isOpen) return null

	return (
		<div
			ref={overlayRef}
			role="dialog"
			aria-modal="true"
			aria-label={title ?? "Dialog"}
			className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
				onClick={onClose}
				aria-hidden="true"
			/>

			<div
				ref={panelRef}
				tabIndex={-1}
				className={cn(
					"relative z-10 w-full max-w-lg rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-2xl",
					"animate-in zoom-in-95 fade-in duration-200",
					"focus:outline-none",
					className
				)}>
				{title && (
					<div className="flex items-center justify-between px-6 pt-6 pb-2">
						<h2 className="text-lg font-semibold text-on-surface">{title}</h2>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close dialog"
							className="p-2 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
							<X className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				)}

				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	)
}
