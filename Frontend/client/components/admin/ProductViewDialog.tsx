import { Calendar, DollarSign, Layers, Package, Star, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductViewDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProductViewDialog = ({ product, isOpen, onClose }: ProductViewDialogProps) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <img
                  src={product.images?.[0] || "/no-image.svg"}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
            
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1, 4).map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    SKU: {product.sku}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {product.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing & Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <p className="text-lg font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Compare Price</label>
                    <p className="text-sm text-muted-foreground">
                      {product.comparePrice ? formatPrice(product.comparePrice) : 'N/A'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {product.stockQuantity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Low Stock Threshold</label>
                    <p className="text-sm text-muted-foreground">
                      {product.lowStockThreshold}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Weight</label>
                    <p className="text-sm text-muted-foreground">
                      {product.weight ? `${product.weight} ${product.weightUnit || 'lbs'}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dimensions</label>
                    <p className="text-sm text-muted-foreground">
                      {product.dimensions?.length && product.dimensions?.width && product.dimensions?.height
                        ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensionUnit || 'in'}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Features</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Average Rating</label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {product.averageRating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Review Count</label>
                    <p className="text-sm text-muted-foreground">
                      {product.reviewCount || 0} reviews
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">View Count</label>
                    <p className="text-sm text-muted-foreground">
                      {product.viewCount || 0} views
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sales Count</label>
                    <p className="text-sm text-muted-foreground">
                      {product.salesCount || 0} sold
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Meta Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">SEO</label>
                  <div className="space-y-2 mt-2">
                    <p className="text-xs">
                      <span className="font-medium">Meta Title:</span> {product.seo?.metaTitle || 'N/A'}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Meta Description:</span> {product.seo?.metaDescription || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewDialog;
