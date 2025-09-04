import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  premium?: boolean;
  custom?: boolean;
  tags: string[];
}

interface ProductCardProps {
  product: Product;
  showCustomBadge?: boolean;
}

export default function ProductCard({ product, showCustomBadge = false }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debug: Log the product data to check slug
  console.log('ProductCard received product:', { name: product.name, slug: product.slug, _id: product._id });

  const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
    const message = `Hi! I'm interested in ${product.name}. Can you provide more information?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppClick = () => {
    openWhatsApp();
  };

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-primary/20 magnetic-hover">
      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
          {/* Current Image */}
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded && !isTransitioning ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => {
              setImageLoaded(true);
              setIsTransitioning(false);
            }}
          />

          {/* Loading placeholder */}
          {(!imageLoaded || isTransitioning) && (
            <div className="absolute inset-0 bg-muted animate-pulse"></div>
          )}

          {/* Image navigation dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (index !== currentImage) {
                      setIsTransitioning(true);
                      setImageLoaded(false);
                      setTimeout(() => {
                        setCurrentImage(index);
                      }, 100);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImage
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Actions overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-10 h-10 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
            {product.premium && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                Premium
              </Badge>
            )}
            {/* {(product.custom || showCustomBadge) && (
              <Badge className="">
                Customizable
              </Badge>
            )} */}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price}
          </span>

          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWhatsAppClick();
            }}
            size="icon"
            className="bg-foreground hover:bg-foreground/90 text-background rounded-full w-12 h-12 group/btn shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          >
            <MessageCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
