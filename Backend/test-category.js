const mongoose = require('mongoose');
require('dotenv').config();

async function testCategoryUpdate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Category = require('./src/models/Category');
    
    // Find a category to test with
    const category = await Category.findOne({});
    if (!category) {
      console.log('No categories found in database');
      return;
    }
    
    console.log('Found category:', category.name, 'ID:', category._id);
    
    // Test the findByIdentifier method with ObjectId
    const foundCategory = await Category.findByIdentifier(category._id.toString());
    if (foundCategory) {
      console.log('✅ findByIdentifier works with ObjectId:', foundCategory.name);
    } else {
      console.log('❌ findByIdentifier failed with ObjectId');
    }
    
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.message);
    mongoose.disconnect();
    process.exit(1);
  }
}

testCategoryUpdate();
