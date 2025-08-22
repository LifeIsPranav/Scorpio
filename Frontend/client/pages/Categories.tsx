import Navigation from "@/components/Navigation";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";

export default function Categories() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <CategoriesSection />
      </div>
      <Footer />
    </div>
  );
}
