const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get comprehensive analytics dashboard data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalyticsDashboard = asyncHandler(async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get overview statistics
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalReviews,
      revenueData,
      orderStatusData,
      categoryPerformance,
      topProducts,
      recentOrders,
      reviewStats,
      monthlyGrowth,
      dailyOrderTrends
    ] = await Promise.all([
      // Basic counts
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Review.countDocuments(),
      
      // Revenue analytics
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            totalOrders: { $sum: 1 }
          }
        }
      ]),
      
      // Order status distribution
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Category performance
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo'
          }
        },
        { $unwind: '$categoryInfo' },
        {
          $group: {
            _id: '$categoryInfo.name',
            productCount: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            avgRating: { $avg: '$averageRating' }
          }
        },
        { $sort: { productCount: -1 } }
      ]),
      
      // Top performing products
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'product',
            as: 'reviews'
          }
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            avgRating: { $avg: '$reviews.rating' }
          }
        },
        { $sort: { reviewCount: -1, avgRating: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: 1,
            price: 1,
            reviewCount: 1,
            averageRating: 1,
            images: { $arrayElemAt: ['$images', 0] }
          }
        }
      ]),
      
      // Recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('items.productId', 'name')
        .select('orderNumber totalAmount status createdAt customerInfo'),
      
      // Review statistics
      Review.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Monthly growth data
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      
      // Daily order trends for the last 30 days
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    // Calculate conversion rate (mock data - in real app you'd track visitors)
    const conversionRate = totalOrders > 0 ? ((totalOrders / (totalOrders * 10)) * 100).toFixed(2) : 0;

    // Calculate growth percentage
    const currentRevenue = revenueData[0]?.totalRevenue || 0;
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    
    const previousRevenue = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: 'cancelled' }, 
          createdAt: { $gte: previousPeriodStart, $lt: startDate } 
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const revenueGrowth = previousRevenue[0]?.totalRevenue 
      ? (((currentRevenue - previousRevenue[0].totalRevenue) / previousRevenue[0].totalRevenue) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalReviews,
          totalRevenue: currentRevenue,
          averageOrderValue: revenueData[0]?.averageOrderValue || 0,
          conversionRate: parseFloat(conversionRate),
          revenueGrowth: parseFloat(revenueGrowth)
        },
        charts: {
          orderStatus: orderStatusData,
          categoryPerformance,
          reviewDistribution: reviewStats,
          monthlyGrowth,
          dailyTrends: dailyOrderTrends
        },
        tables: {
          topProducts,
          recentOrders
        },
        period
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const salesData = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const productSales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product._id',
          name: { $first: '$product.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: {
        dailySales: salesData,
        productSales,
        period
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics',
      error: error.message
    });
  }
});

// @desc    Get customer analytics
// @route   GET /api/admin/analytics/customers
// @access  Private/Admin
const getCustomerAnalytics = asyncHandler(async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const customerStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$customerInfo.email',
          customerName: { $first: '$customerInfo.name' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 50 }
    ]);

    const newCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          firstOrder: { $min: '$createdAt' },
          customerName: { $first: '$customerInfo.name' }
        }
      },
      { $match: { firstOrder: { $gte: startDate } } },
      { $count: 'newCustomers' }
    ]);

    const customerRetention = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          orderCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$orderCount',
          customers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        topCustomers: customerStats,
        newCustomers: newCustomers[0]?.newCustomers || 0,
        retentionData: customerRetention,
        period
      }
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer analytics',
      error: error.message
    });
  }
});

module.exports = {
  getAnalyticsDashboard,
  getSalesAnalytics,
  getCustomerAnalytics
};
