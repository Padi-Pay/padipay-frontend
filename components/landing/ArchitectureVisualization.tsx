"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export function ArchitectureVisualization() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="py-32 border-t border-outline-variant/30 relative overflow-hidden" style={{ backgroundColor: "#faf7ff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4"
          >
            Technical Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
          >
            A modular stack designed for high availability and verifiable integrity across off-chain communication and on-chain settlement.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/30 bg-surface flex items-center justify-center aspect-[669/373]"
        >
          {/* Skeleton Loader */}
          {!isLoaded && (
            <div className="absolute inset-0 z-10 bg-surface-variant animate-pulse flex items-center justify-center">
              <span className="text-foreground/40 font-semibold uppercase tracking-wider text-sm">Loading Diagram...</span>
            </div>
          )}
          
          {/* Architecture Image */}
          <Image 
            src="/architecture.png" 
            alt="Technical Architecture Diagram"
            width={1338} 
            height={746} 
            className={`w-full h-auto object-contain transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
