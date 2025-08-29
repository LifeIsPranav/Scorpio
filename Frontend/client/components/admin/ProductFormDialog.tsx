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
    custom: false,
    customFields: [] as Array<{
      fieldName: string;
      fieldType: 'dropdown' | 'radio' | 'checkbox' | 'text';
      required: boolean;
      options: Array<{label: string; value: string; priceModifier: number}>;
      placeholder?: string;
    }>,
    images: [""],
    whatsappMessage: "",
    keyFeatures: [] as Array<{icon: string, title: string, description: string}>,
    specifications: {
      general: {
        brand: "",
        sku: "",
        warranty: "",
        availability: ""
      },
      details: {
        weight: "",
        dimensions: "",
        material: "",
        color: ""
      }
    }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (product) {
      // When editing, find the category ID from slug for form consistency
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
        custom: product.custom || false,
        customFields: product.customFields || [],
        images: product.images && product.images.length > 0 ? product.images : [""],
        whatsappMessage: product.whatsappMessage || "",
        keyFeatures: product.keyFeatures || [],
        specifications: {
          general: {
            brand: product.specifications?.general?.brand || "",
            sku: product.specifications?.general?.sku || "",
            warranty: product.specifications?.general?.warranty || "",
            availability: product.specifications?.general?.availability || ""
          },
          details: {
            weight: product.specifications?.details?.weight || "",
            dimensions: product.specifications?.details?.dimensions || "",
            material: product.specifications?.details?.material || "",
            color: product.specifications?.details?.color || ""
          }
        }
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        featured: false,
        premium: false,
        custom: false,
        customFields: [],
        images: [""],
        whatsappMessage: "",
        keyFeatures: [],
        specifications: {
          general: {
            brand: "",
            sku: "",
            warranty: "",
            availability: ""
          },
          details: {
            weight: "",
            dimensions: "",
            material: "",
            color: ""
          }
        }
      });
    }
    setErrors({});
  }, [product, open, categories]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      // Handle nested fields like "specifications.general.brand"
      const [parent, child, grandchild] = field.split('.');
      setFormData((prev) => {
        if (parent === 'specifications') {
          return {
            ...prev,
            specifications: {
              ...prev.specifications,
              [child]: {
                ...prev.specifications[child as 'general' | 'details'],
                [grandchild]: value
              }
            }
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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
      custom: formData.custom,
      customFields: formData.custom ? formData.customFields : [], // Only include customFields if custom is true
      images: validatedImages,
      whatsappMessage: formData.whatsappMessage?.trim() || '',
      tags: [],
      keyFeatures: formData.keyFeatures,
      specifications: formData.specifications
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

          {/* Key Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Key Features (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newFeatures = [...formData.keyFeatures];
                  newFeatures.push({ icon: "Star", title: "", description: "" });
                  handleInputChange("keyFeatures", newFeatures);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Feature
              </Button>
            </div>
            
            {formData.keyFeatures.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {formData.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Icon</Label>
                          <Select
                            value={feature.icon}
                            onValueChange={(value) => {
                              const newFeatures = [...formData.keyFeatures];
                              newFeatures[index] = { ...newFeatures[index], icon: value };
                              handleInputChange("keyFeatures", newFeatures);
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Star">⭐ Star</SelectItem>
                              <SelectItem value="Award">🏆 Award</SelectItem>
                              <SelectItem value="Shield">🛡️ Shield</SelectItem>
                              <SelectItem value="Package">📦 Package</SelectItem>
                              <SelectItem value="Truck">🚛 Truck</SelectItem>
                              <SelectItem value="Heart">❤️ Heart</SelectItem>
                              <SelectItem value="Zap">⚡ Zap</SelectItem>
                              <SelectItem value="Check">✅ Check</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Title</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => {
                              const newFeatures = [...formData.keyFeatures];
                              newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                              handleInputChange("keyFeatures", newFeatures);
                            }}
                            placeholder="Feature title"
                            className="h-8"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...formData.keyFeatures];
                            newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                            handleInputChange("keyFeatures", newFeatures);
                          }}
                          placeholder="Feature description"
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
                        handleInputChange("keyFeatures", newFeatures);
                      }}
                      className="mt-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {formData.keyFeatures.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No key features added. Click "Add Feature" to create product highlights.
              </p>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Product Specifications (Optional)</Label>
              <p className="text-sm text-muted-foreground">Add detailed specifications for this product. Leave blank to use default values.</p>
            </div>
            
            {/* General Specifications */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-600">General Information</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="brand" className="text-xs">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Scorpio Premium"
                    value={formData.specifications.general.brand}
                    onChange={(e) => handleInputChange("specifications.general.brand", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sku" className="text-xs">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="Auto-generated if empty"
                    value={formData.specifications.general.sku}
                    onChange={(e) => handleInputChange("specifications.general.sku", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="warranty" className="text-xs">Warranty</Label>
                  <Input
                    id="warranty"
                    placeholder="e.g., 2 Years"
                    value={formData.specifications.general.warranty}
                    onChange={(e) => handleInputChange("specifications.general.warranty", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="availability" className="text-xs">Availability</Label>
                  <Input
                    id="availability"
                    placeholder="e.g., In Stock"
                    value={formData.specifications.general.availability}
                    onChange={(e) => handleInputChange("specifications.general.availability", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Detail Specifications */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-green-600">Product Details</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="weight" className="text-xs">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 1.2 kg"
                    value={formData.specifications.details.weight}
                    onChange={(e) => handleInputChange("specifications.details.weight", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions" className="text-xs">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 25 × 15 × 8 cm"
                    value={formData.specifications.details.dimensions}
                    onChange={(e) => handleInputChange("specifications.details.dimensions", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="material" className="text-xs">Material</Label>
                  <Input
                    id="material"
                    placeholder="e.g., Premium Grade"
                    value={formData.specifications.details.material}
                    onChange={(e) => handleInputChange("specifications.details.material", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="color" className="text-xs">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Space Gray"
                    value={formData.specifications.details.color}
                    onChange={(e) => handleInputChange("specifications.details.color", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Featured, Premium, and Custom */}
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom"
                checked={formData.custom}
                onCheckedChange={(checked) =>
                  handleInputChange("custom", checked)
                }
              />
              <Label htmlFor="custom" className="cursor-pointer">
                Mark as custom product (with customizable options)
              </Label>
            </div>
          </div>

          {/* Custom Fields - Only show if custom is checked */}
          {formData.custom && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium text-foreground">
                    Custom Product Options
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add customizable fields that customers can choose from when ordering this product.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFields = [...formData.customFields];
                    newFields.push({
                      fieldName: "",
                      fieldType: "dropdown",
                      required: false,
                      options: [{ label: "", value: "", priceModifier: 0 }],
                      placeholder: ""
                    });
                    handleInputChange("customFields", newFields);
                  }}
                  className="border-border text-foreground hover:bg-muted"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Field
                </Button>
              </div>

              {formData.customFields.length > 0 && (
                <div className="space-y-4">
                  {formData.customFields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="border rounded-lg p-4 bg-card">
                      <div className="flex justify-between items-start mb-3">
                        <Label className="text-sm font-medium">Field {fieldIndex + 1}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newFields = formData.customFields.filter((_, i) => i !== fieldIndex);
                            handleInputChange("customFields", newFields);
                          }}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <Label className="text-xs">Field Name *</Label>
                          <Input
                            value={field.fieldName}
                            onChange={(e) => {
                              const newFields = [...formData.customFields];
                              newFields[fieldIndex] = { ...newFields[fieldIndex], fieldName: e.target.value };
                              handleInputChange("customFields", newFields);
                            }}
                            placeholder="e.g., T-Shirt Size"
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Field Type</Label>
                          <Select
                            value={field.fieldType}
                            onValueChange={(value: 'dropdown' | 'radio' | 'checkbox' | 'text') => {
                              const newFields = [...formData.customFields];
                              newFields[fieldIndex] = { ...newFields[fieldIndex], fieldType: value };
                              handleInputChange("customFields", newFields);
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                              <SelectItem value="radio">Radio Buttons</SelectItem>
                              <SelectItem value="checkbox">Checkboxes</SelectItem>
                              <SelectItem value="text">Text Input</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-4">
                          <Checkbox
                            id={`required-${fieldIndex}`}
                            checked={field.required}
                            onCheckedChange={(checked) => {
                              const newFields = [...formData.customFields];
                              newFields[fieldIndex] = { ...newFields[fieldIndex], required: !!checked };
                              handleInputChange("customFields", newFields);
                            }}
                          />
                          <Label htmlFor={`required-${fieldIndex}`} className="text-xs cursor-pointer">
                            Required
                          </Label>
                        </div>
                      </div>

                      {field.fieldType === 'text' && (
                        <div>
                          <Label className="text-xs">Placeholder Text</Label>
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) => {
                              const newFields = [...formData.customFields];
                              newFields[fieldIndex] = { ...newFields[fieldIndex], placeholder: e.target.value };
                              handleInputChange("customFields", newFields);
                            }}
                            placeholder="Enter placeholder text..."
                            className="h-8"
                          />
                        </div>
                      )}

                      {field.fieldType !== 'text' && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-xs">Options</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newFields = [...formData.customFields];
                                newFields[fieldIndex].options.push({ label: "", value: "", priceModifier: 0 });
                                handleInputChange("customFields", newFields);
                              }}
                              className="text-xs h-6 px-2"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Option
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {field.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2 items-center">
                                <div className="flex-1">
                                  <Input
                                    value={option.label}
                                    onChange={(e) => {
                                      const newFields = [...formData.customFields];
                                      newFields[fieldIndex].options[optionIndex] = {
                                        ...newFields[fieldIndex].options[optionIndex],
                                        label: e.target.value,
                                        value: e.target.value.toLowerCase().replace(/\s+/g, '-')
                                      };
                                      handleInputChange("customFields", newFields);
                                    }}
                                    placeholder="Option label"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="w-24">
                                  <Input
                                    type="number"
                                    value={option.priceModifier}
                                    onChange={(e) => {
                                      const newFields = [...formData.customFields];
                                      newFields[fieldIndex].options[optionIndex] = {
                                        ...newFields[fieldIndex].options[optionIndex],
                                        priceModifier: parseFloat(e.target.value) || 0
                                      };
                                      handleInputChange("customFields", newFields);
                                    }}
                                    placeholder="₹0"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                {field.options.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newFields = [...formData.customFields];
                                      newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
                                      handleInputChange("customFields", newFields);
                                    }}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.customFields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom fields added. Click "Add Field" to create customizable options for this product.
                </p>
              )}
            </div>
          )}

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
