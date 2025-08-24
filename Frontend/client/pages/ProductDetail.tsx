import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

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
  Zap,
  Check,
} from "lucide-react";

// API product interface (different from static data)
interface ApiProduct {
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
  whatsappMessage?: string;
  tags: string[];
  keyFeatures?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  specifications?: {
    general?: {
      brand?: string;
      sku?: string;
      warranty?: string;
      availability?: string;
    };
    details?: {
      weight?: string;
      dimensions?: string;
      material?: string;
      color?: string;
    };
  };
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
  order: number;
}

interface ApiReview {
  _id: string;
  productId: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isVisible: boolean;
  adminReply?: string;
  adminReplyDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>(); // This is actually the slug from URL
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Customer review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    customerPhone: '',
    rating: 0,
    title: '',
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Star,
      Award,
      Shield,
      Package,
      Truck,
      Heart,
      Zap,
      Check,
    };
    return iconMap[iconName] || Star;
  };

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

  useEffect(() => {
    if (id) {
      fetchProductBySlug(id);
      fetchCategories();
    }
  }, [id]);

  const fetchProductBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch product by slug using the single product endpoint
      const response = await fetch(`${API_BASE_URL}/products/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          throw new Error('Failed to fetch product');
        }
        return;
      }
      
      const result = await response.json();
      if (!result.success || !result.data || !result.data.product) {
        setError('Product not found');
        return;
      }
      
      const foundProduct = result.data.product;
      const relatedProducts = result.data.relatedProducts || [];
      
      setProduct(foundProduct);
      setRelatedProducts(relatedProducts);
      setCurrentImageIndex(0);
      setMainImageLoaded(false);
      setIsImageTransitioning(false);
      
      // Fetch reviews for this product
      fetchProductReviews(slug);
      
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      const categoriesData = data.success ? data.data : [];
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProductReviews = async (slug: string) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${slug}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const result = await response.json();
      if (result.success) {
        setReviews(result.data.reviews || []);
        setReviewStats(result.data.stats || null);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with better user feedback
    if (!reviewForm.customerName.trim()) {
      alert('Please enter your name.');
      return;
    }
    
    if (reviewForm.rating === 0) {
      alert('Please select a rating by clicking on the stars.');
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      alert('Please write your review comment.');
      return;
    }

    if (reviewForm.comment.trim().length < 10) {
      alert('Please write a more detailed review (at least 10 characters).');
      return;
    }

    try {
      setReviewSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: reviewForm.customerName.trim(),
          customerPhone: reviewForm.customerPhone.trim() || undefined,
          rating: reviewForm.rating,
          title: reviewForm.title.trim() || undefined,
          comment: reviewForm.comment.trim()
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setReviewSubmitSuccess(true);
        setReviewForm({
          customerName: '',
          customerPhone: '',
          rating: 0,
          title: '',
          comment: ''
        });
        
        // Refresh reviews to show the new review
        if (id) {
          fetchProductReviews(id);
        }
        
        // Hide form after 4 seconds to give user time to see success message
        setTimeout(() => {
          setShowReviewForm(false);
          setReviewSubmitSuccess(false);
        }, 4000);
      } else {
        alert(result.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please check your internet connection and try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  // WhatsApp function
    const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
    const message = `Hi! I'm interested in ${product?.name}. Can you provide more information?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Scorpio Product',
      text: `Check out this amazing product: ${product?.name}`,
      url: window.location.href
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Product shared using your device's native sharing.",
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        // Ultimate fallback: Show the URL
        toast({
          title: "Share this product",
          description: window.location.href,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold">Loading product...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
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
    categories.find((cat) => cat.slug === product.category)?.name || "Category";

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



              {/* Key Features */}
              <div className="space-y-2">
                <h3 className="font-semibold">Key Features:</h3>
                {product.keyFeatures && product.keyFeatures.length > 0 ? (
                  <ul className="text-muted-foreground space-y-1">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index}>• {feature.title}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Premium quality materials</li>
                    <li>• Expert craftsmanship</li>
                    <li>• Fast and secure delivery</li>
                    <li>• 30-day satisfaction guarantee</li>
                  </ul>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => openWhatsApp()}
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
                  onClick={handleShare}
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
                    {product.description}
                  </p>

                  <h4 className="text-xl font-semibold mb-4">Key Highlights</h4>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold">Premium Quality</h5>
                          <p className="text-muted-foreground text-sm">
                            Crafted with the finest materials and attention to detail
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
                            className={`w-5 h-5 ${
                              reviewStats && i < Math.round(reviewStats.averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">
                        {reviewStats?.averageRating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({reviewStats?.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviewStats?.ratingDistribution?.[rating] || 0;
                        const percentage = reviewStats?.totalReviews ? 
                          (count / reviewStats.totalReviews) * 100 : 0;
                        
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">
                              {rating}★
                            </span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Write a Review Button */}
                <div className="mb-8">
                  <Button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="w-full sm:w-auto"
                    disabled={reviewSubmitting}
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </Button>
                </div>

                {/* Customer Review Form */}
                {showReviewForm && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Write Your Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reviewSubmitSuccess ? (
                        <div className="text-center py-8">
                          <div className="text-green-600 text-2xl mb-4">
                            🎉
                          </div>
                          <div className="text-green-600 text-lg font-semibold mb-2">
                            Thank you for your review!
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Your review has been submitted successfully and will appear in the reviews section below.
                          </p>
                          <div className="text-sm text-muted-foreground">
                            This form will close automatically in a few seconds...
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                          {/* Rating */}
                          <div>
                            <Label className="text-base font-medium">
                              Rating <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleRatingClick(star)}
                                  className="focus:outline-none hover:scale-110 transition-transform"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      star <= reviewForm.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground hover:text-yellow-400'
                                    }`}
                                  />
                                </button>
                              ))}
                              {reviewForm.rating > 0 && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {reviewForm.rating} out of 5 stars
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Customer Name */}
                          <div>
                            <Label htmlFor="customerName" className="text-base font-medium">
                              Your Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="customerName"
                              type="text"
                              value={reviewForm.customerName}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, customerName: e.target.value }))}
                              placeholder="Enter your full name"
                              className="mt-1"
                              required
                            />
                          </div>

                          {/* Customer Phone (Optional) */}
                          <div>
                            <Label htmlFor="customerPhone" className="text-base font-medium">
                              Phone Number (Optional)
                            </Label>
                            <Input
                              id="customerPhone"
                              type="tel"
                              value={reviewForm.customerPhone}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                              placeholder="Enter your phone number"
                              className="mt-1"
                            />
                          </div>

                          {/* Review Title (Optional) */}
                          <div>
                            <Label htmlFor="reviewTitle" className="text-base font-medium">
                              Review Title (Optional)
                            </Label>
                            <Input
                              id="reviewTitle"
                              type="text"
                              value={reviewForm.title}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Brief title for your review"
                              className="mt-1"
                            />
                          </div>

                          {/* Review Comment */}
                          <div>
                            <Label htmlFor="reviewComment" className="text-base font-medium">
                              Your Review <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="reviewComment"
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              placeholder="Share your experience with this product..."
                              className="mt-1 min-h-[120px]"
                              required
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="flex gap-3">
                            <Button
                              type="submit"
                              disabled={reviewSubmitting}
                              className="flex-1 sm:flex-none"
                            >
                              {reviewSubmitting ? (
                                <>
                                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                  Submitting...
                                </>
                              ) : (
                                'Submit Review'
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowReviewForm(false)}
                              disabled={reviewSubmitting}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviewsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Loading reviews...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border border-border rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold">{review.customerName}</h5>
                              {review.isVerified && (
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
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Review Title */}
                        {review.title && (
                          <h6 className="font-medium mb-2">{review.title}</h6>
                        )}
                        
                        {/* Review Comment */}
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                        
                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {review.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={`Review image ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Admin Reply */}
                        {review.adminReply && (
                          <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-3 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                Scorpio Team
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {review.adminReplyDate && new Date(review.adminReplyDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-sm">{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
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
                        <span className="font-medium">
                          {product.specifications?.general?.brand || "Scorpio Premium"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU</span>
                        <span className="font-medium">
                          {product.specifications?.general?.sku || `SP-${product._id.slice(-4).toUpperCase()}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Warranty</span>
                        <span className="font-medium">
                          {product.specifications?.general?.warranty || "2 Years"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Availability
                        </span>
                        <span className="font-medium text-green-600">
                          {product.specifications?.general?.availability || "In Stock"}
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
                        <span className="font-medium">
                          {product.specifications?.details?.weight || "1.2 kg"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dimensions
                        </span>
                        <span className="font-medium">
                          {product.specifications?.details?.dimensions || "25 × 15 × 8 cm"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">
                          {product.specifications?.details?.material || "Premium Grade"}
                        </span>
                      </div>
                      {product.specifications?.details?.color && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Color</span>
                          <span className="font-medium">
                            {product.specifications.details.color}
                          </span>
                        </div>
                      )}
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
                        onClick={() => openWhatsApp()}
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
                  key={relatedProduct._id}
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
