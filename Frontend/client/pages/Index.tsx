import CategoriesSection from "@/components/CategoriesSection";
import CustomShowcase from "@/components/CustomShowcase";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import PremiumShowcase from "@/components/PremiumShowcase";
import ProductShowcase from "@/components/ProductShowcase";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <PremiumShowcase />
      <ProductShowcase isHomepage={true} />
      <CustomShowcase />
      <CategoriesSection />
      <Footer />
    </div>
  );
}
