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
		containerClass: "bg-status-pending-muted text-status-pending-foreground border border-status-pending/20",
		dotClass: "bg-status-pending",
	},
	locked: {
		label: "Locked",
		containerClass: "bg-status-locked-muted text-status-locked-foreground border border-status-locked/20",
		dotClass: "bg-status-locked",
	},
	resolved: {
		label: "Resolved",
		containerClass: "bg-status-resolved-muted text-status-resolved-foreground border border-status-resolved/20",
		dotClass: "bg-status-resolved",
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
