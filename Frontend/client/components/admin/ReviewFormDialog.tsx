import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminProductsApi, adminReviewsApi } from "@/lib/api";

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

interface Product {
  _id: string;
  name: string;
  images: string[];
}

interface ReviewFormData {
  productId: string;
  customerName: string;
  customerPhone: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerified: boolean;
  isVisible: boolean;
}

interface ReviewFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingReview?: any;
}

const initialFormData: ReviewFormData = {
  productId: '',
  customerName: '',
  customerPhone: '',
  rating: 5,
  title: '',
  comment: '',
  images: [],
  isVerified: true,
  isVisible: true,
};

export default function ReviewFormDialog({ open, onClose, onSave, editingReview }: ReviewFormDialogProps) {
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
      if (editingReview) {
        setFormData({
          productId: editingReview.productId?._id || editingReview.productId || '',
          customerName: editingReview.customerName || '',
          customerPhone: editingReview.customerPhone || '',
          rating: editingReview.rating || 5,
          title: editingReview.title || '',
          comment: editingReview.comment || '',
          images: editingReview.images || [],
          isVerified: editingReview.isVerified ?? true,
          isVisible: editingReview.isVisible ?? true,
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [open, editingReview]);

  const fetchProducts = async () => {
    try {
      const response = await adminProductsApi.getAll() as any;
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageUrl = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className={`p-1 rounded ${
              star <= formData.rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }`}
          >
            <Star className={`h-6 w-6 ${
              star <= formData.rating ? 'fill-current' : ''
            }`} />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {formData.rating} star{formData.rating !== 1 ? 's' : ''}
        </span>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      
      const reviewData = {
        ...formData,
        images: filteredImages,
      };

      if (editingReview) {
        await adminReviewsApi.update(editingReview._id, reviewData);
      } else {
        await adminReviewsApi.create(reviewData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Failed to save review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingReview ? 'Edit Review' : 'Add New Review'}
          </DialogTitle>
          <DialogDescription>
            {editingReview ? 'Update review details' : 'Add a new customer review to an existing product'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product for this review" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    <div className="flex items-center space-x-2">
                      {product.images?.[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            {renderStarRating()}
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Great product! Highly recommended"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Review Comment *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your detailed experience with this product..."
              rows={4}
              required
            />
          </div>

          {/* Review Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Review Images (URLs)</Label>
              <Button type="button" onClick={addImageUrl} variant="outline" size="sm">
                Add Image
              </Button>
            </div>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
            {formData.images.length === 0 && (
              <p className="text-sm text-muted-foreground">No review images added</p>
            )}
          </div>

          {/* Review Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Verification Status</Label>
              <Select
                value={formData.isVerified.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isVerified: value === 'true' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Verified Purchase</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={formData.isVisible.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isVisible: value === 'true' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Visible to Public</SelectItem>
                  <SelectItem value="false">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.productId || !formData.customerName || !formData.title || !formData.comment}>
              {loading ? 'Saving...' : editingReview ? 'Update Review' : 'Add Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
