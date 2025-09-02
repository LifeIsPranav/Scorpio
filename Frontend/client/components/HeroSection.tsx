import SearchBar from "./SearchBar";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-muted/10"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-3/4 right-1/4 w-20 h-20 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-green-400/25 to-blue-400/25 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Premium Quality Showcase
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Discover </span>
            {/* <br /> */}
            <span className="text-foreground/90"> Excellence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore our curated collection of premium products. Connect directly
            to discuss, negotiate, and make your perfect purchase.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full group magnetic-hover shimmer relative overflow-hidden"
              onClick={scrollToProducts}
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-full magnetic-hover border-2"
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Categories
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50+", label: "Premium Products" },
              { number: "8+", label: "Categories" },
              { number: "1000+", label: "Happy Customers" },
              { number: "24/7", label: "WhatsApp Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-foreground/60 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform"
        onClick={scrollToProducts}
      >
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full p-1 hover:border-foreground/40 transition-colors">
          <div className="w-1 h-3 bg-foreground/40 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div> */}
    </section>
  );
}
