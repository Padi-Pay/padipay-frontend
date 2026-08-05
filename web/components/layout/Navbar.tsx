"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const closeMenu = () => setIsMobileMenuOpen(false)
	const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

	// Prevent scrolling on the body when the mobile menu overlay is active
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = "unset"
		}
		return () => {
			document.body.style.overflow = "unset"
		}
	}, [isMobileMenuOpen])

	return (
		<>
			<nav className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						{/* Logo */}
						<div className="flex items-center gap-8">
							<Link href="/" className="flex items-center" onClick={closeMenu}>
								<Image
									src="/logo.png"
									alt="PadiPay Logo"
									width={140}
									height={68}
									className="object-contain"
									priority
								/>
							</Link>

							{/* Desktop Navigation Links */}
							<div className="hidden md:flex items-center space-x-6 h-full">
								<Link
									href="/#how-it-works"
									className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
									How it works
								</Link>
								<Link
									href="/#ecosystem"
									className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
									Ecosystem
								</Link>
								{/* <Link
									href="/#status"
									className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
									System Status
								</Link> */}
								{/* <Link
									href="/docs"
									className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
									Developers
								</Link> */}
							</div>
						</div>

						{/* Right Side Actions (Desktop) & Mobile Toggle */}
						<div className="flex items-center gap-4">
							<Link
								href="https://github.com/padi-pay"
								target="_blank"
								className="hidden sm:block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
								GitHub
							</Link>
							<Link
								href="/login"
								className="hidden md:block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
								Login
							</Link>
							<Link 
								href="/register"
								className="hidden md:flex justify-center items-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
								Get Started
							</Link>

							{/* Mobile Menu Toggle Button */}
							<button
								type="button"
								className="md:hidden p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
								onClick={toggleMenu}
								aria-expanded={isMobileMenuOpen}
								aria-controls="mobile-menu"
								aria-label="Toggle mobile menu">
								<span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
								{isMobileMenuOpen ? (
									<X className="w-6 h-6" aria-hidden="true" />
								) : (
									<Menu className="w-6 h-6" aria-hidden="true" />
								)}
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Full-Screen Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm md:hidden"
					onClick={closeMenu}
					aria-hidden="true"
				/>
			)}

			{/* Mobile Menu Panel (Slide-in Drawer) */}
			<div
				id="mobile-menu"
				className={`fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] z-70 bg-surface border-l border-outline-variant/30 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
					isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className="flex items-center justify-between p-4 border-b border-outline-variant/30 h-16">
					<span className="font-bold text-[#111C2D]">Menu</span>
					<button
						type="button"
						className="p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
						onClick={closeMenu}
						aria-label="Close mobile menu">
						<X className="w-6 h-6" aria-hidden="true" />
					</button>
				</div>

				<div className="px-4 py-6 space-y-2 flex flex-col grow overflow-y-auto">
					<Link
						href="/#how-it-works"
						onClick={closeMenu}
						className="block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-surface-variant transition-colors">
						How it works
					</Link>
					<Link
						href="/#ecosystem"
						onClick={closeMenu}
						className="block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-surface-variant transition-colors">
						Ecosystem
					</Link>
					{/* <Link
						href="/#status"
						onClick={closeMenu}
						className="block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-surface-variant transition-colors">
						System Status
					</Link> */}
					{/* <Link
						href="/docs"
						onClick={closeMenu}
						className="block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-surface-variant transition-colors">
						Developers
					</Link> */}

					<div className="mt-4 pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
						<Link
							href="https://github.com/padipay"
							target="_blank"
							onClick={closeMenu}
							className="sm:hidden block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-surface-variant transition-colors">
							GitHub
						</Link>
						<Link
							href="/login"
							onClick={closeMenu}
							className="w-full flex justify-center items-center bg-surface-container/50 text-foreground border border-outline-variant/60 px-4 py-3 rounded-lg text-base font-bold hover:bg-surface-variant transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
							Login
						</Link>
						<Link
							href="/register"
							onClick={closeMenu}
							className="w-full flex justify-center items-center bg-primary text-white px-4 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}
