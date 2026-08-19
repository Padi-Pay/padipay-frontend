import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { GlobalErrorBoundary } from "@/src/components/error/GlobalErrorBoundary";
import { Providers } from "@/src/components/providers/Providers";

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
        <GlobalErrorBoundary>
          <Providers>
            <AppChrome>{children}</AppChrome>
          </Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
