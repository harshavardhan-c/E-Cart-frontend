import apiClient from './axiosConfig';

// Types
export interface OrderItem {
  productId: string;
  quantity: number;
  category?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  delivery_address?: string;
  delivery_partner?: string;
  created_at: string;
  users?: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface CreateOrderRequest {
  items: OrderItem[];
  total_amount: number;
  delivery_address?: string;
}

export interface OrdersResponse {
  status: string;
  message: string;
  data: {
    orders: Order[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface OrderResponse {
  status: string;
  message: string;
  data: {
    order: Order;
  };
}

export interface OrderStats {
  total: number;
  pending: number;
  shipped: number;
  delivered: number;
  totalRevenue: number;
}

export interface OrderStatsResponse {
  status: string;
  message: string;
  data: {
    stats: OrderStats;
  };
}

// Order API functions
export const ordersApi = {
  // Create new order - matches backend route POST /api/orders
  createOrder: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders - matches backend route GET /api/orders/user/:userId
  getUserOrders: async (userId: string, page = 1, limit = 20): Promise<OrdersResponse> => {
    const response = await apiClient.get(`/orders/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (page = 1, limit = 50, status?: string): Promise<OrdersResponse> => {
    const response = await apiClient.get('/orders', {
      params: { page, limit, status },
    });
    return response.data;
  },

  // Update order status (Admin only) - matches backend route PUT /api/admin/orders/:id
  updateOrderStatus: async (id: string, status: string, deliveryPartner?: string): Promise<OrderResponse> => {
    const response = await apiClient.put(`/admin/orders/${id}`, { status, delivery_partner: deliveryPartner });
    return response.data;
  },

  // Get order statistics (Admin only)
  getOrderStats: async (): Promise<OrderStatsResponse> => {
    const response = await apiClient.get('/admin/orders/stats/overview');
    return response.data;
  },

  // Delete order (Admin only)
  deleteOrder: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`/admin/orders/${id}`);
    return response.data;
  },
};

export default ordersApi;
