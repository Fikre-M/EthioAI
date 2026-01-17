import api from '@/api/axios';

// Product Service
export interface CreateProductData {
  name: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  materials?: string[];
  colors?: string[];
  sizes?: string[];
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  price?: number;
  discountPrice?: number;
  stock?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  materials?: string[];
  colors?: string[];
  sizes?: string[];
  categoryId?: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'price' | 'rating' | 'sales';
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  vendorId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  materials?: string;
  colors?: string;
  sizes?: string;
}

// Order Service
export interface OrderItem {
  productId: string;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    material?: string;
  };
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  promoCode?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  startDate?: string;
  endDate?: string;
  minTotal?: number;
  maxTotal?: number;
  search?: string;
}

// Vendor Service
export interface CreateVendorProfileData {
  businessName: string;
  description: string;
  logo?: string;
  banner?: string;
  address: string;
  phone: string;
  website?: string;
  businessLicense?: string;
  taxId?: string;
}

export interface VendorQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'businessName' | 'rating' | 'totalSales';
  sortOrder?: 'asc' | 'desc';
  isVerified?: boolean;
  search?: string;
}

// Category Service
export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  parentId?: string;
  includeChildren?: boolean;
  search?: string;
}

class MarketplaceService {
  // ===== PRODUCT METHODS =====
  
  async getProducts(params?: ProductQueryParams) {
    const response = await api.get('/api/marketplace/products', { params });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await api.get(`/api/marketplace/products/${id}`);
    return response.data;
  }

  async createProduct(data: CreateProductData) {
    const response = await api.post('/api/marketplace/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: UpdateProductData) {
    const response = await api.put(`/api/marketplace/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await api.delete(`/api/marketplace/products/${id}`);
    return response.data;
  }

  async getFeaturedProducts(limit?: number) {
    const response = await api.get('/api/marketplace/products/featured', {
      params: { limit },
    });
    return response.data;
  }

  async getPopularProducts(limit?: number) {
    const response = await api.get('/api/marketplace/products/popular', {
      params: { limit },
    });
    return response.data;
  }

  async searchProducts(query: string, filters?: Partial<ProductQueryParams>) {
    const response = await api.get('/api/marketplace/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  }

  async getProductsByCategory(categoryId: string, limit?: number) {
    const response = await api.get(`/api/marketplace/products/category/${categoryId}`, {
      params: { limit },
    });
    return response.data;
  }

  async getVendorProducts(vendorId: string, params?: ProductQueryParams) {
    const response = await api.get(`/api/marketplace/products/vendor/${vendorId}`, {
      params,
    });
    return response.data;
  }

  async getMyProducts(params?: ProductQueryParams) {
    const response = await api.get('/api/marketplace/products/my-products', {
      params,
    });
    return response.data;
  }

  async getProductFilters() {
    const response = await api.get('/api/marketplace/products/filters');
    return response.data;
  }

  // ===== ORDER METHODS =====

  async validateCart(items: OrderItem[], promoCode?: string) {
    const response = await api.post('/api/marketplace/orders/validate-cart', {
      items,
      promoCode,
    });
    return response.data;
  }

  async createOrder(data: CreateOrderData) {
    const response = await api.post('/api/marketplace/orders', data);
    return response.data;
  }

  async getOrders(params?: OrderQueryParams) {
    const response = await api.get('/api/marketplace/orders', { params });
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await api.get(`/api/marketplace/orders/${id}`);
    return response.data;
  }

  async getMyOrders(params?: OrderQueryParams) {
    const response = await api.get('/api/marketplace/orders/my-orders', { params });
    return response.data;
  }

  async getRecentOrders(limit?: number) {
    const response = await api.get('/api/marketplace/orders/recent', {
      params: { limit },
    });
    return response.data;
  }

  async cancelOrder(id: string, reason: string, requestRefund: boolean = true) {
    const response = await api.post(`/api/marketplace/orders/${id}/cancel`, {
      reason,
      requestRefund,
    });
    return response.data;
  }

  async getOrderSummary() {
    const response = await api.get('/api/marketplace/orders/summary');
    return response.data;
  }

  // ===== VENDOR METHODS =====

  async createVendorProfile(data: CreateVendorProfileData) {
    const response = await api.post('/api/marketplace/vendors/profile', data);
    return response.data;
  }

  async getVendorProfiles(params?: VendorQueryParams) {
    const response = await api.get('/api/marketplace/vendors', { params });
    return response.data;
  }

  async getVendorById(id: string) {
    const response = await api.get(`/api/marketplace/vendors/${id}`);
    return response.data;
  }

  async getMyVendorProfile() {
    const response = await api.get('/api/marketplace/vendors/my-profile');
    return response.data;
  }

  async updateVendorProfile(id: string, data: Partial<CreateVendorProfileData>) {
    const response = await api.put(`/api/marketplace/vendors/profile/${id}`, data);
    return response.data;
  }

  async getVendorDashboard() {
    const response = await api.get('/api/marketplace/vendors/dashboard');
    return response.data;
  }

  // ===== CATEGORY METHODS =====

  async getCategories(params?: CategoryQueryParams) {
    const response = await api.get('/api/marketplace/categories', { params });
    return response.data;
  }

  async getCategoryById(id: string) {
    const response = await api.get(`/api/marketplace/categories/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryData) {
    const response = await api.post('/api/marketplace/categories', data);
    return response.data;
  }

  async updateCategory(id: string, data: Partial<CreateCategoryData>) {
    const response = await api.put(`/api/marketplace/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await api.delete(`/api/marketplace/categories/${id}`);
    return response.data;
  }
}

export default new MarketplaceService();