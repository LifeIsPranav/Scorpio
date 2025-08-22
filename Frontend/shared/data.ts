// Types for products and categories
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

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

// Sample categories
export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest gadgets and tech accessories",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Trendy clothing and accessories",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "home",
    name: "Home & Garden",
    description: "Beautiful items for your living space",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Equipment for active lifestyle",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
  },
];

// Sample products
export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: "₹12,999",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center",
    ],
    category: "electronics",
    featured: true,
    premium: true,
    whatsappMessage:
      "Hi! I'm interested in the Premium Wireless Headphones. Could you tell me more about it?",
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    description:
      "Advanced fitness tracker with heart rate monitoring and GPS capabilities.",
    price: "₹24,999",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&crop=center",
    ],
    category: "electronics",
    featured: true,
    premium: true,
    whatsappMessage:
      "Hello! I'd like to know more about the Smart Watch Series X.",
  },
  {
    id: "3",
    name: "Designer Leather Jacket",
    description:
      "Premium genuine leather jacket with modern cut and superior craftsmanship.",
    price: "₹8,999",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=600&fit=crop&crop=center",
    ],
    category: "fashion",
    featured: true,
    premium: true,
    whatsappMessage:
      "Hi there! I'm interested in the Designer Leather Jacket. What sizes do you have?",
  },
  {
    id: "4",
    name: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and USB charging port.",
    price: "₹3,499",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&crop=center",
    ],
    category: "home",
    featured: false,
    whatsappMessage:
      "Hello! Could you provide more details about the Minimalist Desk Lamp?",
  },
  {
    id: "5",
    name: "Yoga Mat Pro",
    description:
      "Professional grade yoga mat with superior grip and eco-friendly materials.",
    price: "₹2,999",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&h=600&fit=crop&crop=center",
    ],
    category: "sports",
    featured: false,
    whatsappMessage:
      "Hi! I'm interested in the Yoga Mat Pro. What are the dimensions?",
  },
  {
    id: "6",
    name: "Ceramic Plant Pot Set",
    description:
      "Beautiful handcrafted ceramic pots perfect for indoor plants and succulents.",
    price: "₹1,999",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop&crop=center",
    ],
    category: "home",
    featured: false,
    whatsappMessage:
      "Hello! I'd like to know more about the Ceramic Plant Pot Set.",
  },
];

// Featured products (subset of products)
export const featuredProducts = products.filter((product) => product.featured);

// Premium products (subset of products)
export const premiumProducts = products.filter((product) => product.premium);
