import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustedLogos from "./components/TrustedLogos";
import Collections from "./components/Collections";
import BestSelling from "./components/BestSelling";
import Stats from "./components/Stats";
import BeforeAfter from "./components/BeforeAfter";
import WhySalonFactory from "./components/WhySalonFactory";
import Manufacturing from "./components/Manufacturing";
import Calculator from "./components/Calculator";
import IndiaMap from "./components/IndiaMap";
import AIDesigner from "./components/AIDesigner";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Locations from "./components/Locations";
import Footer from "./components/Footer";
import FloatingConversion from "./components/FloatingConversion";

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

function HomePage() {
  return (
    <>
      <Hero />
      <TrustedLogos />
      <Collections />
      <BestSelling />
      <Stats />
      <BeforeAfter />
      <WhySalonFactory />
      <Manufacturing />
      <Calculator />
      <IndiaMap />
      <AIDesigner />
      <Testimonials />
      <FAQ />
      <Locations />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
        <FloatingConversion />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
