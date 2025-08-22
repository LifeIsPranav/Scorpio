# Scorpio Backend API

A complete Node.js backend for the Scorpio e-commerce platform built with Express.js and MongoDB.

## Features

- 🔐 **Authentication & Authorization**: JWT-based admin authentication with role-based permissions
- 📦 **Product Management**: Complete CRUD operations for products with image support
- 🏷️ **Category Management**: Hierarchical category system with product counts
- 🖼️ **File Upload**: Cloudinary integration for image uploads
- 🔍 **Search & Filtering**: Advanced product search and filtering capabilities
- 📊 **Analytics**: Product and category analytics dashboard
- 🚀 **Performance**: Optimized queries with MongoDB indexing
- 🛡️ **Security**: Rate limiting, input validation, and security headers
- 📱 **WhatsApp Integration**: Generate WhatsApp links for customer engagement

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator
- **Security**: Helmet, Rate Limiting, CORS
- **Development**: Nodemon, ESLint

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/scorpio_db
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_DEFAULT_USERNAME=admin
   ADMIN_DEFAULT_PASSWORD=admin123
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Authentication
```
POST   /api/auth/login           - Admin login
GET    /api/auth/verify          - Verify token
GET    /api/auth/profile         - Get admin profile
PUT    /api/auth/profile         - Update admin profile
PUT    /api/auth/change-password - Change password
POST   /api/auth/logout          - Logout
```

### Admin Products
```
GET    /api/admin/products           - Get all products (with filters)
GET    /api/admin/products/:id       - Get single product
POST   /api/admin/products           - Create new product
PUT    /api/admin/products/:id       - Update product
DELETE /api/admin/products/:id       - Delete product
PUT    /api/admin/products/bulk      - Bulk update products
GET    /api/admin/products/analytics - Get product analytics
```

### Admin Categories
```
GET    /api/admin/categories              - Get all categories
GET    /api/admin/categories/:id          - Get single category
POST   /api/admin/categories              - Create new category
PUT    /api/admin/categories/:id          - Update category
DELETE /api/admin/categories/:id          - Delete category
GET    /api/admin/categories/:id/products - Get category with products
PUT    /api/admin/categories/reorder      - Reorder categories
GET    /api/admin/categories/analytics    - Get category analytics
```

### Public API
```
GET    /api/homepage                      - Get homepage data
GET    /api/products                      - Get all products (public)
GET    /api/products/featured             - Get featured products
GET    /api/products/premium              - Get premium products
GET    /api/products/:id                  - Get single product (public)
GET    /api/categories                    - Get all categories (public)
GET    /api/categories/:id                - Get single category (public)
GET    /api/categories/:id/products       - Get products by category
GET    /api/search                        - Search products and categories
```

### File Upload
```
GET    /api/upload/signature      - Get upload signature for Cloudinary
POST   /api/upload/image          - Upload single image
POST   /api/upload/images         - Upload multiple images
DELETE /api/upload/image/:publicId - Delete image
```

### Health Check
```
GET    /api/health - Server health check
```

## Data Models

### Product
```javascript
{
  name: String,           // Product name
  description: String,    // Product description
  price: String,          // Formatted price (₹12,999)
  priceNumeric: Number,   // Numeric price for sorting
  images: [String],       // Array of image URLs
  category: String,       // Category slug
  featured: Boolean,      // Featured on homepage
  premium: Boolean,       // Premium product
  whatsappMessage: String,// Custom WhatsApp message
  tags: [String],         // Search tags
  views: Number,          // View count
  order: Number,          // Display order
  isActive: Boolean       // Soft delete flag
}
```

### Category
```javascript
{
  name: String,           // Category name
  slug: String,           // URL-friendly identifier
  description: String,    // Category description
  image: String,          // Category image URL
  productCount: Number,   // Number of products
  order: Number,          // Display order
  isActive: Boolean       // Soft delete flag
}
```

### Admin
```javascript
{
  username: String,       // Unique username
  password: String,       // Hashed password
  email: String,          // Email address (optional)
  role: String,           // admin, manager, editor
  permissions: [String],  // Array of permissions
  isActive: Boolean,      // Account status
  lastLogin: Date,        // Last login timestamp
  loginAttempts: Number,  // Failed login attempts
  lockUntil: Date         // Account lock expiry
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/scorpio_db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `ADMIN_DEFAULT_USERNAME` | Default admin username | `admin` |
| `ADMIN_DEFAULT_PASSWORD` | Default admin password | `admin123` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:8080` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Optional |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Optional |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Optional |
| `WHATSAPP_PHONE_NUMBER` | WhatsApp business number | `+919876543210` |

## Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
```

## Authentication & Authorization

The API uses JWT-based authentication with role-based access control:

### Roles
- **Admin**: Full access to all features
- **Manager**: Access to products and categories
- **Editor**: Read access to products, limited write access

### Permissions
- `products.read`, `products.create`, `products.update`, `products.delete`
- `categories.read`, `categories.create`, `categories.update`, `categories.delete`
- `admins.read`, `admins.create`, `admins.update`, `admins.delete`
- `analytics.read`, `settings.read`, `settings.update`

### Authentication Flow
1. Login with username/password → GET `/api/auth/login`
2. Receive JWT token
3. Include token in Authorization header: `Bearer <token>`
4. Token is verified on protected routes

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

Error Response Format:
```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Validation errors (if any)
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS origins
- **Password Hashing**: bcryptjs with salt rounds
- **Account Locking**: After 5 failed login attempts
- **JWT Security**: Secure token generation and validation

## File Upload

The API supports image uploads via Cloudinary:

1. **Direct Upload**: Upload files directly to the API
2. **Signed Upload**: Get upload signature for client-side uploads
3. **Image Processing**: Automatic image optimization and format conversion
4. **File Validation**: Size and type validation

Supported formats: JPG, JPEG, PNG, WebP
Maximum file size: 5MB per file
Maximum files: 10 per request

## Database Indexing

The API includes optimized database indexes for:
- Product search (text indexes on name, description, tags)
- Category lookups
- Product filtering by category, featured, premium status
- Price range queries
- Admin username and email lookups

## Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=production-secret-key
   ```

2. **Build Application**
   ```bash
   npm run build
   npm start
   ```

3. **Process Management** (PM2)
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name scorpio-api
   pm2 save
   pm2 startup
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Tracking**: Comprehensive error logging
- **Health Checks**: `/api/health` endpoint for monitoring
- **Performance**: Database query optimization

## Development

### Project Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Utility functions
├── scripts/         # Database scripts
└── server.js        # Main server file
```

### Code Style
- ESLint configuration for consistent code style
- Prettier integration for code formatting
- Pre-commit hooks for code quality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

---

**Note**: This backend is designed to work seamlessly with the Scorpio frontend. Make sure to update the frontend API endpoints to match this backend's URL structure.
