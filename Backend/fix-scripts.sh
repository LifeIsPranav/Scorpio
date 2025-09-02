#!/bin/bash

scripts=(
  "seed-belts.js"
  "seed-shoes.js" 
  "seed-socks.js"
  "seed-event-apparels.js"
  "seed-custom-accessories.js"
  "seed-uniforms.js"
)

for script in "${scripts[@]}"; do
  echo "Fixing $script..."
  
  # Add helper functions after Product require
  node -e "
    const fs = require('fs');
    const filePath = 'src/scripts/$script';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add helper functions if not already present
    if (!content.includes('generateSlug')) {
      const helpers = \`
// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\\\\s-]/g, '') // Remove special characters
    .replace(/\\\\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .trim('-'); // Remove leading/trailing dashes
};

// Helper function to extract numeric price from string
const extractNumericPrice = (priceString) => {
  return parseInt(priceString.replace(/[^\\\\d]/g, ''));
};
\`;
      content = content.replace(
        \"const Product = require('../models/Product');\",
        \"const Product = require('../models/Product');\" + helpers
      );
    }
    
    // Update seeding function
    const seedFunctionPattern = /for \\(const productData of \\w+\\) \\{\\s*const product = new Product\\(productData\\);/g;
    const newSeeding = \`for (const productData of \${script.replace('seed-', '').replace('.js', '').replace('-', '')}) {
      // Add missing fields automatically
      if (!productData.slug) {
        productData.slug = generateSlug(productData.name);
      }
      if (!productData.priceNumeric) {
        productData.priceNumeric = extractNumericPrice(productData.price);
      }
      
      const product = new Product(productData);\`;
    
    content = content.replace(seedFunctionPattern, newSeeding);
    
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  "
done
