import apiClient from './axiosConfig';

// Types
export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
  };
  products: {
    total: number;
    categories: {
      snacks: number;
      chocolates: number;
      cosmetics: number;
      dry_fruits: number;
      plastic_items: number;
      utensils: number;
      appliances: number;
    };
  };
  users: {
    total: number;
    customers: number;
    admins: number;
  };
  coupons: {
    total: number;
    active: number;
  };
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: {
    stats: DashboardStats;
  };
}

export interface UsersResponse {
  status: string;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface UpdateUserRoleRequest {
  role: 'customer' | 'admin';
}

export interface UpdateUserRoleResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

export interface RecentOrdersResponse {
  status: string;
  message: string;
  data: {
    orders: any[]; // Using any[] for simplicity, can be typed properly later
  };
}

export interface LowStockProductsResponse {
  status: string;
  message: string;
  data: {
    products: any[]; // Using any[] for simplicity, can be typed properly later
    threshold: number;
    count: number;
  };
}

// Admin API functions
export const adminApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // Get all users
  getAllUsers: async (page = 1, limit = 50): Promise<UsersResponse> => {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  // Update user role
  updateUserRole: async (id: string, role: 'customer' | 'admin'): Promise<UpdateUserRoleResponse> => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 10): Promise<RecentOrdersResponse> => {
    const response = await apiClient.get('/admin/orders/recent', {
      params: { limit },
    });
    return response.data;
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10): Promise<LowStockProductsResponse> => {
    const response = await apiClient.get('/admin/products/low-stock', {
      params: { threshold },
    });
    return response.data;
  },
};

export default adminApi;









