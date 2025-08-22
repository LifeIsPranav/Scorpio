import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { premiumProducts, Product, openWhatsApp } from "@/lib/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function PremiumShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % premiumProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % premiumProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + premiumProducts.length) % premiumProducts.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (premiumProducts.length === 0) {
    return null;
  }

  const currentProduct = premiumProducts[currentSlide];

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Premium <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our handpicked selection of premium products, carefully
            curated for those who appreciate quality and excellence.
          </p>
        </ScrollReveal>

        {/* Main Showcase */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Product Showcase Card */}
          <div className="relative bg-card rounded-3xl border border-border overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">
              {/* Product Image */}
              <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-muted group">
                <img
                  src={currentProduct.images[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Image overlay with additional images preview */}
                {currentProduct.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {currentProduct.images.slice(1, 4).map((image, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/50"
                      >
                        <img
                          src={image}
                          alt={`${currentProduct.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Featured badge */}
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Premium
                </Badge>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="w-fit">
                    Featured Product
                  </Badge>

                  <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                    {currentProduct.name}
                  </h3>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentProduct.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">
                      {currentProduct.price}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        (4.9)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/product/${currentProduct.id}`} className="flex-1">
                    <Button size="lg" className="w-full rounded-full group">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => openWhatsApp(currentProduct)}
                    className="flex-1 rounded-full border-foreground text-foreground hover:bg-foreground hover:text-background"
                  >
                    Contact Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {premiumProducts.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white shadow-lg z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white shadow-lg z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Slide Indicators */}
        {premiumProducts.length > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            {premiumProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-125"
                    : "bg-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Links to All Premium Products */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-4">
            {premiumProducts.map((product, index) => (
              <Button
                key={product.id}
                variant={index === currentSlide ? "default" : "outline"}
                size="sm"
                onClick={() => goToSlide(index)}
                className="rounded-full px-6 max-w-[200px]"
              >
                <span className="truncate">{product.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
