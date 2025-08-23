const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
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
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: String,
    required: [true, 'Product price is required'],
    validate: {
      validator: function(v) {
        return /^₹[\d,]+$/.test(v);
      },
      message: 'Price must be in format ₹X,XXX'
    }
  },
  priceNumeric: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: true,
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
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    ref: 'Category'
  },
  featured: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  whatsappMessage: {
    type: String,
    maxlength: [500, 'WhatsApp message cannot exceed 500 characters'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
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

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ premium: 1, isActive: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ priceNumeric: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for id (to maintain frontend compatibility)
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Pre-save middleware to generate slug and extract numeric price
productSchema.pre('save', function(next) {
  // Generate slug from name
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Extract numeric price from formatted price
  if (this.isModified('price')) {
    const priceMatch = this.price.match(/₹([\d,]+)/);
    if (priceMatch) {
      this.priceNumeric = parseInt(priceMatch[1].replace(/,/g, ''));
    }
  }

  // Generate default WhatsApp message if not provided
  if (!this.whatsappMessage) {
    this.whatsappMessage = `Hi! I'm interested in the ${this.name}. Could you tell me more about it?`;
  }

  next();
});

// Post-save middleware to update category product count
productSchema.post('save', async function() {
  if (this.category) {
    const Category = mongoose.model('Category');
    const category = await Category.findOne({ slug: this.category });
    if (category) {
      await category.updateProductCount();
    }
  }
});

// Post-remove middleware to update category product count
productSchema.post('deleteOne', { document: true }, async function() {
  if (this.category) {
    const Category = mongoose.model('Category');
    const category = await Category.findOne({ slug: this.category });
    if (category) {
      await category.updateProductCount();
    }
  }
});

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ featured: true, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to find premium products
productSchema.statics.findPremium = function(limit = 10) {
  return this.find({ premium: true, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to find by category
productSchema.statics.findByCategory = function(categorySlug, options = {}) {
  const query = { category: categorySlug, isActive: true };
  
  return this.find(query)
    .sort(options.sort || { order: 1, createdAt: -1 })
    .limit(options.limit || 0)
    .skip(options.skip || 0);
};

// Instance method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
