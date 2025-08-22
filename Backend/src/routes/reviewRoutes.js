const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(authenticateAdmin);

// Review routes
router.get('/', reviewController.getAllReviews);
router.get('/stats', reviewController.getReviewStats);
router.get('/:id', reviewController.getReview);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.patch('/:id/visibility', reviewController.toggleReviewVisibility);
router.patch('/:id/reply', reviewController.addAdminReply);

module.exports = router;
