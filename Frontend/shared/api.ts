/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Admin API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Admin Authentication Types
 */
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse extends ApiResponse {
  token?: string;
  user?: {
    username: string;
    role: string;
  };
}

export interface AdminUser {
  username: string;
  role: string;
}

/**
 * Product Types (shared with data.ts)
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  featured: boolean;
  premium?: boolean;
  whatsappMessage?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  featured?: boolean;
  premium?: boolean;
  whatsappMessage?: string;
}

export interface ProductUpdateRequest extends ProductCreateRequest {
  id: string;
}

/**
 * Category Types (shared with data.ts)
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
  image: string;
}

export interface CategoryUpdateRequest extends CategoryCreateRequest {
  id: string;
}
