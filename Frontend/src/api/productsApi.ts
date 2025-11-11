import apiClient from './axiosConfig';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock: number;
  category: string;
  discount?: number;
  created_at: string;
  featured?: boolean;
  extra_images?: string[];
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: {
    products: Product[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface ProductResponse {
  status: string;
  message: string;
  data: {
    product: Product;
  };
}

export interface SearchResponse {
  status: string;
  message: string;
  data: {
    products: Product[];
    query: string;
    category: string;
  };
}

// ✅ Product API
export const productsApi = {
  // 🔹 Public: get all products
  getAllProducts: async (page = 1, limit = 50): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products', {
      params: { page, limit },
    });
    return response.data;
  },

  // 🔹 Public: get by category
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await apiClient.get(`/products/${category}`);
    return response.data;
  },

  // 🔹 Public: get by ID
  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // 🔹 Public: search products
  searchProducts: async (query: string, category?: string): Promise<SearchResponse> => {
    const response = await apiClient.get('/products/search', {
      params: { q: query, category },
    });
    return response.data;
  },

  // 🔹 Admin: create product
  createProduct: async (productData: Partial<Product>): Promise<ProductResponse> => {
    const response = await apiClient.post('/admin/products', productData);
    return response.data;
  },

  // 🔹 Admin: update product
  updateProduct: async (id: string, updateData: Partial<Product>): Promise<ProductResponse> => {
    const response = await apiClient.put(`/admin/products/${id}`, updateData);
    return response.data;
  },

  // 🔹 Admin: delete product
  deleteProduct: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  },

  // 🔹 Admin: update stock
  updateStock: async (id: string, quantity: number): Promise<ProductResponse> => {
    const response = await apiClient.put(`/admin/products/${id}/stock`, { quantity });
    return response.data;
  },
};

export default productsApi;
