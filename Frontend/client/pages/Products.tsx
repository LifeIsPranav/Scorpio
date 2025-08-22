import Navigation from "@/components/Navigation";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

export default function Products() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <ProductShowcase />
      </div>
      <Footer />
    </div>
  );
}
