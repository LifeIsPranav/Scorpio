import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PremiumShowcase from "@/components/PremiumShowcase";
import CategoriesSection from "@/components/CategoriesSection";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <PremiumShowcase />
      <ProductShowcase />
      <CategoriesSection />
      <Footer />
    </div>
  );
}
