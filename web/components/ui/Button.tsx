import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "./Spinner"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-on-primary hover:bg-primary/90 shadow-sm focus-visible:ring-primary",
	secondary:
		"bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm focus-visible:ring-secondary",
	danger:
		"bg-tertiary text-on-tertiary hover:bg-tertiary/90 shadow-sm focus-visible:ring-tertiary",
	ghost:
		"bg-transparent text-on-surface hover:bg-surface-variant focus-visible:ring-outline",
}

const sizeClasses: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
	md: "px-5 py-2.5 text-sm rounded-xl gap-2",
	lg: "px-8 py-4 text-base rounded-xl gap-2.5",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			isLoading = false,
			className,
			disabled,
			children,
			...props
		},
		ref
	) => {
		const isDisabled = disabled || isLoading

		return (
			<button
				ref={ref}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				className={cn(
					"inline-flex items-center justify-center font-semibold transition-all",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					"disabled:pointer-events-none disabled:opacity-50",
					"active:scale-[0.98]",
					variantClasses[variant],
					sizeClasses[size],
					className
				)}
				{...props}>
				{isLoading && <Spinner size="sm" className="text-current" />}
				{isLoading ? <span className="ml-1">Loading...</span> : children}
			</button>
		)
	}
)

Button.displayName = "Button"
