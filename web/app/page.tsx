import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { EcosystemBentoGrid } from "@/components/landing/EcosystemBentoGrid";
import { ArchitectureVisualization } from "@/components/landing/ArchitectureVisualization";
import { DeveloperResources } from "@/components/landing/DeveloperResources";

async function getRepoStats() {
  const repoNames = [
    "Padi-Pay/padipay-frontend",
    "Padi-Pay/padipay-relayer-api",
    "Padi-Pay/padipay-contract"
  ];
  
  const stats: Record<string, { stars: number; forks: number }> = {};
  
  try {
    for (const repo of repoNames) {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        next: { revalidate: 3600 }
      });
      
      if (res.ok) {
        const data = await res.json();
        stats[`https://github.com/${repo}`] = {
          stars: data.stargazers_count,
          forks: data.forks_count
        };
      } else {
        console.error(`Failed to fetch ${repo}: ${res.status} ${res.statusText}`);
      }
    }
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
  }
  
  return stats;
}

export default async function Home() {
  const repoStats = await getRepoStats();

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <EcosystemBentoGrid initialStats={repoStats} />
      <ArchitectureVisualization />
      <DeveloperResources />
    </div>
  );
}
