const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.productId', 'name images')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name images slug');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Validate and calculate total
    let calculatedTotal = 0;
    for (let item of orderData.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }
      calculatedTotal += product.priceNumeric * item.quantity;
      item.name = product.name;
      item.price = product.priceNumeric;
    }

    orderData.totalAmount = calculatedTotal;

    const order = new Order(orderData);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.productId', 'name images');

    res.status(201).json({
      success: true,
      data: populatedOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If updating items, recalculate total
    if (updateData.items) {
      let calculatedTotal = 0;
      for (let item of updateData.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.productId}`
          });
        }
        calculatedTotal += product.priceNumeric * item.quantity;
        item.name = product.name;
        item.price = product.priceNumeric;
      }
      updateData.totalAmount = calculatedTotal;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDelivery } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
    
    // If status is delivered, set actual delivery date
    if (status === 'delivered') {
      updateData.actualDelivery = new Date();
    }

    // If status is shipped, set shipping date if not already set
    if (status === 'shipped' && !updateData.trackingNumber) {
      updateData.shippedAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log(`Order ${order.orderNumber} status updated to: ${status}`);

    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${status} successfully`
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};
