"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hourglass, Home, ArrowRight, Bell } from "lucide-react";

export default function ComingSoon() {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 85% 15%, rgba(22, 163, 74, 0.05) 0%, transparent 40%), radial-gradient(circle at 15% 85%, rgba(131, 24, 67, 0.03) 0%, transparent 40%), var(--background)'
      }}
    >
      
      {/* Graphic / Animation Centerpiece */}
      <div className="relative mb-12 select-none flex items-center justify-center mt-8">
        
        {/* Pulsing Background Rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-40 h-40 bg-primary/20 rounded-full z-0"
        />
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
          className="absolute w-40 h-40 bg-primary/20 rounded-full z-0"
        />

        {/* Floating Glass Card */}
        <motion.div 
          animate={{ 
            y: [-8, 8, -8]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative w-32 h-32 md:w-40 md:h-40 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.15)] flex items-center justify-center border border-outline-variant/30 z-10"
        >
          <Hourglass className="w-16 h-16 md:w-20 md:h-20 text-primary opacity-90" strokeWidth={2} />
        </motion.div>
      </div>

      {/* Typography */}
      <div className="text-center max-w-2xl mx-auto mb-10 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
          Something Incredible is Building
        </h1>
        <p className="text-lg text-foreground/70 leading-relaxed">
          We are hard at work laying down the infrastructure for this feature. 
          Stay tuned as we prepare to bring the next generation of decentralized commerce tools to life.
        </p>
      </div>

      {/* Interactive CTA Section */}
      <div className="flex flex-col items-center w-full max-w-md z-10 gap-6 mb-16">
        
        {/* Email Capture Form (UI Only) */}
        <div className="flex w-full shadow-sm rounded-xl overflow-hidden border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <div className="pl-4 pr-2 py-3 bg-white flex items-center justify-center text-foreground/40">
            <Bell className="w-5 h-5" />
          </div>
          <input 
            type="email" 
            placeholder="Enter your email..." 
            className="flex-1 min-w-0 bg-white py-3 px-2 text-foreground placeholder:text-foreground/40 focus:outline-none"
          />
          <button className="bg-primary text-white px-4 sm:px-6 py-3 font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            Notify Me
            <ArrowRight className="w-4 h-4 hidden sm:block" />
          </button>
        </div>

        {/* Back to Home Link */}
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 text-foreground/60 hover:text-primary transition-colors font-medium group"
        >
          <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Hub
        </Link>
      </div>

    </div>
  );
}
