const fs = require('fs');
const path = require('path');

const scriptsToFix = [
  'seed-socks.js',
  'seed-event-apparels.js', 
  'seed-custom-accessories.js',
  'seed-uniforms.js'
];

const helperFunctions = `
// Helper function to generate slug from name
const generateSlug = (name) => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '') // Remove special characters
    .replace(/\\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .trim('-'); // Remove leading/trailing dashes
  
  // Add timestamp to make it unique
  return \`\${baseSlug}-\${Date.now()}\`;
};

// Helper function to extract numeric price from string
const extractNumericPrice = (priceString) => {
  return parseInt(priceString.replace(/[^\\d]/g, ''));
};
`;

scriptsToFix.forEach(scriptName => {
  const scriptPath = path.join(__dirname, 'src/scripts', scriptName);
  console.log(`Fixing ${scriptName}...`);
  
  let content = fs.readFileSync(scriptPath, 'utf8');
  
  // Add helper functions if not present
  if (!content.includes('generateSlug')) {
    content = content.replace(
      "const Product = require('../models/Product');",
      "const Product = require('../models/Product');" + helperFunctions
    );
  }
  
  // Update seeding function to add missing fields
  const categoryName = scriptName.replace('seed-', '').replace('.js', '').replace('-', '');
  content = content.replace(
    /for \(const productData of \w+\) \{\s*const product = new Product\(productData\);/g,
    `for (const productData of ${categoryName}) {
      // Add missing fields automatically
      if (!productData.slug) {
        productData.slug = generateSlug(productData.name);
      }
      if (!productData.priceNumeric) {
        productData.priceNumeric = extractNumericPrice(productData.price);
      }
      
      const product = new Product(productData);`
  );
  
  // Fix negative price modifiers (set to 0)
  content = content.replace(/priceModifier: -\d+/g, 'priceModifier: 0');
  
  fs.writeFileSync(scriptPath, content);
  console.log(`✅ Fixed ${scriptName}`);
});

console.log('🎉 All scripts fixed!');
