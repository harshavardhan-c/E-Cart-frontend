import apiClient from './axiosConfig';

// Types
export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  expiry_date: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

export interface CouponsResponse {
  status: string;
  message: string;
  data: {
    coupons: Coupon[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface CouponResponse {
  status: string;
  message: string;
  data: {
    coupon: Coupon;
  };
}

export interface ValidateCouponRequest {
  code: string;
}

export interface ValidateCouponResponse {
  status: string;
  message: string;
  data: {
    coupon: Coupon;
  };
}

export interface CreateCouponRequest {
  code: string;
  discount_percent: number;
  expiry_date: string;
  max_uses?: number;
}

// Coupon API functions
export const couponsApi = {
  // Get active coupons - matches backend route GET /api/coupons
  getActiveCoupons: async (): Promise<CouponsResponse> => {
    const response = await apiClient.get('/coupons');
    return response.data;
  },

  // Validate coupon code
  validateCoupon: async (code: string): Promise<ValidateCouponResponse> => {
    const response = await apiClient.post('/coupons/validate', { code });
    return response.data;
  },

  // Get all coupons (Admin only)
  getAllCoupons: async (page = 1, limit = 50): Promise<CouponsResponse> => {
    const response = await apiClient.get('/admin/coupons', {
      params: { page, limit },
    });
    return response.data;
  },

  // Create coupon (Admin only) - matches backend route POST /api/admin/coupons
  createCoupon: async (couponData: CreateCouponRequest): Promise<CouponResponse> => {
    const response = await apiClient.post('/admin/coupons', couponData);
    return response.data;
  },

  // Update coupon (Admin only)
  updateCoupon: async (id: string, updateData: Partial<Coupon>): Promise<CouponResponse> => {
    const response = await apiClient.put(`/admin/coupons/${id}`, updateData);
    return response.data;
  },

  // Toggle coupon status (Admin only)
  toggleCouponStatus: async (id: string): Promise<CouponResponse> => {
    const response = await apiClient.put(`/admin/coupons/${id}/toggle`);
    return response.data;
  },

  // Delete coupon (Admin only) - matches backend route DELETE /api/admin/coupons/:id
  deleteCoupon: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`/admin/coupons/${id}`);
    return response.data;
  },
};

export default couponsApi;
