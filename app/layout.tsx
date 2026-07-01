import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/landing/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PadiPay - Trade with confidence",
  description: "PadiPay provides WhatsApp-powered escrow for everyday trade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col selection:bg-primary/20 selection:text-primary">
        
        {/* Navigation */}
        <nav className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center">
                  <Image src="/logo.png" alt="PadiPay Logo" width={140} height={68} className="object-contain" priority />
                </Link>
                <div className="hidden md:flex items-center space-x-6 h-full">
                  <Link href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                    How it works
                  </Link>
                  <Link href="#architecture" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                    Ecosystem
                  </Link>
                  <Link href="#status" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                    System Status
                  </Link>
                  <Link href="/docs" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                    Developers
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="https://github.com/padipay" target="_blank" className="hidden sm:block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                  GitHub
                </Link>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                  Start Trading
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        
        {/* Global Footer */}
        <Footer />
        
      </body>
    </html>
  );
}
