// API configuration and service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || response.statusText;
    const errorDetails = errorData.details || [];
    
    // Create a more detailed error message
    let detailedMessage = `API request failed: ${errorMessage}`;
    if (errorDetails.length > 0) {
      const fieldErrors = errorDetails.map((detail: any) => `${detail.field}: ${detail.message}`).join(', ');
      detailedMessage += ` (${fieldErrors})`;
    }
    
    throw new Error(detailedMessage);
  }

  return response.json();
}

/**
 * Authenticated API request function
 */
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('adminToken');
  
  const authOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  return apiRequest<T>(endpoint, authOptions);
}

/**
 * Admin Authentication API
 */
export const adminApi = {
  login: (username: string, password: string) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  verifyToken: () => authenticatedRequest('/auth/verify'),
  
  getProfile: () => authenticatedRequest('/auth/profile'),
  
  updateProfile: (data: any) => 
    authenticatedRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

/**
 * Admin Categories API
 */
export const adminCategoriesApi = {
  getAll: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    return authenticatedRequest(`/admin/categories${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => authenticatedRequest(`/admin/categories/${id}`),
  
  create: (data: any) => 
    authenticatedRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    authenticatedRequest(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    authenticatedRequest(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Admin Products API
 */
export const adminProductsApi = {
  getAll: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    return authenticatedRequest(`/admin/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => authenticatedRequest(`/admin/products/${id}`),
  
  create: (data: any) => 
    authenticatedRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    authenticatedRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    authenticatedRequest(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Admin Orders API
 */
export const adminOrdersApi = {
  getAll: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    return authenticatedRequest(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => authenticatedRequest(`/admin/orders/${id}`),
  
  create: (data: any) => 
    authenticatedRequest('/admin/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    authenticatedRequest(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateStatus: (id: string, data: any) => 
    authenticatedRequest(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    authenticatedRequest(`/admin/orders/${id}`, {
      method: 'DELETE',
    }),
  
  getStats: () => authenticatedRequest('/admin/orders/stats'),
};

/**
 * Admin Reviews API
 */
export const adminReviewsApi = {
  getAll: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    return authenticatedRequest(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => authenticatedRequest(`/admin/reviews/${id}`),
  
  create: (data: any) => 
    authenticatedRequest('/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    authenticatedRequest(`/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    authenticatedRequest(`/admin/reviews/${id}`, {
      method: 'DELETE',
    }),
  
  toggleVisibility: (id: string) => 
    authenticatedRequest(`/admin/reviews/${id}/visibility`, {
      method: 'PATCH',
    }),
  
  addReply: (id: string, reply: string) => 
    authenticatedRequest(`/admin/reviews/${id}/reply`, {
      method: 'PATCH',
      body: JSON.stringify({ adminReply: reply }),
    }),
  
  getStats: () => authenticatedRequest('/admin/reviews/stats'),
};

/**
 * Category API functions
 */
export const categoryApi = {
  getAll: () => apiRequest('/categories'),
  getById: (id: string) => apiRequest(`/categories/${id}`),
  getBySlug: (slug: string) => apiRequest(`/categories/slug/${slug}`),
};

/**
 * Product API functions
 */
export const productApi = {
  getAll: (params?: { category?: string; featured?: boolean; premium?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.premium) searchParams.append('premium', 'true');
    
    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiRequest(`/products/${id}`),
  getBySlug: (slug: string) => apiRequest(`/products/slug/${slug}`),
  getByCategory: (categorySlug: string) => apiRequest(`/products/category/${categorySlug}`),
};

/**
 * Public API functions (non-authenticated)
 */
export const publicApi = {
  getProducts: (params?: { category?: string; featured?: boolean; custom?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.custom) searchParams.append('custom', 'true');
    
    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  getCategories: () => apiRequest('/categories'),
  getProduct: (slug: string) => apiRequest(`/products/${slug}`),
  getCategory: (slug: string) => apiRequest(`/categories/${slug}`),
  getCategoryProducts: (categorySlug: string) => apiRequest(`/categories/${categorySlug}/products`),
  getCustomProducts: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/products/custom${query}`);
  },
  searchProducts: (query: string, limit?: number) => {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    if (limit) searchParams.append('limit', limit.toString());
    return apiRequest(`/search?${searchParams.toString()}`);
  },
};

export { API_BASE_URL };
