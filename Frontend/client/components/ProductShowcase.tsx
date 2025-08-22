import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { products, categories } from "@/lib/data";
import { Filter } from "lucide-react";

export default function ProductShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const categoryButtons = [
    { id: "all", name: "All Products" },
    ...categories.map((cat) => ({ id: cat.id, name: cat.name })),
  ];

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
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}

        {/* Load more button (placeholder for future pagination) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
