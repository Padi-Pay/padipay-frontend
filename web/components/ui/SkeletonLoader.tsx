import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
	className?: string
	variant?: "text" | "circular" | "rectangular"
	width?: string | number
	height?: string | number
}

export function SkeletonLoader({
	className,
	variant = "text",
	width,
	height,
}: SkeletonLoaderProps) {
	const variantClasses = {
		text: "h-4 w-full rounded-md",
		circular: "h-12 w-12 rounded-full",
		rectangular: "h-32 w-full rounded-xl",
	}

	const style: React.CSSProperties = {}
	if (width) style.width = typeof width === "number" ? `${width}px` : width
	if (height) style.height = typeof height === "number" ? `${height}px` : height

	return (
		<div
			role="status"
			aria-label="Loading content"
			style={style}
			className={cn(
				"relative overflow-hidden bg-surface-container-high",
				variantClasses[variant],
				className
			)}>
			<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
			<style>{`
				@keyframes shimmer {
					100% {
						transform: translateX(100%);
					}
				}
			`}</style>
			<span className="sr-only">Loading...</span>
		</div>
	)
}
