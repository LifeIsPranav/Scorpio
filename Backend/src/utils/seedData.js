const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');

/**
 * Clean up database (remove all data)
 */
const cleanDatabase = async () => {
  try {
    console.log('🧹 Cleaning database...');

    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('✅ Database cleaned successfully');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    throw error;
  }
};

/**
 * Update product counts for all categories
 */
const updateAllCategoryProductCounts = async () => {
  try {
    console.log('🔄 Updating category product counts...');

    const categories = await Category.find({ isActive: true });
    
    for (const category of categories) {
      await category.updateProductCount();
    }

    console.log(`✅ Updated product counts for ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Failed to update category product counts:', error.message);
    throw error;
  }
};

/**
 * Generate slugs for existing data
 */
const generateSlugs = async () => {
  try {
    console.log('🔄 Generating slugs...');

    // Update products without slugs
    const productsWithoutSlugs = await Product.find({ slug: { $exists: false } });
    for (const product of productsWithoutSlugs) {
      await product.save(); // This will trigger the pre-save middleware to generate slug
    }

    // Update categories without slugs
    const categoriesWithoutSlugs = await Category.find({ slug: { $exists: false } });
    for (const category of categoriesWithoutSlugs) {
      await category.save(); // This will trigger the pre-save middleware to generate slug
    }

    console.log('✅ Slugs generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate slugs:', error.message);
    throw error;
  }
};

module.exports = {
  cleanDatabase,
  updateAllCategoryProductCounts,
  generateSlugs
};
