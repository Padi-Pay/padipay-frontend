import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { EcosystemBentoGrid } from "@/components/landing/EcosystemBentoGrid";
import { ArchitectureVisualization } from "@/components/landing/ArchitectureVisualization";
import { DeveloperResources } from "@/components/landing/DeveloperResources";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <EcosystemBentoGrid />
      <ArchitectureVisualization />
      <DeveloperResources />
    </div>
  );
}
