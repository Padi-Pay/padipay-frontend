import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PadiPay",
  description: "Privacy Policy for the PadiPay MVP",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#f1f0ff] min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-16 rounded-3xl border border-[#BDCABA] shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#111C2D] mb-4">
          Privacy Policy
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
              As an MVP frontend built for the PadiPay ecosystem, this application primarily serves as an interface for testing and interacting with the core protocol. We are committed to transparency in our current phase. The application is designed to minimize the collection of personal information, and any information processed is limited to what is necessary to operate the application during this MVP phase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              2. Data Processing & Scope
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed mb-4">
              The current MVP does not require user accounts and does not support direct wallet authentication. The frontend operates as a UI layer interacting with the broader PadiPay architecture. 
            </p>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              When utilizing the WhatsApp Bot interface, interactions involve phone numbers and message contents to process escrow intents. PadiPay acts strictly as a routing and communication layer, transmitting these intents to the PadiPay Relayer API. We rely on third-party messaging providers (such as Meta and Twilio) for message transmission, and their respective privacy policies and data retention practices apply to the handling of those messages outside of our infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              3. Blockchain Immutaibility
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              PadiPay's smart contracts are currently deployed to the Stellar Testnet. Transaction data and state related to escrows will be visible on the public ledger. Because blockchain data is immutable by design, users should not include sensitive personal information in transaction memos or escrow terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#006B2C] mb-4">
              4. Future Milestones
            </h2>
            <p className="text-lg text-[#3E4A3D] leading-relaxed">
              As the PadiPay ecosystem evolves, planned features include mainnet deployment and direct wallet connectivity. This policy will be updated to reflect new data handling procedures and integration points as those features are rolled out.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
