import ProductCard from "./ProductCard";
import { ArrowRight, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api";
import ScrollReveal from "./ScrollReveal";

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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Custom Products
              <span className="block text-lg font-normal text-orange-600 dark:text-orange-400 mt-2">
                Personalize to Your Needs
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create something unique with our customizable products. Choose your preferences, 
              specifications, and let us craft the perfect solution for you.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
            <div className="inline-flex items-center justify-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-orange-200 dark:border-orange-800 mb-6">
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                ✨ Need something specific? We've got you covered!
              </span>
            </div>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
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
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-950/20 px-8 py-6 rounded-full text-lg font-semibold"
              >
                <Link to="/contact">
                  Request Custom Quote
                </Link>
              </Button>
            </div>
          </div>

          {/* Features highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Full Customization
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose colors, sizes, materials, and add your personal touch to every product.
              </p>
            </div>
            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Direct Communication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your requirements are automatically shared via WhatsApp for quick assistance.
              </p>
            </div>
            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quick Turnaround
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fast production and delivery of your custom products with premium quality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
