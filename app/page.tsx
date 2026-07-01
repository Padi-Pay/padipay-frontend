import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
    </div>
  );
}
