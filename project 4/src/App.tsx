import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import FeaturedProjects from "./components/FeaturedProjects";
import Collections from "./components/Collections";
import WhySalonFactory from "./components/WhySalonFactory";
import ManufacturingProcess from "./components/ManufacturingProcess";
import BestSellingProducts from "./components/BestSellingProducts";
import Testimonials from "./components/Testimonials";
import CaseStudies from "./components/CaseStudies";
import CostCalculator from "./components/CostCalculator";
import DownloadCatalog from "./components/DownloadCatalog";
import FinalLeadCapture from "./components/FinalLeadCapture";
import Footer from "./components/Footer";
import ProductDetail from "./components/ProductDetail";

const queryClient = new QueryClient();

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProjects />
      <Collections />
      <WhySalonFactory />
      <ManufacturingProcess />
      <BestSellingProducts />
      <Testimonials />
      <CaseStudies />
      <CostCalculator />
      <DownloadCatalog />
      <FinalLeadCapture />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
