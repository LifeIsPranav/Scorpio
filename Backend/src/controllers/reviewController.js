const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { productId, rating, isVisible, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const query = {};
    if (productId) query.productId = productId;
    if (rating) query.rating = rating;
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';

    const reviews = await Review.find(query)
      .populate('productId', 'name images slug')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get single review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('productId', 'name images slug')
      .populate('orderId', 'orderNumber');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// Create new review
exports.createReview = async (req, res) => {
  try {
    const reviewData = req.body;

    // Validate product exists
    const product = await Product.findById(reviewData.productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = new Review(reviewData);
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('productId', 'name images slug');

    res.status(201).json({
      success: true,
      data: populatedReview,
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('productId', 'name images slug');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Toggle review visibility
exports.toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isVisible = !review.isVisible;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('productId', 'name images slug');

    res.json({
      success: true,
      data: populatedReview,
      message: `Review ${review.isVisible ? 'shown' : 'hidden'} successfully`
    });
  } catch (error) {
    console.error('Toggle review visibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle review visibility',
      error: error.message
    });
  }
};

// Add admin reply
exports.addAdminReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { 
        adminReply,
        adminReplyDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('productId', 'name images slug');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review,
      message: 'Admin reply added successfully'
    });
  } catch (error) {
    console.error('Add admin reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add admin reply',
      error: error.message
    });
  }
};

// Get review statistics
exports.getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const visibleReviews = await Review.countDocuments({ isVisible: true });
    const verifiedReviews = await Review.countDocuments({ isVerified: true });
    
    const ratingDistribution = await Review.aggregate([
      { 
        $group: { 
          _id: '$rating', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    const averageRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalReviews,
        visibleReviews,
        verifiedReviews,
        averageRating: averageRating[0]?.avgRating || 0,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message
    });
  }
};
