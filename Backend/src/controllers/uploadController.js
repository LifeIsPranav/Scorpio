const multer = require('multer');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { authenticateAdmin, requirePermission } = require('../middleware/authMiddleware');

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// Configure storage based on environment
let storage;
let cloudinary;

if (isCloudinaryConfigured()) {
  try {
    // Cloudinary configuration
    cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'scorpio-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
          { fetch_format: 'auto' }
        ],
      },
    });
  } catch (error) {
    console.warn('Cloudinary not available, falling back to local storage');
    setupLocalStorage();
  }
} else {
  setupLocalStorage();
}

function setupLocalStorage() {
  // Local storage configuration
  const path = require('path');
  const fs = require('fs');
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }

  const imageUrl = isCloudinaryConfigured() 
    ? req.file.path 
    : `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: imageUrl,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No image files provided'
    });
  }

  const uploadedImages = req.files.map(file => {
    const imageUrl = isCloudinaryConfigured() 
      ? file.path 
      : `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    return {
      url: imageUrl,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size
    };
  });

  res.status(200).json({
    success: true,
    message: `${uploadedImages.length} images uploaded successfully`,
    data: uploadedImages
  });
});

// @desc    Delete image
// @route   DELETE /api/upload/image/:publicId
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    return res.status(400).json({
      success: false,
      error: 'Public ID is required'
    });
  }

  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        res.status(200).json({
          success: true,
          message: 'Image deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete image'
      });
    }
  } else {
    // Local file deletion
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'uploads', publicId);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({
          success: true,
          message: 'Image deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }
    } catch (error) {
      console.error('File deletion error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete image'
      });
    }
  }
});

// @desc    Get upload signature for direct upload
// @route   GET /api/upload/signature
// @access  Private
const getUploadSignature = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Cloudinary is not configured for direct uploads'
    });
  }

  const timestamp = Math.round((new Date).getTime() / 1000);
  
  const params = {
    timestamp: timestamp,
    folder: 'scorpio-products',
    transformation: 'w_1200,h_1200,c_limit,q_auto,f_auto'
  };

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

  res.status(200).json({
    success: true,
    data: {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: 'scorpio-products'
    }
  });
});

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getUploadSignature
};
