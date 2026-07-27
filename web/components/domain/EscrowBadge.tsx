import { cn } from "@/lib/utils"

type EscrowStatus = "pending" | "locked" | "resolved"

interface EscrowBadgeProps {
	status: EscrowStatus
	className?: string
}

const statusConfig: Record<
	EscrowStatus,
	{ label: string; containerClass: string; dotClass: string }
> = {
	pending: {
		label: "Pending",
		containerClass: "bg-amber-50 text-amber-700 border border-amber-200",
		dotClass: "bg-amber-500",
	},
	locked: {
		label: "Locked",
		containerClass: "bg-indigo-50 text-indigo-700 border border-indigo-200",
		dotClass: "bg-indigo-500",
	},
	resolved: {
		label: "Resolved",
		containerClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
		dotClass: "bg-emerald-500",
	},
}

export function EscrowBadge({ status, className }: EscrowBadgeProps) {
	const config = statusConfig[status]

	return (
		<span
			role="status"
			aria-label={`Escrow status: ${config.label}`}
			className={cn(
				"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
				config.containerClass,
				className
			)}>
			<span
				className={cn("h-2 w-2 rounded-full shrink-0", config.dotClass)}
				aria-hidden="true"
			/>
			{config.label}
		</span>
	)
}
