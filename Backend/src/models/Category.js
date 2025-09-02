const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Category image is required'],
    validate: {
      validator: function(v) {
        // More flexible URL validation for modern image services
        return /^https?:\/\/.+/i.test(v) && 
               (v.includes('images.unsplash.com') || 
                v.includes('cdn.') || 
                /\.(jpg|jpeg|png|webp|gif)$/i.test(v) ||
                /\.(jpg|jpeg|png|webp|gif)\?/i.test(v));
      },
      message: 'Please provide a valid image URL'
    }
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id (to maintain frontend compatibility)
categorySchema.virtual('id').get(function() {
  return this.slug;
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Static method to find by ObjectId, name or slug
categorySchema.statics.findByIdentifier = function(identifier) {
  // Check if identifier is a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return this.findById(identifier);
  }
  
  // Otherwise search by slug or name
  return this.findOne({
    $or: [
      { slug: identifier },
      { name: new RegExp('^' + identifier + '$', 'i') }
    ]
  });
};

// Instance method to update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  this.productCount = await Product.countDocuments({ category: this.slug });
  return this.save();
};

module.exports = mongoose.model('Category', categorySchema);
