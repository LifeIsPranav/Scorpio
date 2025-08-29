import { Calendar, FolderOpen, Hash, Image as ImageIcon, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryViewDialogProps {
  category: any;
  isOpen: boolean;
  onClose: () => void;
}

const CategoryViewDialog = ({ category, isOpen, onClose }: CategoryViewDialogProps) => {
  if (!category) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Category Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Category Image and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Image */}
            <Card>
              <CardContent className="p-4">
                <img
                  src={category.image || "/no-image.svg"}
                  alt={category.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Slug: {category.slug}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {category.productCount || 0} products
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium">Display Order</label>
                  <p className="text-lg font-semibold">
                    {category.order || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>

          {/* Category Image Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <p className="text-xs text-muted-foreground break-all mt-1 p-2 bg-muted rounded">
                  {category.image || 'No image specified'}
                </p>
              </div>

              {category.image && (
                <div>
                  <label className="text-sm font-medium">Image Preview</label>
                  <div className="mt-2 p-2 bg-muted rounded">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="max-w-full h-auto max-h-32 object-contain rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/no-image.svg";
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{category.productCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{category.order || 0}</p>
                  <p className="text-sm text-muted-foreground">Display Order</p>
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
                  <label className="text-sm font-medium">Category ID</label>
                  <p className="text-xs text-muted-foreground font-mono break-all mt-1 p-2 bg-muted rounded">
                    {category._id}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(category.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(category.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URL and SEO Information */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & URL Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category URL Slug</label>
                <p className="text-sm text-muted-foreground font-mono mt-1 p-2 bg-muted rounded">
                  /categories/{category.slug}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">SEO-Friendly Name</label>
                <p className="text-sm text-muted-foreground">
                  {category.name} - Clean, URL-safe identifier: {category.slug}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryViewDialog;
