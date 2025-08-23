import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminOrdersApi, adminProductsApi } from "@/lib/api";

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
  price: string;
  priceNumeric: number;
  images: string[];
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
  };
  items: OrderItem[];
  paymentMethod: 'cod' | 'online' | 'upi';
  notes: string;
}

interface OrderFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingOrder?: any;
}

const initialFormData: OrderFormData = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  },
  items: [],
  paymentMethod: 'cod',
  notes: '',
};

export default function OrderFormDialog({ open, onClose, onSave, editingOrder }: OrderFormDialogProps) {
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
      if (editingOrder) {
        // Populate form with editing order data
        setFormData({
          customerName: editingOrder.customerName || '',
          customerPhone: editingOrder.customerPhone || '',
          customerEmail: editingOrder.customerEmail || '',
          shippingAddress: {
            street: editingOrder.shippingAddress?.street || '',
            city: editingOrder.shippingAddress?.city || '',
            state: editingOrder.shippingAddress?.state || '',
            pincode: editingOrder.shippingAddress?.pincode || '',
            landmark: editingOrder.shippingAddress?.landmark || '',
          },
          items: editingOrder.items || [],
          paymentMethod: editingOrder.paymentMethod || 'cod',
          notes: editingOrder.notes || '',
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [open, editingOrder]);

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

  const addItem = () => {
    if (products.length === 0) return;
    
    const firstProduct = products[0];
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: firstProduct._id,
        productName: firstProduct.name,
        price: firstProduct.priceNumeric,
        quantity: 1,
      }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          if (field === 'productId') {
            const product = products.find(p => p._id === value);
            return {
              ...item,
              productId: value,
              productName: product?.name || '',
              price: product?.priceNumeric || 0,
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate total amount
      const totalAmount = calculateTotal();
      
      // Generate order number if creating new order
      const orderNumber = editingOrder?.orderNumber || `ORD-${Date.now()}`;

      const orderData = {
        ...formData,
        orderNumber,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
      };

      if (editingOrder) {
        await adminOrdersApi.update(editingOrder._id, orderData);
      } else {
        await adminOrdersApi.create(orderData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? 'Edit Order' : 'Create New Order'}
          </DialogTitle>
          <DialogDescription>
            {editingOrder ? 'Update order details' : 'Add a new order to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
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
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.shippingAddress.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.shippingAddress.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.shippingAddress.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  value={formData.shippingAddress.pincode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.shippingAddress, pincode: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.shippingAddress.landmark}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.shippingAddress, landmark: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            {formData.items.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No items added yet</p>
            ) : (
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button 
                        type="button" 
                        onClick={() => removeItem(index)} 
                        variant="ghost" 
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label>Product *</Label>
                        <Select
                          value={item.productId}
                          onValueChange={(value) => updateItem(index, 'productId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product._id} value={product._id}>
                                {product.name} - {product.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Quantity *</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                            variant="outline"
                            size="sm"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-20 text-center"
                          />
                          <Button
                            type="button"
                            onClick={() => updateItem(index, 'quantity', item.quantity + 1)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Input
                          value={item.size || ''}
                          onChange={(e) => updateItem(index, 'size', e.target.value)}
                          placeholder="e.g., M, L, XL"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          value={item.color || ''}
                          onChange={(e) => updateItem(index, 'color', e.target.value)}
                          placeholder="e.g., Red, Blue"
                        />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary">
                        Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {formData.items.length > 0 && (
              <div className="text-right">
                <div className="text-lg font-semibold">
                  Total: ₹{calculateTotal().toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value: 'cod' | 'online' | 'upi') => setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes for this order..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || formData.items.length === 0}>
              {loading ? 'Saving...' : editingOrder ? 'Update Order' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
