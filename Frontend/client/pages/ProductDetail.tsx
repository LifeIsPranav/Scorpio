import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Heart,
  Share2,
  Star,
  Package,
  Truck,
  Shield,
  Award,
} from "lucide-react";
import { products, openWhatsApp, Product, categories } from "@/lib/data";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p) => p.id === id);
      setProduct(foundProduct || null);
      setCurrentImageIndex(0);
      setMainImageLoaded(false);
      setIsImageTransitioning(false);

      if (foundProduct) {
        // Get related products from same category
        const related = products
          .filter(
            (p) =>
              p.category === foundProduct.category && p.id !== foundProduct.id,
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link
            to="/products"
            className="text-primary hover:underline mt-4 inline-block"
          >
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryName =
    categories.find((cat) => cat.id === product.category)?.name || "Category";

  const nextImage = () => {
    setIsImageTransitioning(true);
    setMainImageLoaded(false);
    setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }, 150);
  };

  const prevImage = () => {
    setIsImageTransitioning(true);
    setMainImageLoaded(false);
    setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }, 150);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Breadcrumb */}
      <div className="pt-20 pb-4 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground animate-fade-in">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{categoryName}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4 animate-slide-in-left">
              {/* Main Image */}
              <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden group magnetic-hover">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                    mainImageLoaded && !isImageTransitioning
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  onLoad={() => {
                    setMainImageLoaded(true);
                    setIsImageTransitioning(false);
                  }}
                />

                {/* Loading overlay for smooth transitions */}
                {(!mainImageLoaded || isImageTransitioning) && (
                  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Featured Badge */}
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index !== currentImageIndex) {
                          setIsImageTransitioning(true);
                          setMainImageLoaded(false);
                          setTimeout(() => {
                            setCurrentImageIndex(index);
                          }, 150);
                        }
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        index === currentImageIndex
                          ? "border-primary shadow-lg scale-105"
                          : "border-transparent hover:border-muted-foreground/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-slide-in-right">
              {/* Category */}
              <Link
                to="/categories"
                className="inline-block text-sm text-primary hover:underline font-medium"
              >
                {categoryName}
              </Link>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {product.name}
              </h1>

              {/* Rating (placeholder for future) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (24 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary">
                {product.price}
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <h3 className="font-semibold">Key Features:</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Premium quality materials</li>
                  <li>• Expert craftsmanship</li>
                  <li>• Fast and secure delivery</li>
                  <li>• 30-day satisfaction guarantee</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => openWhatsApp(product)}
                  size="lg"
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background rounded-full text-lg py-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Personalize with us
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium">{categoryName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="ml-2 font-medium text-green-600">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="specifications">Specs</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg mx-auto">
                  <h3 className="text-2xl font-bold mb-6">
                    Product Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description} This premium product represents the
                    perfect blend of functionality, style, and quality
                    craftsmanship. Each piece is carefully selected and curated
                    to meet the highest standards of excellence.
                  </p>

                  <h4 className="text-xl font-semibold mb-4">Key Highlights</h4>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold">Premium Quality</h5>
                          <p className="text-muted-foreground text-sm">
                            Crafted with the finest materials and attention to
                            detail
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold">Quality Guarantee</h5>
                          <p className="text-muted-foreground text-sm">
                            30-day satisfaction guarantee with full support
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold">Perfect Packaging</h5>
                          <p className="text-muted-foreground text-sm">
                            Beautifully packaged and ready for gifting
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold">Fast Delivery</h5>
                          <p className="text-muted-foreground text-sm">
                            Quick and secure delivery to your doorstep
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">4.8</span>
                      <span className="text-muted-foreground">
                        (24 reviews)
                      </span>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">
                            {rating}★
                          </span>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{
                                width:
                                  rating === 5
                                    ? "75%"
                                    : rating === 4
                                      ? "20%"
                                      : "5%",
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {rating === 5 ? "18" : rating === 4 ? "5" : "1"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      rating: 5,
                      date: "2 weeks ago",
                      comment:
                        "Absolutely love this product! The quality exceeded my expectations and the personalized service was fantastic.",
                      verified: true,
                    },
                    {
                      name: "Michael Chen",
                      rating: 5,
                      date: "1 month ago",
                      comment:
                        "Premium quality and excellent customer service. The WhatsApp support was very helpful in answering all my questions.",
                      verified: true,
                    },
                    {
                      name: "Emma Davis",
                      rating: 4,
                      date: "2 months ago",
                      comment:
                        "Great product overall. Delivery was fast and packaging was beautiful. Highly recommend!",
                      verified: true,
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold">{review.name}</h5>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">
                  Product Specifications
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold border-b border-border pb-2">
                      General
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{categoryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand</span>
                        <span className="font-medium">Scorpio Premium</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU</span>
                        <span className="font-medium">
                          SP-{product.id.padStart(4, "0")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Availability
                        </span>
                        <span className="font-medium text-green-600">
                          In Stock
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold border-b border-border pb-2">
                      Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">1.2 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dimensions
                        </span>
                        <span className="font-medium">25 × 15 × 8 cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">Premium Grade</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Warranty</span>
                        <span className="font-medium">2 Years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shipping Tab */}
            <TabsContent value="shipping" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">Shipping & Returns</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-primary" />
                        Shipping Information
                      </h4>
                      <div className="space-y-3 text-muted-foreground">
                        <p>• Free shipping on all orders above ₹2,000</p>
                        <p>• Standard delivery: 3-5 business days</p>
                        <p>• Express delivery: 1-2 business days</p>
                        <p>• Same-day delivery available in select cities</p>
                        <p>• International shipping available</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Packaging
                      </h4>
                      <div className="space-y-3 text-muted-foreground">
                        <p>• Eco-friendly packaging materials</p>
                        <p>• Premium gift wrapping available</p>
                        <p>• Secure packaging for safe delivery</p>
                        <p>• Tracking information provided</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Return Policy
                      </h4>
                      <div className="space-y-3 text-muted-foreground">
                        <p>• 30-day hassle-free returns</p>
                        <p>• Free return shipping</p>
                        <p>• Full refund or exchange options</p>
                        <p>• Items must be in original condition</p>
                        <p>• No questions asked policy</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Need Help?</h5>
                      <p className="text-muted-foreground text-sm mb-3">
                        Contact our personalized support team for any shipping
                        or return queries.
                      </p>
                      <Button
                        onClick={() => openWhatsApp(product)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with Support
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center animate-fade-in">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
