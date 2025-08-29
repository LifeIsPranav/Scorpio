import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  priceNumeric: number;
  images: string[];
  category: string;
  featured: boolean;
  custom: boolean;
  customFields?: Array<{
    fieldName: string;
    fieldType: 'dropdown' | 'radio' | 'checkbox' | 'text';
    required: boolean;
    options: Array<{label: string; value: string; priceModifier: number}>;
    placeholder?: string;
  }>;
  tags: string[];
}

export default function CustomShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomProducts = async () => {
      try {
        const response = await publicApi.getCustomProducts(8) as any;
        if (response.success) {
          setProducts(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch custom products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <ScrollReveal>
      <section className="py-24 bg-gradient-to-b from-muted/20 via-muted/25 to-muted/15 relative">
        {/* Gradient overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-background/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-foreground/10 to-foreground/20 rounded-full mb-6">
              <Settings className="w-8 h-8 text-foreground" />
            </div> */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Custom <span className="gradient-text">Products</span>
            </h2>
            {/* <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create something unique with our customizable products. Choose your preferences, 
              specifications, and let us craft the perfect solution for you.
            </p> */}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="transform hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <ProductCard 
                  product={product} 
                  showCustomBadge={true}
                />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            {/* <div className="inline-flex items-center justify-center bg-card rounded-full px-6 py-3 shadow-lg border border-border mb-6">
              <span className="text-muted-foreground font-medium">
                ✨ Need something specific? We've got you covered!
              </span>
            </div> */}
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background px-8 py-6 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/products?custom=true">
                  <Settings className="w-5 h-5 mr-2" />
                  Explore All Custom Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-border text-foreground hover:bg-muted px-8 py-6 rounded-full text-lg font-semibold"
              >
                <Link to="/contact">
                  Request Custom Quote
                </Link>
              </Button>
            </div>
          </div>

          {/* Features highlight */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card/60 rounded-xl backdrop-blur-sm border border-border/50">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Full Customization
              </h3>
              <p className="text-muted-foreground">
                Choose colors, sizes, materials, and add your personal touch to every product.
              </p>
            </div>
            <div className="text-center p-6 bg-card/60 rounded-xl backdrop-blur-sm border border-border/50">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Direct Communication
              </h3>
              <p className="text-muted-foreground">
                Your requirements are automatically shared via WhatsApp for quick assistance.
              </p>
            </div>
            <div className="text-center p-6 bg-card/60 rounded-xl backdrop-blur-sm border border-border/50">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Quick Turnaround
              </h3>
              <p className="text-muted-foreground">
                Fast production and delivery of your custom products with premium quality.
              </p>
            </div>
          </div> */}
        </div>
      </section>
    </ScrollReveal>
  );
}
