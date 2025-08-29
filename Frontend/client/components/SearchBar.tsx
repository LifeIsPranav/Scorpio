import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SearchResult {
  products: Array<{
    _id: string;
    name: string;
    price: string;
    images: string[];
    category: string;
    featured: boolean;
    premium?: boolean;
  }>;
  categories: Array<{
    _id: string;
    name: string;
    description: string;
    image: string;
    slug: string;
  }>;
  query: string;
  totalResults: number;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  initialQuery = "", 
  placeholder = "Search products...",
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search with debouncing
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await publicApi.searchProducts(query) as any;
          if (response.success) {
            setResults(response.data);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setResults(null);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults(null);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setShowResults(false);
    }
  };

  const handleProductClick = (product: any) => {
    navigate(`/products/${product._id}`);
    setShowResults(false);
    setQuery("");
  };

  const handleCategoryClick = (category: any) => {
    navigate(`/category/${category.slug}`);
    setShowResults(false);
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-md", className)} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 h-4 w-4 group-focus-within:text-primary transition-colors z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-10 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 rounded-full bg-background/50 backdrop-blur-sm transition-all duration-200 group-focus-within:shadow-md"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-xl border-muted-foreground/10 bg-background/95 backdrop-blur-md">
          <div className="p-4">
            {results.totalResults === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No results found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Categories */}
                {results.categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Categories</h3>
                    <div className="space-y-1">
                      {results.categories.map((category) => (
                        <div
                          key={category._id}
                          onClick={() => handleCategoryClick(category)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <div className="w-3 h-3 rounded bg-primary/60"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{category.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {results.products.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Products</h3>
                    <div className="space-y-1">
                      {results.products.slice(0, 4).map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Search className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              {product.featured && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Featured</Badge>
                              )}
                              {product.premium && (
                                <Badge variant="default" className="text-xs px-1.5 py-0.5">Premium</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-primary">{product.price}</p>
                              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View all results */}
                {results.totalResults > 4 && (
                  <div className="pt-3 border-t border-muted">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(results.query)}`);
                        setShowResults(false);
                      }}
                      className="w-full h-8 text-sm hover:bg-primary/10 transition-colors"
                    >
                      View all {results.totalResults} results
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Loading indicator */}
      {isSearching && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-background/95 backdrop-blur-md border-muted-foreground/10">
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
          </div>
        </Card>
      )}
    </div>
  );
}
