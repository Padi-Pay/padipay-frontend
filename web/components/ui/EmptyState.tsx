import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface EmptyStateProps {
	title: string
	description?: string
	icon?: ReactNode
	actionLabel?: string
	onAction?: () => void
	className?: string
}

export function EmptyState({
	title,
	description,
	icon,
	actionLabel,
	onAction,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-16 px-6 text-center",
				className
			)}>
			{icon && (
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant">
					{icon}
				</div>
			)}
			<h3 className="text-lg font-semibold text-on-surface mb-1">{title}</h3>
			{description && (
				<p className="text-sm text-on-surface-variant max-w-sm mb-6">
					{description}
				</p>
			)}
			{actionLabel && onAction && (
				<Button variant="primary" size="md" onClick={onAction}>
					{actionLabel}
				</Button>
			)}
		</div>
	)
}
