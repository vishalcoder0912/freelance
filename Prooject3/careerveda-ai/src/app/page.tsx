import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AICopilotSection from "@/components/landing/AICopilotSection";
import CareerDNASection from "@/components/landing/CareerDNASection";
import DreamJobSection from "@/components/landing/DreamJobSection";
import BattlePassSection from "@/components/landing/BattlePassSection";
import AIFeaturesSection from "@/components/landing/AIFeaturesSection";
import SuccessGalaxySection from "@/components/landing/SuccessGalaxySection";
import CareerUniverseSection from "@/components/landing/CareerUniverseSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CareerUniverseSection />
      <AICopilotSection />
      <CareerDNASection />
      <DreamJobSection />
      <SuccessGalaxySection />
      <BattlePassSection />
      <AIFeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
