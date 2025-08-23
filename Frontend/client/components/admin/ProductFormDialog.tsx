import { ImageIcon, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  categories: Category[];
  onSubmit: (data: any) => void;
}

export default function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    premium: false,
    images: [""],
    whatsappMessage: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (product) {
      // When editing, find category ID from slug
      const categoryFromSlug = categories.find(cat => cat.slug === product.category);
      const categoryId = categoryFromSlug ? categoryFromSlug._id : product.category;
      
      // Extract numeric price from formatted price
      const numericPrice = product.priceNumeric ? 
        product.priceNumeric.toString() : 
        product.price?.replace(/[^\d]/g, '') || "";

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: numericPrice,
        category: categoryId,
        featured: product.featured || false,
        premium: product.premium || false,
        images: product.images && product.images.length > 0 ? product.images : [""],
        whatsappMessage: product.whatsappMessage || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        featured: false,
        premium: false,
        images: [""],
        whatsappMessage: "",
      });
    }
    setErrors({});
  }, [product, open, categories]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    const validImages = formData.images.filter((img) => img.trim() && img.startsWith('http'));
    if (validImages.length === 0) {
      newErrors.images = "At least one valid image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform data to match backend schema
    const priceNumeric = parseFloat(formData.price.replace(/[^\d.]/g, '')) || 0;
    const formattedPrice = `₹${priceNumeric.toLocaleString('en-IN')}`;
    
    // Find category slug by ID
    const selectedCategory = categories.find(cat => cat._id === formData.category);
    const categorySlug = selectedCategory ? selectedCategory.slug : formData.category;

    // Generate slug for the product
    const productSlug = product ? product.slug : generateSlug(formData.name);

    // Validate images - check for valid URLs and add image extension if missing
    const validateAndFixImageUrl = (url: string): string => {
      if (!url.startsWith('http')) return '';
      
      // If it's an Unsplash URL without extension, add .jpg at the end
      if (url.includes('images.unsplash.com') && !url.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
        // Check if it already has query parameters
        if (url.includes('?')) {
          return url + '&fm=jpg';
        } else {
          return url + '?fm=jpg';
        }
      }
      
      // For other URLs, if they don't have an extension, try to add one
      if (!url.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
        // If it has query parameters, add extension before them
        if (url.includes('?')) {
          const [baseUrl, queryString] = url.split('?');
          return `${baseUrl}.jpg?${queryString}`;
        } else {
          return `${url}.jpg`;
        }
      }
      
      return url;
    };

    const validatedImages = formData.images
      .map(img => validateAndFixImageUrl(img.trim()))
      .filter(img => img);

    if (validatedImages.length === 0) {
      alert('Please provide at least one valid image URL');
      return;
    }

    console.log('Validated images:', validatedImages); // Debug log

    const submitData = {
      name: formData.name.trim(),
      slug: productSlug,
      description: formData.description.trim(),
      price: formattedPrice,
      priceNumeric: priceNumeric,
      category: categorySlug,
      featured: formData.featured,
      premium: formData.premium,
      images: validatedImages,
      whatsappMessage: formData.whatsappMessage?.trim() || '',
      tags: []
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : "Fill in the details to add a new product to your store."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name..."
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="₹0"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images *</Label>
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL..."
                      className={errors.images ? "border-red-500" : ""}
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImageField(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  {image && (
                    <div className="w-12 h-12 rounded-lg border overflow-hidden">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageField}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Image
              </Button>
            </div>
            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}
          </div>

          {/* WhatsApp Message */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Message (Optional)</Label>
            <Textarea
              id="whatsapp"
              value={formData.whatsappMessage}
              onChange={(e) =>
                handleInputChange("whatsappMessage", e.target.value)
              }
              placeholder="Custom message for WhatsApp inquiries..."
              rows={2}
            />
          </div>

          {/* Featured and Premium */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  handleInputChange("featured", checked)
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Mark as featured product
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium"
                checked={formData.premium}
                onCheckedChange={(checked) =>
                  handleInputChange("premium", checked)
                }
              />
              <Label htmlFor="premium" className="cursor-pointer">
                Add to premium collection
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
            >
              {product ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
