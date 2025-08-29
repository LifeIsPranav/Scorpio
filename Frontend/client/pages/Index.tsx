import CategoriesSection from "@/components/CategoriesSection";
import CustomShowcase from "@/components/CustomShowcase";
import EnhancedProductShowcase from "@/components/EnhancedProductShowcase";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import PremiumShowcase from "@/components/PremiumShowcase";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <PremiumShowcase />
      <div id="products">
        <EnhancedProductShowcase isHomepage={true} />
      </div>
      <CustomShowcase />
      <CategoriesSection />
      <Footer />
    </div>
  );
}
