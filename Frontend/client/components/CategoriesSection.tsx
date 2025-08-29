import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
  order: number;
}

export default function CategoriesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicApi.getCategories() as any;
        if (response.success) {
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const navigateToCategory = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  if (loading) {
    return (
      <section id="categories" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          {/* <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our diverse range of product categories, each carefully
            curated to bring you the best selection.
          </p> */}
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigateToCategory(category.slug)}
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="self-start bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground rounded-full px-4 group/btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigateToCategory(category.slug);
                    }}
                  >
                    Explore
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for?
          </p>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            onClick={() => {
              const message =
                "Hi! I'm looking for a specific product. Could you help me find it?";
              const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, "_blank");
            }}
          >
            Contact Us on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
