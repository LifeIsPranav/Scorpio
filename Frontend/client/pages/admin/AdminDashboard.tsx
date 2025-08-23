import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminCategoriesApi, adminOrdersApi, adminProductsApi, adminReviewsApi } from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Star,
  DollarSign,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  products: any[];
  categories: any[];
  orders: any[];
  reviews: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    products: [],
    categories: [],
    orders: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [productsRes, categoriesRes, ordersRes, reviewsRes] = await Promise.all([
        adminProductsApi.getAll(),
        adminCategoriesApi.getAll(),
        adminOrdersApi.getAll(),
        adminReviewsApi.getAll(),
      ]);

      // Debug: Log API responses to understand structure
      console.log('Dashboard API Responses:', {
        productsRes,
        categoriesRes,
        ordersRes,
        reviewsRes
      });

      // Extract data from API responses (they come wrapped in { success: true, data: [...] })
      const products = Array.isArray((productsRes as any)?.data) ? (productsRes as any).data : 
                      Array.isArray(productsRes) ? productsRes : [];
      const categories = Array.isArray((categoriesRes as any)?.data) ? (categoriesRes as any).data : 
                        Array.isArray(categoriesRes) ? categoriesRes : [];
      const orders = Array.isArray((ordersRes as any)?.data) ? (ordersRes as any).data : 
                    Array.isArray(ordersRes) ? ordersRes : [];
      const reviews = Array.isArray((reviewsRes as any)?.data) ? (reviewsRes as any).data : 
                     Array.isArray(reviewsRes) ? reviewsRes : [];

      console.log('Extracted data:', { products, categories, orders, reviews });

      // Calculate revenue from orders
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        return sum + (order.totalAmount || 0);
      }, 0);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalRevenue,
        products,
        categories,
        orders,
        reviews,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "Total Products",
      value: loading ? "..." : stats.totalProducts.toString(),
      description: "Active products in catalog",
      icon: Package,
      trend: { value: "+12%", isPositive: true },
    },
    {
      title: "Categories",
      value: loading ? "..." : stats.totalCategories.toString(),
      description: "Product categories",
      icon: FolderOpen,
      trend: { value: "+3%", isPositive: true },
    },
    {
      title: "Total Orders",
      value: loading ? "..." : stats.totalOrders.toString(),
      description: "All time orders",
      icon: ShoppingCart,
      trend: { value: "+18%", isPositive: true },
    },
    {
      title: "Revenue",
      value: loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`,
      description: "Total revenue",
      icon: DollarSign,
      trend: { value: "+8%", isPositive: true },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Get recent orders (last 5)
  const recentOrders = stats.orders.slice(-5).reverse();

  // Get top products by popularity (with reviews)
  const topProducts = stats.products
    .map(product => {
      const productReviews = stats.reviews.filter(review => review.productId === product._id);
      const avgRating = productReviews.length > 0 
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
        : 0;
      return {
        ...product,
        reviewCount: productReviews.length,
        avgRating: avgRating.toFixed(1),
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 3);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your store.
          </p>
        </div>
        <Button onClick={fetchDashboardData} disabled={loading} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-xs ${
                      stat.trend.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.trend.value}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">
                        ₹{order.totalAmount?.toLocaleString() || 0}
                      </p>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(order.status || 'pending')}
                      >
                        {order.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Most reviewed products</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products yet
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {product.avgRating || 0}
                        </div>
                        <span>({product.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {product.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Add Product</h3>
              <p className="text-sm text-muted-foreground">
                Create new products
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Manage Categories</h3>
              <p className="text-sm text-muted-foreground">
                Organize your products
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">View Orders</h3>
              <p className="text-sm text-muted-foreground">
                Manage customer orders
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Customer feedback
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
