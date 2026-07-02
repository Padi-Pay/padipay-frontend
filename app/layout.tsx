import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/layout/Navbar";

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
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth scroll-pt-24`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col selection:bg-primary/20 selection:text-primary">
        
        {/* Navigation */}
        <Navbar />

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
