import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | PadiPay",
  description: "Security information for the PadiPay MVP",
};

export default function SecurityPage() {
  return (
    <div className="bg-[#f1f0ff] min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-16 rounded-3xl border border-[#BDCABA] shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#111C2D] mb-4">
          Security
        </h1>
        <p className="text-sm text-[#6E7B6C] font-medium tracking-wide uppercase mb-12">
          Last Updated: MVP Phase
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              1. Overview
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              Security is the foundation of decentralized commerce. This document outlines the security posture of the PadiPay ecosystem during its current MVP phase. Please note that this is an early-stage deployment intended for testing and validation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              2. Smart Contracts & Testnet
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed mb-4">
              Our core escrow logic is built with Rust and deployed to the Stellar Soroban Testnet. The contracts are designed to enforce multi-party agreements and securely hold funds in escrow.
            </p>
            <div className="bg-[#f1f0ff] border-l-4 border-[#006B2C] p-4 rounded-r-lg mb-4">
              <p className="text-[#3E4A3D] font-medium">
                <strong>Status:</strong> The smart contracts are currently deployed on Testnet. They have not yet undergone formal, independent security audits. They are intended for testing purposes only, and users should not interact with them using mainnet assets or real funds.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              3. Relayer API & Fee Sponsorship
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              The PadiPay Relayer API abstracts away blockchain complexity and sponsors transaction fees for users. The API communicates with the Stellar network via secure endpoints. The Relayer architecture is designed so that it does not hold or require access to users' personal private keys for escrow interactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              4. Frontend & Web UI
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              This frontend is currently a UI-first MVP. At this stage, it does not handle private keys, manage direct custody of assets, or connect to mainnet blockchain wallets. Wallet integration and corresponding client-side security measures are planned for a future milestone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              5. Vulnerability Reporting
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              We welcome collaboration with the security community. If you discover a vulnerability in the PadiPay Frontend, Relayer API, or Smart Contracts, we kindly ask that you do not disclose it publicly. Please contact the core maintainers via our official GitHub repository by creating a confidential security advisory.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
