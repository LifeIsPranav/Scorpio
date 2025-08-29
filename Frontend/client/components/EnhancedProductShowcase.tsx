import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import { Filter, Grid, List, SortAsc, SortDesc, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";

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

interface Filters {
  categories: string[];
  featured: boolean;
  premium: boolean;
  custom: boolean;
  priceRange: [number, number];
}

export default function EnhancedProductShowcase({ isHomepage = false }: ProductShowcaseProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Core state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    featured: false,
    premium: false,
    custom: false,
    priceRange: [0, 10000]
  });
  
  // Get initial values from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  
  // Different pagination logic for homepage vs products page
  const PRODUCTS_PER_PAGE = isHomepage ? 8 : 16;
  const MAX_HOMEPAGE_PRODUCTS = 20;

  // Price range for slider
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          publicApi.getProducts() as any,
          publicApi.getCategories() as any
        ]);

        if (productsResponse.success) {
          const productsData = productsResponse.data || [];
          setProducts(productsData);
          
          // Set price range based on products
          const prices = productsData.map((p: Product) => p.priceNumeric).filter(Boolean);
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
            setFilters(prev => ({ ...prev, priceRange: [Math.floor(minPrice), Math.ceil(maxPrice)] }));
          }
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

  // Handle search from URL or search bar
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Handle category filter from URL
  useEffect(() => {
    if (categoryFilter) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryFilter]
      }));
    }
  }, [categoryFilter]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await publicApi.searchProducts(query, 100) as any;
      if (response.success) {
        setSearchResults(response.data.products || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Get filtered and sorted products
  const getFilteredProducts = () => {
    let baseProducts = isSearching || searchQuery ? searchResults : products;

    // Apply filters
    let filtered = baseProducts.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Feature filters
      if (filters.featured && !product.featured) return false;
      if (filters.premium && !product.premium) return false;
      if (filters.custom && !product.custom) return false;
      
      // Price range filter
      if (product.priceNumeric && (product.priceNumeric < filters.priceRange[0] || product.priceNumeric > filters.priceRange[1])) {
        return false;
      }
      
      return true;
    });

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.priceNumeric - b.priceNumeric;
        case "price-high":
          return b.priceNumeric - a.priceNumeric;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Paginate products
  const getPaginatedProducts = () => {
    if (isHomepage) {
      const productsToShow = Math.min(currentPage * PRODUCTS_PER_PAGE, MAX_HOMEPAGE_PRODUCTS);
      return filteredProducts.slice(0, productsToShow);
    } else {
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      return filteredProducts.slice(startIndex, endIndex);
    }
  };

  const displayedProducts = getPaginatedProducts();
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const hasMore = isHomepage 
    ? (currentPage * PRODUCTS_PER_PAGE < MAX_HOMEPAGE_PRODUCTS && currentPage * PRODUCTS_PER_PAGE < filteredProducts.length)
    : currentPage < totalPages;

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      featured: false,
      premium: false,
      custom: false,
      priceRange: priceRange
    });
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.featured) count++;
    if (filters.premium) count++;
    if (filters.custom) count++;
    if (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className={cn(isHomepage ? "py-24 bg-background" : "py-8 bg-muted/30")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={cn("text-center", isHomepage ? "mb-16" : "mb-8")}>
          <h2 className={cn(
            "font-bold text-foreground mb-6",
            isHomepage ? "text-4xl md:text-5xl" : "text-4xl lg:text-5xl"
          )}>
            {isHomepage ? "Our Products" : "All Products"}
          </h2>
          {isHomepage ? (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our curated collection of premium products, carefully selected to meet your needs and exceed your expectations.
            </p>
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of premium products
            </p>
          )}
        </div>

        {/* Search Bar - Only show on products page */}
        {!isHomepage && (
          <div className="mb-8">
            <SearchBar
              initialQuery={searchQuery}
              onSearch={(query) => {
                setSearchParams(prev => {
                  if (query) {
                    prev.set('search', query);
                  } else {
                    prev.delete('search');
                  }
                  return prev;
                });
              }}
              placeholder="Search products..."
              className="max-w-2xl mx-auto"
            />
          </div>
        )}

        {/* Filters and Controls - Only show on products page */}
        {!isHomepage && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Filter Button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Categories */}
                    <div>
                      <Label className="text-sm font-medium">Categories</Label>
                      <div className="space-y-2 mt-2">
                        {categories.map((category) => (
                          <div key={category._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.slug}
                              checked={filters.categories.includes(category.slug)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange('categories', [...filters.categories, category.slug]);
                                } else {
                                  handleFilterChange('categories', filters.categories.filter(c => c !== category.slug));
                                }
                              }}
                            />
                            <Label htmlFor={category.slug} className="text-sm">
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Types */}
                    <div>
                      <Label className="text-sm font-medium">Product Types</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={filters.featured}
                            onCheckedChange={(checked) => handleFilterChange('featured', checked)}
                          />
                          <Label htmlFor="featured" className="text-sm">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="premium"
                            checked={filters.premium}
                            onCheckedChange={(checked) => handleFilterChange('premium', checked)}
                          />
                          <Label htmlFor="premium" className="text-sm">Premium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="custom"
                            checked={filters.custom}
                            onCheckedChange={(checked) => handleFilterChange('custom', checked)}
                          />
                          <Label htmlFor="custom" className="text-sm">Custom</Label>
                        </div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium">
                        Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                      </Label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                        max={priceRange[1]}
                        min={priceRange[0]}
                        step={100}
                        className="mt-2"
                      />
                    </div>

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                      <Button variant="outline" onClick={clearFilters} className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {/* Results count */}
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </span>

              {/* View mode toggle */}
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters - Only show on products page */}
        {!isHomepage && activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.categories.map(categorySlug => {
              const category = categories.find(c => c.slug === categorySlug);
              return category ? (
                <Badge key={categorySlug} variant="secondary" className="gap-1">
                  {category.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('categories', filters.categories.filter(c => c !== categorySlug))}
                  />
                </Badge>
              ) : null;
            })}
            {filters.featured && (
              <Badge variant="secondary" className="gap-1">
                Featured
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('featured', false)} />
              </Badge>
            )}
            {filters.premium && (
              <Badge variant="secondary" className="gap-1">
                Premium
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('premium', false)} />
              </Badge>
            )}
            {filters.custom && (
              <Badge variant="secondary" className="gap-1">
                Custom
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('custom', false)} />
              </Badge>
            )}
          </div>
        )}

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {displayedProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
              />
            ))}
          </div>
        )}

        {/* Load More / Pagination */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button onClick={handleLoadMore} size="lg" variant="outline">
              {isHomepage ? "Load More Products" : "Load More"}
            </Button>
          </div>
        )}

        {!isHomepage && !hasMore && displayedProducts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Showing all {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* View All Products Button (Homepage only) - Show when reached max products or no more to load */}
        {isHomepage && (!hasMore || displayedProducts.length >= MAX_HOMEPAGE_PRODUCTS) && (
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
