# Frontend Architecture Reference Guide

This document provides a comprehensive overview of the frontend structure to enable the development of a complete backend system. It covers all aspects from data models to user flows and API requirements.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Data Models & Types](#data-models--types)
4. [Application Structure](#application-structure)
5. [User Journeys & Business Logic](#user-journeys--business-logic)
6. [API Requirements](#api-requirements)
7. [Authentication & Authorization](#authentication--authorization)
8. [Admin Panel Requirements](#admin-panel-requirements)
9. [UI/UX Patterns](#uiux-patterns)
10. [State Management](#state-management)
11. [Form Handling & Validation](#form-handling--validation)
12. [Business Rules](#business-rules)
13. [Integration Points](#integration-points)
14. [Deployment & Infrastructure](#deployment--infrastructure)

## Project Overview

**Application Type**: E-commerce/Product Catalog Platform with Admin Management
**Primary Business Model**: Product showcase with WhatsApp-based customer engagement
**Core Value Proposition**: Personalized customer service through direct WhatsApp communication

### Key Features

- Product catalog browsing and filtering
- Category-based product organization
- Premium product collections
- Featured product highlighting
- WhatsApp integration for customer engagement
- Comprehensive admin dashboard for inventory management
- Responsive design with modern UI components

## Technical Stack

### Frontend Framework

- **React 18** with TypeScript
- **React Router 6** (SPA mode) for routing
- **TailwindCSS 3** for styling with custom design system
- **Vite** as build tool and development server

### UI Component Library

- **Radix UI** components (40+ pre-built components)
- Custom design system with consistent theming
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Query (@tanstack/react-query)** for server state management

### Form & Validation

- **React Hook Form** (available but not fully implemented)
- **Zod** for schema validation (available but not fully implemented)
- Manual validation currently implemented

### Utilities

- **date-fns** for date manipulation
- **clsx** and **tailwind-merge** for conditional classes
- **sonner** for toast notifications

## Data Models & Types

### Core Entities

#### Product

```typescript
interface Product {
  id: string; // Unique identifier
  name: string; // Product name
  description: string; // Product description
  price: string; // Price as formatted string (e.g., "₹12,999")
  images: string[]; // Array of image URLs
  category: string; // Category ID reference
  featured: boolean; // Featured on homepage
  premium?: boolean; // Part of premium collection
  whatsappMessage?: string; // Custom WhatsApp inquiry message
}
```

#### Category

```typescript
interface Category {
  id: string; // Unique identifier (slug format)
  name: string; // Display name
  description: string; // Category description
  image: string; // Category hero image URL
}
```

#### Admin User

```typescript
interface AdminUser {
  username: string;
  role: string;
}
```

### API Response Types

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface PaginationResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Application Structure

### Route Architecture

```
Public Routes:
├── / (Homepage - Hero, Premium Products, Products, Categories)
├── /products (All products with filtering)
├── /product/:id (Individual product detail)
├── /categories (Category listing)
├── /category/:categoryId (Products by category)
├── /about (About page)
├── /contact (Contact information)
├── /careers (Career opportunities)
├── /shipping-info (Shipping details)
├── /returns (Return policy)
├── /size-guide (Sizing information)
├── /help-center (Help & support)
└── * (404 Not Found)

Admin Routes (Protected):
├── /admin/login (Admin authentication)
├── /admin/dashboard (Analytics & overview)
├── /admin/products (Product management)
├─��� /admin/categories (Category management)
├── /admin/orders (Order management - placeholder)
├── /admin/customers (Customer management - placeholder)
├── /admin/analytics (Analytics dashboard - placeholder)
└── /admin/settings (Settings - placeholder)
```

### Component Hierarchy

#### Public Components

```
App.tsx
├── Navigation.tsx (Site navigation with mobile menu)
├── Pages/
│   ├── Index.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PremiumShowcase.tsx (Carousel of premium products)
│   │   ├── ProductShowcase.tsx (Featured products grid)
│   │   ├── CategoriesSection.tsx (Category cards)
│   │   └── Footer.tsx
│   ├── Products.tsx (Product listing with filters)
│   ├── ProductDetail.tsx (Detailed product view)
│   ├── Categories.tsx (Category grid)
│   ├── CategoryProducts.tsx (Products in category)
│   └── [Other static pages]
├── ProductCard.tsx (Reusable product card)
├── ScrollReveal.tsx (Animation helper)
└── ui/ (40+ Radix UI components)
```

#### Admin Components

```
Admin/
├── AdminLayout.tsx (Sidebar navigation + header)
├── ProtectedAdminRoute.tsx (Auth guard)
├── ProductFormDialog.tsx (Add/Edit product modal)
├── CategoryFormDialog.tsx (Add/Edit category modal)
└── Pages/
    ├── AdminDashboard.tsx (Stats + quick actions)
    ├── AdminProducts.tsx (Product CRUD interface)
    └── AdminCategories.tsx (Category CRUD interface)
```

## User Journeys & Business Logic

### Customer Journey

1. **Discovery Phase**
   - Land on homepage with hero section
   - Browse premium product carousel
   - Explore featured products
   - Navigate categories

2. **Product Exploration**
   - Filter products by category
   - Search products by name/description
   - View product details with image gallery
   - Read product specifications and reviews

3. **Engagement Phase**
   - Click "Personalize with us" button
   - Redirect to WhatsApp with pre-filled message
   - Direct communication with business

4. **Additional Actions**
   - Share products via social media
   - Save favorites (heart icon)
   - Browse related products
   - Access help center

### Admin Journey

1. **Authentication**
   - Login with credentials (currently demo: admin/admin123)
   - Session management with token storage

2. **Dashboard Overview**
   - View key metrics (products, categories, orders, customers)
   - Monitor recent orders
   - Identify top-performing products
   - Access quick actions

3. **Product Management**
   - View all products with filtering/search
   - Create new products with form validation
   - Edit existing products
   - Toggle featured/premium status
   - Delete products with confirmation
   - Manage product images (multiple uploads)

4. **Category Management**
   - View all categories
   - Create new categories
   - Edit category details
   - Delete categories (with product count validation)

## API Requirements

### Authentication Endpoints

```http
POST /api/admin/login
Content-Type: application/json
{
  "username": "string",
  "password": "string"
}
Response: {
  "success": boolean,
  "message": "string",
  "token": "string",
  "user": {
    "username": "string",
    "role": "string"
  }
}

GET /api/admin/verify
Authorization: Bearer {token}
Response: {
  "success": boolean,
  "user": AdminUser
}
```

### Product Management APIs

```http
GET /api/admin/products?category={id}&search={term}&page={num}&limit={num}
Response: PaginationResponse<Product[]>

GET /api/admin/products/{id}
Response: ApiResponse<Product>

POST /api/admin/products
Content-Type: application/json
{
  "name": "string",
  "description": "string",
  "price": "string",
  "category": "string",
  "featured": boolean,
  "premium": boolean,
  "images": string[],
  "whatsappMessage": "string"
}
Response: ApiResponse<Product>

PUT /api/admin/products/{id}
Content-Type: application/json
[Same as POST]
Response: ApiResponse<Product>

DELETE /api/admin/products/{id}
Response: ApiResponse<Product>
```

### Category Management APIs

```http
GET /api/admin/categories?search={term}
Response: ApiResponse<Category[]>

GET /api/admin/categories/{id}
Response: ApiResponse<Category>

POST /api/admin/categories
Content-Type: application/json
{
  "name": "string",
  "description": "string",
  "image": "string"
}
Response: ApiResponse<Category>

PUT /api/admin/categories/{id}
Content-Type: application/json
[Same as POST]
Response: ApiResponse<Category>

DELETE /api/admin/categories/{id}
Response: ApiResponse<Category>
```

### Public Data APIs (Optional - for dynamic content)

```http
GET /api/products?category={id}&featured={boolean}&premium={boolean}
Response: ApiResponse<Product[]>

GET /api/categories
Response: ApiResponse<Category[]>

GET /api/product/{id}
Response: ApiResponse<Product>
```

## Authentication & Authorization

### Current Implementation

- **Demo Mode**: Hardcoded credentials (admin/admin123)
- **Client-side**: localStorage token "admin-authenticated"
- **Session**: Basic token verification

### Production Requirements

- **Secure Authentication**: Hashed passwords, JWT tokens
- **Role-based Access**: Multiple admin roles (super-admin, manager, editor)
- **Session Management**: Token expiration, refresh tokens
- **Security Headers**: CSRF protection, rate limiting
- **Audit Logging**: Track admin actions

### Protected Routes

- All `/admin/*` routes except `/admin/login`
- Middleware should verify token on server requests
- Client-side guards implemented via `ProtectedAdminRoute` component

## Admin Panel Requirements

### Dashboard Analytics

- **Key Metrics**: Product count, category count, order statistics, customer counts
- **Trend Analysis**: Growth percentages, visual indicators
- **Recent Activity**: Latest orders, status updates
- **Quick Actions**: Direct access to common tasks

### Product Management Features

- **Bulk Operations**: Multi-select for batch actions
- **Image Management**: Multiple image upload, reordering, optimization
- **SEO Fields**: Meta descriptions, tags, URLs
- **Inventory Tracking**: Stock levels, variants, pricing
- **Content Management**: Rich text editor for descriptions

### Category Management Features

- **Hierarchy Support**: Nested categories, parent-child relationships
- **SEO Optimization**: Category page meta data
- **Image Management**: Category hero images, thumbnails
- **Product Assignment**: Bulk category assignment

### Additional Admin Features (Future)

- **Order Management**: Order processing, status updates, shipping
- **Customer Management**: Customer profiles, communication history
- **Analytics Dashboard**: Sales reports, performance metrics
- **Settings Management**: Site configuration, payment settings
- **Content Management**: Static page editing, blog management

## UI/UX Patterns

### Design System

- **Color Scheme**: Modern minimal theme with HSL color system
- **Typography**: Font hierarchy with responsive scaling
- **Spacing**: Consistent padding/margin using Tailwind spacing scale
- **Border Radius**: Consistent rounded corners (--radius: 0.75rem)
- **Shadows**: Layered shadow system for depth

### Component Patterns

- **Cards**: Consistent card layouts with hover effects
- **Buttons**: Primary, secondary, outline, and ghost variants
- **Forms**: Consistent input styles with validation states
- **Modals**: Overlay dialogs for CRUD operations
- **Tables**: Responsive data tables with sorting/filtering
- **Navigation**: Responsive navigation with mobile hamburger menu

### Responsive Design

- **Mobile-first**: Design starts with mobile layout
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- **Grid System**: CSS Grid and Flexbox for layouts
- **Touch Targets**: Minimum 44px for mobile interactions

### Animation & Interactions

- **Scroll Reveal**: Elements animate into view on scroll
- **Hover Effects**: Subtle transformations and shadows
- **Loading States**: Skeleton loaders and progress indicators
- **Transitions**: Smooth state changes with CSS transitions

## State Management

### Current Patterns

- **Local State**: useState/useEffect for component state
- **Context**: AdminAuthContext for authentication state
- **Data Fetching**: Direct fetch calls (ready for React Query migration)

### Recommended Patterns

- **React Query**: Server state management with caching
- **Context**: Global UI state (theme, user preferences)
- **Local Storage**: Persistent user preferences
- **Session Storage**: Temporary form data

### State Structure

```typescript
// Global App State
interface AppState {
  auth: {
    isAuthenticated: boolean;
    user: AdminUser | null;
    token: string | null;
  };
  ui: {
    theme: "light" | "dark";
    sidebarOpen: boolean;
    notifications: Notification[];
  };
  cache: {
    products: Product[];
    categories: Category[];
    lastFetch: timestamp;
  };
}
```

## Form Handling & Validation

### Current Implementation

- **Manual Validation**: Custom validation functions
- **Error Handling**: Error state objects with field-specific messages
- **Form State**: Local useState for form data

### Validation Rules

#### Product Form

```typescript
const productValidation = {
  name: { required: true, minLength: 2, maxLength: 100 },
  description: { required: true, minLength: 10, maxLength: 1000 },
  price: { required: true, pattern: /^₹[\d,]+$/ },
  category: { required: true },
  images: { required: true, minItems: 1, maxItems: 10 },
  whatsappMessage: { maxLength: 500 },
};
```

#### Category Form

```typescript
const categoryValidation = {
  name: { required: true, minLength: 2, maxLength: 50, unique: true },
  description: { required: true, minLength: 10, maxLength: 200 },
  image: { required: true, format: "url" },
};
```

### Future Enhancements

- **Zod Schema**: Type-safe validation schemas
- **React Hook Form**: Better form performance and validation
- **Real-time Validation**: Async validation for uniqueness checks
- **File Upload**: Direct image upload with preview

## Business Rules

### Product Rules

- **Unique IDs**: System-generated unique identifiers
- **Price Format**: Must include currency symbol (₹)
- **Image Requirements**: At least 1 image, maximum 10 images
- **Category Assignment**: Must belong to existing category
- **Featured Limit**: Optional business rule for max featured products
- **Premium Collection**: Subset of products for premium showcase

### Category Rules

- **Unique Names**: Category names must be unique
- **Slug Generation**: Auto-generate URL-friendly IDs from names
- **Image Requirements**: Each category must have a hero image
- **Deletion Rules**: Cannot delete category with existing products

### WhatsApp Integration

- **Message Format**: Pre-filled messages with product details
- **Phone Number**: Configurable business WhatsApp number
- **URL Format**: `https://wa.me/{phone}?text={encodedMessage}`

### Inventory Rules

- **Stock Status**: Simple in-stock/out-of-stock (future: quantity tracking)
- **Price Updates**: Historical price tracking (future requirement)
- **Category Changes**: Track category reassignments

## Integration Points

### External Services

- **WhatsApp Business**: Customer communication platform
- **Image CDN**: Product image storage and optimization
- **Analytics**: Google Analytics, Facebook Pixel (future)
- **Payment Gateway**: Integration ready for future e-commerce features

### Backend Services Required

- **Database**: Product and category storage
- **File Storage**: Image upload and management
- **Authentication**: Admin user management
- **Email Service**: Order notifications, admin alerts (future)
- **Search Service**: Advanced product search (future)

### API Integrations

- **Social Media**: Product sharing capabilities
- **Shipping**: Delivery tracking integration (future)
- **Inventory**: Stock level synchronization (future)
- **CRM**: Customer data management (future)

## Deployment & Infrastructure

### Current Setup

- **Development**: Vite dev server on port 8080
- **Build Process**: Static site generation + Node.js server
- **Deployment**: Netlify/Vercel ready with serverless functions

### Production Requirements

- **Database**: PostgreSQL, MongoDB, or MySQL
- **File Storage**: AWS S3, Cloudinary, or similar
- **CDN**: Image and asset delivery optimization
- **SSL**: HTTPS certificate for secure communications
- **Monitoring**: Error tracking, performance monitoring
- **Backup**: Automated database backups

### Environment Variables

```env
# Database
DATABASE_URL=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Authentication
JWT_SECRET=
ADMIN_DEFAULT_PASSWORD=

# File Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

# External Services
WHATSAPP_PHONE_NUMBER=
ANALYTICS_ID=

# App Configuration
NODE_ENV=
PORT=
CORS_ORIGIN=
```

### Performance Considerations

- **Image Optimization**: WebP format, responsive images
- **Code Splitting**: Route-based code splitting
- **Caching**: Browser caching, CDN caching
- **Database Indexing**: Product search, category lookups
- **API Rate Limiting**: Prevent abuse of admin endpoints

### Security Requirements

- **Input Sanitization**: Prevent XSS, SQL injection
- **File Upload Security**: Image type validation, size limits
- **CORS Configuration**: Restrict cross-origin requests
- **Admin IP Restriction**: Optional IP whitelisting
- **Audit Logging**: Track all admin actions
- **Data Backup**: Regular automated backups
- **GDPR Compliance**: Data protection compliance (future)

## Implementation Priority

### Phase 1: Core Backend (MVP)

1. Database schema implementation
2. Authentication system
3. Product CRUD APIs
4. Category CRUD APIs
5. Basic admin dashboard data

### Phase 2: Enhanced Features

1. File upload system
2. Advanced search and filtering
3. Order management system
4. Customer data management
5. Analytics and reporting

### Phase 3: Advanced Features

1. Multi-admin roles and permissions
2. Advanced inventory management
3. Email notification system
4. Performance optimization
5. Advanced security features

This comprehensive reference should provide all necessary information to build a complete backend system that perfectly supports the existing frontend architecture and user requirements.
