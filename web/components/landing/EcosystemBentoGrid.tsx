"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Network, Webhook, FileCode2, Archive, Star, GitFork, ExternalLink } from "lucide-react"

const repos = [
	{
		title: "Frontend & WhatsApp Gateway",
		description: "The unified web portal and headless bridge between WhatsApp Business API and decentralized payment triggers.",
		icon: Network,
		url: "https://github.com/Padi-Pay/padipay-frontend",
	},
	{
		title: "Stellar Relayer API",
		description: "High-performance bridge optimizing transaction throughput and Soroban event monitoring.",
		icon: Webhook,
		url: "https://github.com/Padi-Pay/stellar-relayer-api",
	},
	{
		title: "Soroban Escrow Contracts",
		description: "Formally verified Rust contracts for multi-party agreement and secure fund holding.",
		icon: FileCode2,
		url: "https://github.com/Padi-Pay/contract",
	},
	// {
	// 	title: "Human Oracle Network",
	// 	description: "The decentralized dispute resolution layer powered by community-vetted mediators.",
	// 	icon: Users,
	// 	stars: 56,
	// 	forks: 12,
	// 	url: "",
	// },
	// {
	// 	title: "Contributor Portal",
	// 	description: "Everything needed to get started: Bounties, Guidelines, and Ecosystem Grants.",
	// 	icon: Castle,
	// 	stars: 112,
	// 	forks: 25,
	// 	url: "",
	// },
	{
		title: "Meta Repository",
		description: "Global documentation, governance proposals, and the unified architectural specification.",
		icon: Archive,
		stars: 342,
		forks: 45,
		url: "https://github.com/Padi-Pay/padipay-platform",
	},
]

export function EcosystemBentoGrid({ initialStats = {} }: { initialStats?: Record<string, { stars: number; forks: number }> }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [opacity, setOpacity] = useState(0)

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return
		const rect = containerRef.current.getBoundingClientRect()
		setPosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		})
	}

	const handleMouseEnter = () => setOpacity(1)
	const handleMouseLeave = () => setOpacity(0)

	return (
		<section className="py-32 bg-surface" id="ecosystem">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
					<div className="max-w-2xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
							Our Open Ecosystem
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="text-lg text-foreground/70">
							Modular architecture designed for developers to build the next generation of trusted
							commerce tools.
						</motion.p>
					</div>
					<motion.a
						href="https://github.com/padi-pay"
						target="_blank"
						rel="noopener noreferrer"
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="text-primary font-semibold flex items-center gap-2 hover:underline decoration-2 underline-offset-4 cursor-pointer"
					>
						View All Repositories
						<ExternalLink className="w-5 h-5" />
					</motion.a>
				</div>

				<div
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative group/container">
					{repos.map((repo, index) => (
						<motion.a
							key={repo.title}
							href={repo.url}
							target="_blank"
							rel="noopener noreferrer"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="block relative bg-white p-8 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer"
						>
							{/* Hardware-accelerated Spotlight Effect */}
							<div
								className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/container:opacity-100"
								style={{
									opacity,
									background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(22,163,74,0.06), transparent 40%)`,
								}}
							/>

							<div className="relative z-10 flex flex-col h-full">
								<div className="flex justify-between items-start mb-8">
									<span className="px-3 py-1 bg-surface-variant text-foreground/80 rounded-lg text-xs font-semibold uppercase tracking-wider">
										Repository
									</span>
									<repo.icon className="w-6 h-6 text-foreground/40 group-hover:text-primary transition-colors" />
								</div>

								<h4 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
									{repo.title}
								</h4>

								<p className="text-sm text-foreground/70 mb-8 grow leading-relaxed">
									{repo.description}
								</p>

								{/* <div className="flex items-center gap-6 mt-auto">
									<div className="flex items-center gap-1.5 text-foreground/60 text-sm font-medium group-hover:text-foreground transition-colors">
										<Star className="w-4 h-4" /> {initialStats[repo.url]?.stars || 0}
									</div>
									<div className="flex items-center gap-1.5 text-foreground/60 text-sm font-medium group-hover:text-foreground transition-colors">
										<GitFork className="w-4 h-4" /> {initialStats[repo.url]?.forks || 0}
									</div>
								</div> */}
							</div>
						</motion.a>
					))}
				</div>
			</div>
		</section>
	)
}
