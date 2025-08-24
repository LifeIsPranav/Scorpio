import ProductCard from "./ProductCard";
import { Filter } from "lucide-react";
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
  premium?: boolean;
  tags: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface ProductShowcaseProps {
  isHomepage?: boolean;
}

export default function ProductShowcase({ isHomepage = false }: ProductShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Different pagination logic for homepage vs products page
  const PRODUCTS_PER_PAGE = isHomepage ? 8 : 16;
  const MAX_HOMEPAGE_PRODUCTS = 16;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          publicApi.getProducts() as any,
          publicApi.getCategories() as any
        ]);

        if (productsResponse.success) {
          setProducts(productsResponse.data || []);
        }
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update displayed products when products or category changes
  useEffect(() => {
    const filteredProducts = selectedCategory === "all" 
      ? products 
      : products.filter(product => product.category === selectedCategory);

    if (isHomepage) {
      // Homepage: show first 8, then 16 total
      const productsToShow = Math.min(currentPage * PRODUCTS_PER_PAGE, MAX_HOMEPAGE_PRODUCTS);
      setDisplayedProducts(filteredProducts.slice(0, productsToShow));
    } else {
      // Products page: show 16 per page
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      setDisplayedProducts(filteredProducts.slice(0, endIndex));
    }
  }, [products, selectedCategory, currentPage, isHomepage]);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const allFilteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    
    // Scroll to new products on products page
    if (!isHomepage) {
      setTimeout(() => {
        const newProductsStart = document.querySelector(`[data-product-index="${displayedProducts.length}"]`);
        if (newProductsStart) {
          newProductsStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const canLoadMore = () => {
    if (isHomepage) {
      return displayedProducts.length < MAX_HOMEPAGE_PRODUCTS && displayedProducts.length < allFilteredProducts.length;
    } else {
      return displayedProducts.length < allFilteredProducts.length;
    }
  };

  const shouldShowAllProducts = () => {
    return isHomepage && displayedProducts.length >= MAX_HOMEPAGE_PRODUCTS && allFilteredProducts.length > MAX_HOMEPAGE_PRODUCTS;
  };

  const categoryButtons = [
    { id: "all", name: "All Products" },
    ...categories.map((cat) => ({ id: cat.slug, name: cat.name })),
  ];

  if (loading) {
    return (
      <section id="products" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our carefully curated collection of premium products. Each
            item is selected for quality, style, and value.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-between"
            >
              <span>Filter by Category</span>
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter buttons */}
          <div
            className={`flex flex-wrap gap-3 justify-center ${showFilters ? "block" : "hidden md:flex"}`}
          >
            {categoryButtons.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowFilters(false);
                }}
                className="rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedProducts.map((product, index) => (
            <div
              key={product._id}
              data-product-index={index}
              className="animate-fade-in"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No products message */}
        {displayedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}

        {/* Loading message */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Loading products...
            </p>
          </div>
        )}

        {/* Pagination buttons */}
        {displayedProducts.length > 0 && (
          <div className="text-center mt-16 space-y-4">
            {/* Products count info */}
            <div className="text-sm text-muted-foreground">
              Showing {displayedProducts.length} of {allFilteredProducts.length} products
              {selectedCategory !== "all" && ` in ${categoryButtons.find(c => c.id === selectedCategory)?.name}`}
            </div>
            
            {/* Load More Products button */}
            {canLoadMore() && (
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8"
                onClick={handleLoadMore}
              >
                Load More Products
                {isHomepage && ` (${Math.min(PRODUCTS_PER_PAGE, allFilteredProducts.length - displayedProducts.length)} more)`}
              </Button>
            )}
            
            {/* Show All Products button for homepage */}
            {shouldShowAllProducts() && (
              <div className="flex flex-col items-center space-y-4">
                <Link to="/products">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                  >
                    Show All Products
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  View all {allFilteredProducts.length} products in our complete catalog
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
