"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Shield, PackageCheck, Scale } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Start Trade",
    description: "Buyer and seller agree on terms through WhatsApp.",
    icon: MessageSquareText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "02",
    title: "Funds Secured",
    description: "Money stays protected in escrow.",
    icon: Shield,
    color: "bg-green-100 text-primary",
  },
  {
    id: "03",
    title: "Goods Delivered",
    description: "Shipment and logistics are completed.",
    icon: PackageCheck,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "04",
    title: "Release or Resolve",
    description: "Funds are released or trusted mediators intervene.",
    icon: Scale,
    color: "bg-amber-100 text-secondary",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-surface border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-xl text-foreground/70">
            A seamless, frictionless experience designed for everyday trade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connecting Line (Hidden on mobile) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-outline-variant/30 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-sm mb-6 transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}>
                <step.icon className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold text-foreground/30 uppercase tracking-widest mb-2">Step {step.id}</span>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-foreground/70 leading-relaxed px-4">{step.description}</p>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
