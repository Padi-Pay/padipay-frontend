"use client";

import { motion } from "framer-motion";
import {
  GitMerge,
  Map,
  Banknote,
  FileText,
  TerminalSquare,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";

const resources = [
  { name: "Architecture", icon: GitMerge, href: "https://github.com/Padi-Pay/padipay-docs/blob/main/docs/architecture.md" },
  { name: "Roadmap", icon: Map, href: "https://github.com/Padi-Pay/padipay-docs/blob/main/ROADMAP.md" },
  { name: "Docs", icon: FileText, href: "https://github.com/Padi-Pay/padipay-docs" },
  { name: "Standards", icon: BadgeCheck, href: "https://github.com/Padi-Pay/padipay-docs/blob/main/docs/contributing.md" },
];

export function DeveloperResources() {
  return (
    <section className="py-24" style={{ backgroundColor: "#f1f0ff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: Copy & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

          {/* Copy */}
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold tracking-tight text-[#111C2D] mb-6"
            >
              Built with Developers, for the World.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[#3E4A3D] leading-relaxed"
            >
              PadiPay is 100% open source. From our smart contracts to our bot gateway, every line of code is designed to be audited, improved, and utilized by the community.
            </motion.p>
          </div>

          {/* Metrics */}
          {/* <div className="flex gap-4 justify-start lg:justify-end flex-wrap">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-[#BDCABA] rounded-2xl py-6 px-8 text-center shadow-sm w-[150px]"
            >
              <div className="text-[#006B2C] text-2xl font-bold mb-1">12k+</div>
              <div className="text-[#6E7B6C] text-xs font-semibold uppercase tracking-wide">COMMITS</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-[#BDCABA] rounded-2xl py-6 px-8 text-center shadow-sm w-[150px]"
            >
              <div className="text-[#006B2C] text-2xl font-bold mb-1">45</div>
              <div className="text-[#6E7B6C] text-xs font-semibold uppercase tracking-wide">CONTRIBUTORS</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-[#BDCABA] rounded-2xl py-6 px-8 text-center shadow-sm w-[150px]"
            >
              <div className="text-[#006B2C] text-2xl font-bold mb-1">2M+</div>
              <div className="text-[#6E7B6C] text-xs font-semibold uppercase tracking-wide">TX VOL</div>
            </motion.div>
          </div> */}
        </div>

        {/* Bottom Section: Resource Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {resources.map((resource, index) => (
            <Link key={resource.name} href={resource.href} target="_blank" rel="noopener noreferrer">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-[#BDCABA] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-[#006B2C] hover:shadow-md transition-all group cursor-pointer"
              >
                <resource.icon className="w-6 h-6 text-[#006B2C] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[#111C2D] font-medium text-sm">
                  {resource.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
