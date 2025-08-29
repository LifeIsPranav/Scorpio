import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyticsApi } from "@/lib/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Eye,
  RefreshCw,
  Download,
  Calendar,
  Star
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalReviews: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
    revenueGrowth: number;
  };
  charts: {
    orderStatus: Array<{ _id: string; count: number }>;
    categoryPerformance: Array<{ _id: string; productCount: number; avgPrice: number; avgRating: number }>;
    reviewDistribution: Array<{ _id: number; count: number }>;
    monthlyGrowth: Array<{ _id: { year: number; month: number }; revenue: number; orders: number }>;
    dailyTrends: Array<{ _id: { year: number; month: number; day: number }; orders: number; revenue: number }>;
  };
  tables: {
    topProducts: Array<{
      _id: string;
      name: string;
      price: number;
      reviewCount: number;
      averageRating: number;
      images: string;
    }>;
    recentOrders: Array<{
      _id: string;
      orderNumber: string;
      totalAmount: number;
      status: string;
      createdAt: string;
      customerInfo: { name: string; email: string };
    }>;
  };
  period: string;
}

interface SalesData {
  dailySales: Array<{
    _id: { year: number; month: number; day: number };
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }>;
  productSales: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  period: string;
}

interface CustomerData {
  topCustomers: Array<{
    _id: string;
    customerName: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
  }>;
  newCustomers: number;
  retentionData: Array<{
    _id: number;
    customers: number;
  }>;
  period: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await analyticsApi.getDashboard(period) as { success: boolean; data: AnalyticsData };
      if (response.success) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await analyticsApi.getSales(period) as { success: boolean; data: SalesData };
      if (response.success) {
        setSalesData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await analyticsApi.getCustomers(period) as { success: boolean; data: CustomerData };
      if (response.success) {
        setCustomerData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    if (activeTab === 'sales') {
      fetchSalesData();
    } else if (activeTab === 'customers') {
      fetchCustomerData();
    }
  }, [period, activeTab]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const prepareChartData = (data: any[], type: string) => {
    if (type === 'daily') {
      return data.map(item => ({
        date: `${item._id.month}/${item._id.day}`,
        revenue: item.revenue,
        orders: item.orders
      }));
    } else if (type === 'monthly') {
      return data.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        revenue: item.revenue,
        orders: item.orders
      }));
    }
    return data;
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your store's performance and growth
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {analyticsData && (
            <>
              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analyticsData.overview.totalRevenue)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {analyticsData.overview.revenueGrowth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={analyticsData.overview.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                        {Math.abs(analyticsData.overview.revenueGrowth)}%
                      </span>
                      <span>from last period</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(analyticsData.overview.averageOrderValue)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.overview.totalCategories} categories
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.overview.totalReviews} reviews
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.charts.orderStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analyticsData.charts.orderStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Order Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={prepareChartData(analyticsData.charts.dailyTrends, 'daily')}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="orders" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Tables Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best performing products by reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.tables.topProducts.slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center space-x-4">
                          <img
                            src={product.images || '/placeholder.svg'}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {formatCurrency(product.price)}
                              </span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-current text-yellow-400" />
                                <span className="text-xs ml-1">{product.averageRating?.toFixed(1) || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">{product.reviewCount}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.tables.recentOrders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customerInfo.name} • {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(order.totalAmount)}</p>
                            <Badge variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'pending' ? 'secondary' :
                              order.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {salesData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Revenue and order trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={prepareChartData(salesData.dailySales, 'daily')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="right" dataKey="orders" fill="#8884d8" name="Orders" />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Products ranked by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.productSales.map((product, index) => (
                      <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.totalSold} sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {customerData && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>New Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{customerData.newCustomers}</div>
                    <p className="text-sm text-muted-foreground">in selected period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={customerData.retentionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" label={{ value: 'Orders', position: 'insideBottom', offset: -5 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="customers" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customerData.topCustomers.slice(0, 3).map((customer, index) => (
                        <div key={customer._id} className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{customer.customerName}</p>
                            <p className="text-xs text-muted-foreground">{customer.totalOrders} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(customer.totalSpent)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Top Customers</CardTitle>
                  <CardDescription>Customers ranked by total spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerData.topCustomers.map((customer, index) => (
                      <div key={customer._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.customerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.totalOrders} orders • Last: {formatDate(customer.lastOrder)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
