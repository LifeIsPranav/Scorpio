/**
 * Generate a slug from a string
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')             // Trim hyphens from start of text
    .replace(/-+$/, '');            // Trim hyphens from end of text
};

/**
 * Parse price string to number
 */
const parsePriceToNumber = (priceString) => {
  if (typeof priceString !== 'string') return 0;
  
  const match = priceString.match(/₹([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  return 0;
};

/**
 * Format number to price string
 */
const formatNumberToPrice = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '₹0';
  
  return `₹${number.toLocaleString('en-IN')}`;
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate image URL format
 */
const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) return false;
  
  const imageExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;
  return imageExtensions.test(url);
};

/**
 * Generate random string
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
};

/**
 * Calculate pagination metadata
 */
const calculatePagination = (page, limit, total) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const totalPages = Math.ceil(total / limitNum);
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
    skip,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1
  };
};

/**
 * Create API response object
 */
const createApiResponse = (success, data = null, message = null, error = null) => {
  const response = { success };
  
  if (message) response.message = message;
  if (data !== null) response.data = data;
  if (error) response.error = error;
  
  return response;
};

/**
 * Handle async errors in Express
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Deep clone an object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Debounce function
 */
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if object is empty
 */
const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  return Object.keys(obj).length === 0;
};

/**
 * Generate WhatsApp URL
 */
const generateWhatsAppUrl = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  generateSlug,
  parsePriceToNumber,
  formatNumberToPrice,
  isValidEmail,
  isValidUrl,
  isValidImageUrl,
  generateRandomString,
  sanitizeInput,
  calculatePagination,
  createApiResponse,
  asyncHandler,
  deepClone,
  debounce,
  formatFileSize,
  getFileExtension,
  isEmpty,
  generateWhatsAppUrl,
  isValidObjectId
};
