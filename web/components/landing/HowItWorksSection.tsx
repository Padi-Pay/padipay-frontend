"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Lock, Truck, Handshake } from "lucide-react";

const steps = [
  {
    id: "1",
    title: "1. Start Trade",
    description: "Initiate your agreement directly via WhatsApp using our intuitive bot gateway.",
    icon: MessageSquareText,
  },
  {
    id: "2",
    title: "2. Funds Secured",
    description: "Payment is held in a secure Soroban-powered escrow until terms are fulfilled.",
    icon: Lock,
  },
  {
    id: "3",
    title: "3. Goods Delivered",
    description: "Integrated logistics tracking ensures transparent delivery milestones for both parties.",
    icon: Truck,
  },
  {
    id: "4",
    title: "4. Release or Resolve",
    description: "Funds are released on success, or community mediators resolve any disputes.",
    icon: Handshake,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="pt-12 pb-24 bg-surface border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-foreground/70">
            Simple, secure, and human-centric trade flow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-[#F8FAFC] border border-[#CBD5E1] p-8 rounded-3xl hover:border-primary/50 transition-colors group flex flex-col text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
