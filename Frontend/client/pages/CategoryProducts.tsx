import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
  whatsappMessage?: string;
}

export default function CategoryProducts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "default" | "price-low" | "price-high" | "name"
  >("default");
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) {
        navigate("/categories");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all categories to find the one matching the slug
        const categoriesResponse = await publicApi.getCategories() as any;
        if (categoriesResponse.success) {
          const foundCategory = categoriesResponse.data.find((c: Category) => c.slug === categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
            
            // Fetch products for this category using the specific endpoint
            const productsResponse = await publicApi.getCategoryProducts(foundCategory.slug) as any;
            if (productsResponse.success && productsResponse.data) {
              const products = productsResponse.data.products || [];
              setCategoryProducts(Array.isArray(products) ? products : []);
            }
          } else {
            console.log(`Category '${categoryId}' not found, redirecting to categories`);
            navigate("/categories");
          }
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId, navigate]);

  // Sort products
  const sortedProducts = Array.isArray(categoryProducts) ? [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          parseFloat(a.price.replace(/[^\d.-]/g, "")) -
          parseFloat(b.price.replace(/[^\d.-]/g, ""))
        );
      case "price-high":
        return (
          parseFloat(b.price.replace(/[^\d.-]/g, "")) -
          parseFloat(a.price.replace(/[^\d.-]/g, ""))
        );
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The category "{categoryId}" does not exist.
          </p>
          <Button onClick={() => navigate("/categories")}>
            Browse All Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              Home
            </Button>
            <span>/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/categories")}
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              Categories
            </Button>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </div>

          {/* Category Header */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {category.name}
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-4">
                {category.description}
              </p>
              <Badge variant="secondary" className="text-sm">
                {categoryProducts.length}{" "}
                {categoryProducts.length === 1 ? "Product" : "Products"}
              </Badge>
            </div>

            {/* Category Image */}
            <div className="w-full lg:w-80 h-60 rounded-2xl overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products in this category at the moment.
              </p>
              <Button onClick={() => navigate("/products")}>
                Browse All Products
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "flex flex-col gap-6"
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
