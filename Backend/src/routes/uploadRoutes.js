const express = require('express');
const {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getUploadSignature
} = require('../controllers/uploadController');
const { authenticateAdmin, requireAnyPermission } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication and upload permissions
router.use(authenticateAdmin);
router.use(requireAnyPermission(['products.create', 'products.update', 'categories.create', 'categories.update']));

// @route   GET /api/upload/signature
router.get('/signature', getUploadSignature);

// @route   POST /api/upload/image
router.post('/image', upload.single('image'), uploadSingleImage);

// @route   POST /api/upload/images
router.post('/images', upload.array('images', 10), uploadMultipleImages);

// @route   DELETE /api/upload/image/:publicId
router.delete('/image/:publicId', deleteImage);

module.exports = router;
