import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { products, categories } from "@/lib/data";

const stats = [
  {
    title: "Total Products",
    value: products.length.toString(),
    description: "Active products in store",
    icon: Package,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Categories",
    value: categories.length.toString(),
    description: "Product categories",
    icon: FolderOpen,
    trend: "+2%",
    trendUp: true,
  },
  {
    title: "Orders",
    value: "24",
    description: "This month",
    icon: ShoppingCart,
    trend: "+18%",
    trendUp: true,
  },
  {
    title: "Customers",
    value: "156",
    description: "Total registered",
    icon: Users,
    trend: "+8%",
    trendUp: true,
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    product: "Premium Wireless Headphones",
    amount: "₹12,999",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    product: "Smart Watch Series X",
    amount: "₹24,999",
    status: "processing",
    date: "4 hours ago",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    product: "Designer Leather Jacket",
    amount: "₹8,999",
    status: "shipped",
    date: "1 day ago",
  },
  {
    id: "#ORD-004",
    customer: "Sarah Wilson",
    product: "Yoga Mat Pro",
    amount: "₹2,999",
    status: "pending",
    date: "1 day ago",
  },
];

const topProducts = products.slice(0, 3).map((product, index) => ({
  ...product,
  rank: index + 1,
  sales: Math.floor(Math.random() * 50) + 10,
  revenue: `₹${(Math.floor(Math.random() * 100) + 50).toLocaleString()}K`,
}));

export default function AdminDashboard() {
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

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's what's happening in your store today
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                  <span>{stat.description}</span>
                  <div className="flex items-center">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        stat.trendUp ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
            <CardDescription>
              Latest customer orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.product}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Eye className="w-4 h-4 mr-2" />
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Top Performing Products</span>
            </CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className="w-8 h-8 flex items-center justify-center rounded-full"
                    >
                      #{product.rank}
                    </Badge>
                  </div>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{product.revenue}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      <span>95%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-24 flex-col space-y-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900">
              <Package className="w-6 h-6" />
              <span>Add New Product</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FolderOpen className="w-6 h-6" />
              <span>Create Category</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <DollarSign className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
