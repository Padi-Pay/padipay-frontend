"use client"

import { motion } from "framer-motion"
import { ArrowRight, Code2, ShieldCheck } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
	return (
		<section className="relative overflow-hidden pt-24 pb-32 md:pt-28 bg-surface min-h-dvh">
			{/* Editorial Grid Background */}
			<div
				className="absolute inset-0 pointer-events-none z-0"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
					maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
				}}
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary-700 rounded-full text-sm font-medium mb-8 border border-primary/20 shadow-sm">
					<ShieldCheck className="w-4 h-4" />
					Open Source Trust Infrastructure
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto mb-6 leading-tight">
					Trade with confidence, even with people you&apos;ve{" "}
					<span className="text-primary italic">never met.</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
					PadiPay uses WhatsApp, escrow protection, and trusted community mediators to make everyday trade
					safer and simpler across the global ecosystem.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="flex flex-col sm:flex-row justify-center gap-4">
					<Link
						href="/#technical-architecture"
						className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary/90 shadow-sm transition-all hover:scale-105 active:scale-95">
						Explore Architecture <ArrowRight className="ml-2 w-5 h-5" />
					</Link>
					<Link
						href="https://github.com/padi-pay"
						target="_blank"
						className="inline-flex items-center justify-center px-8 py-4 border border-border text-base font-semibold rounded-xl text-foreground bg-white hover:bg-black/5 shadow-sm transition-all">
						<Code2 className="mr-2 w-5 h-5" /> View GitHub
					</Link>
				</motion.div>
			</div>
		</section>
	)
}
