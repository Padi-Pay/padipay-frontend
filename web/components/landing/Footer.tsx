"use client"

import Link from "next/link"
import Image from "next/image"

const footerLinks = [
	{
		title: "Ecosystem",
		links: [
			{ name: "GitHub Org", href: "https://github.com/padi-pay" },
			{ name: "Documentation", href: "https://github.com/Padi-Pay/padipay-docs" },
		],
	},
	{
		title: "Community",
		links: [
			{ name: "Roadmap", href: "https://github.com/Padi-Pay/padipay-docs/blob/main/ROADMAP.md" },
			// { name: "Bounties", href: "#" },
			// { name: "Discourse", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ name: "Privacy", href: "/privacy" },
			{ name: "Security", href: "/security" },
			// { name: "Audits", href: "#" },
		],
	},
]

export function Footer() {
	return (
		<footer className="w-full border-t border-[#BDCABA]/40 py-16" style={{ backgroundColor: "#f1f0ff" }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
					{/* Brand & Mission */}
					<div className="flex flex-col max-w-md">
						<Image
							src="/logo.png"
							alt="PadiPay Logo"
							width={140}
							height={68}
							className="object-contain mb-6"
						/>
						<p className="text-sm text-[#3E4A3D] leading-relaxed mb-10">
							Building the infrastructure for safe, human-centered commerce. Bridging the gap between Web3
							precision and Web2 usability.
						</p>
						<div className="text-sm text-[#3E4A3D]">
							© 2026 PadiPay Ecosystem. Built for Trust and Technical Precision.
						</div>
					</div>

					{/* Links Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
						{footerLinks.map((column) => (
							<div key={column.title} className="flex flex-col gap-4">
								<h4 className="text-[#006B2C] font-semibold text-sm mb-1">{column.title}</h4>
								{column.links.map((link) => (
									<Link
										key={link.name}
										href={link.href}
										className="text-[#3E4A3D] hover:text-[#006B2C] text-sm font-medium transition-colors hover:underline decoration-2 underline-offset-4">
										{link.name}
									</Link>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}
