"use client"

import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface WalletBadgeProps {
	address: string
	className?: string
}

function truncateAddress(address: string): string {
	if (address.length <= 12) return address
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletBadge({ address, className }: WalletBadgeProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(address)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			const textarea = document.createElement("textarea")
			textarea.value = address
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand("copy")
			document.body.removeChild(textarea)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}, [address])

	return (
		<button
			type="button"
			onClick={handleCopy}
			aria-label={`Copy wallet address ${address}`}
			title={address}
			className={cn(
				"relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
				"bg-surface-container-high border border-outline-variant/30",
				"text-sm font-mono text-on-surface",
				"hover:bg-surface-container-highest transition-colors cursor-pointer",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
				className
			)}>
			<span className="truncate max-w-[140px]">{truncateAddress(address)}</span>
			{copied ? (
				<Check className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
			) : (
				<Copy className="h-3.5 w-3.5 text-on-surface-variant shrink-0" aria-hidden="true" />
			)}
			{copied && (
				<span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium bg-primary text-on-primary rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
					Copied!
				</span>
			)}
		</button>
	)
}
