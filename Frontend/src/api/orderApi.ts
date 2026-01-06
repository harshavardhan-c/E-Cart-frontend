import apiClient from './axiosConfig';

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  delivery_address: string;
  payment_status: string;
  status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
}

export interface OrderResponse {
  status: string;
  message: string;
  data: Order[];
}

export const orderApi = {
  // Get my orders
  getMyOrders: async (): Promise<OrderResponse> => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<{ data: Order }> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create order
  createOrder: async (deliveryAddress: string, paymentMethod: string = 'razorpay'): Promise<{ data: Order }> => {
    const response = await apiClient.post('/orders', { deliveryAddress, paymentMethod });
    return response.data;
  },

  // Update order
  updateOrder: async (orderId: string, updateData: any): Promise<{ data: Order }> => {
    const response = await apiClient.put(`/orders/${orderId}`, updateData);
    return response.data;
  }
};

export default orderApi;











