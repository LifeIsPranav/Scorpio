import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { publicApi } from "@/lib/api";

interface SearchResult {
  products: Array<{
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

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query.trim().length >= 2) {
      performSearch(query);
    } else {
      setResults(null);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await publicApi.searchProducts(searchQuery, 50) as any;
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setSearchParams(prev => {
      if (newQuery) {
        prev.set('q', newQuery);
      } else {
        prev.delete('q');
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Search Results
            </h1>
            
            {/* Search Bar */}
            <SearchBar
              initialQuery={query}
              onSearch={handleSearch}
              placeholder="Search products, categories..."
              className="max-w-2xl"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-lg">Searching...</span>
            </div>
          )}

          {/* No Query */}
          {!query && !loading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Start Searching</h2>
              <p className="text-muted-foreground">
                Enter a search term to find products and categories
              </p>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div>
              {/* Results Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  {results.totalResults} result{results.totalResults !== 1 ? 's' : ''} for "{results.query}"
                </h2>
                {results.totalResults > 0 && (
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {results.products.length > 0 && (
                      <span>{results.products.length} product{results.products.length !== 1 ? 's' : ''}</span>
                    )}
                    {results.categories.length > 0 && (
                      <span>{results.categories.length} categor{results.categories.length !== 1 ? 'ies' : 'y'}</span>
                    )}
                  </div>
                )}
              </div>

              {/* No Results */}
              {results.totalResults === 0 && (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or browse our categories
                  </p>
                  <Link to="/categories">
                    <Button variant="outline">Browse Categories</Button>
                  </Link>
                </div>
              )}

              {/* Categories Results */}
              {results.categories.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6">Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.categories.map((category) => (
                      <Link key={category._id} to={`/category/${category.slug}`}>
                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Search className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{category.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results */}
              {results.products.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Query too short */}
          {query && query.length < 2 && !loading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Search term too short</h2>
              <p className="text-muted-foreground">
                Please enter at least 2 characters to search
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
