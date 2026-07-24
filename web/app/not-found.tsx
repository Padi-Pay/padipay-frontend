"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Unlink, Home, Code, FileText, Code2 } from "lucide-react";

export default function NotFound() {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 15% 15%, rgba(22, 163, 74, 0.04) 0%, transparent 40%), var(--background)'
      }}
    >
      
      {/* 404 Hero Graphic */}
      <div className="flex items-center justify-center mb-12 relative select-none">
        <span className="text-[180px] font-extrabold text-surface-variant leading-none tracking-tighter">
          4
        </span>
        
        {/* Floating Broken Link Card (The '0') */}
        <motion.div 
          animate={{ 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-32 h-32 md:w-40 md:h-40 mx-2 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-outline-variant/30 z-10"
        >
          <Unlink className="w-16 h-16 md:w-20 md:h-20 text-primary opacity-80" strokeWidth={2.5} />
        </motion.div>

        <span className="text-[180px] font-extrabold text-surface-variant leading-none tracking-tighter -ml-2">
          4
        </span>
      </div>

      {/* Typography */}
      <div className="text-center max-w-2xl mx-auto mb-10 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Trade Link Not Found
        </h1>
        <p className="text-lg text-foreground/70">
          Even in the best ecosystems, sometimes a connection gets dropped. Let&apos;s get you back to the PadiPay hub.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16 z-10">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <Link 
          href="/#architecture"
          className="flex items-center justify-center gap-2 bg-white border border-outline-variant text-foreground/80 px-6 py-3 rounded-lg text-base font-semibold hover:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Code className="w-5 h-5 text-foreground/60" />
          Explore Architecture
        </Link>
      </div>

      {/* Helper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl z-10 mb-12">
        
        {/* Documentation Card */}
        <Link 
          href="/docs"
          className="bg-white border border-outline-variant rounded-2xl p-6 flex items-start gap-4 hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Documentation</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Learn how our open-source payment protocols work.
            </p>
          </div>
        </Link>

        {/* GitHub Card */}
        <Link 
          href="https://github.com/padipay"
          target="_blank"
          className="bg-white border border-outline-variant rounded-2xl p-6 flex items-start gap-4 hover:border-tertiary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-tertiary/10 rounded-xl">
            <Code2 className="w-6 h-6 text-tertiary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">GitHub Repository</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Contribute to the ecosystem or report a broken link.
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}
