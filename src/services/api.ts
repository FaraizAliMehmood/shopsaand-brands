import type { ApiResponse, PaginatedResponse, LoginCredentials, RegisterData, UpdateProfileData, LoginResponse, ProfileResponse, RefreshTokenResponse } from '../types/index';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      console.log('Uploading file to:', url);
      console.log('Request headers:', config.headers);
      
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Upload failed with status:', response.status);
        console.error('Error response:', data);
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Create and export API service instance
export const apiService = new ApiService();

// Auth API endpoints
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiService.post<LoginResponse>('/auth/login', credentials),
  
  register: (userData: RegisterData) =>
    apiService.post<ApiResponse>('/auth/register', userData),
  
  logout: () =>
    apiService.post<ApiResponse>('/auth/logout'),
  
  refreshToken: () =>
    apiService.post<RefreshTokenResponse>('/auth/refresh-token'),
  
  forgotPassword: (email: string) =>
    apiService.post<ApiResponse>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiService.post<ApiResponse>('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    apiService.get<ApiResponse>(`/auth/verify-email/${token}`),
  
  resendVerification: (email: string) =>
    apiService.post<ApiResponse>('/auth/resend-verification', { email }),
  
  getProfile: () =>
    apiService.get<ProfileResponse>('/auth/profile'),
  
  updateProfile: (data: UpdateProfileData) =>
    apiService.put<ProfileResponse>('/auth/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiService.post<ApiResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    }),
};

// User API endpoints
export const userApi = {
  getProfile: () =>
    apiService.get<ApiResponse>('/users/profile'),
  
  updateProfile: (data: UpdateProfileData) =>
    apiService.put<ApiResponse>('/users/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiService.put<ApiResponse>('/users/change-password', {
      currentPassword,
      newPassword,
    }),
  
  getStats: () =>
    apiService.get<ApiResponse>('/users/stats'),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiService.uploadFile<ApiResponse>('/users/avatar', formData);
  },
  
  getSettings: () =>
    apiService.get<ApiResponse>('/users/settings'),
  
  updateSettings: (settings: any) =>
    apiService.put<ApiResponse>('/users/settings', settings),
  
  deactivateAccount: () =>
    apiService.put<ApiResponse>('/users/deactivate'),
  
  getActivity: () =>
    apiService.get<ApiResponse>('/users/activity'),
};

// Product API endpoints
export const productApi = {
  getProducts: (
    page?: number,
    limit?: number) => {
    // const queryParams = new URLSearchParams();
    // if (params) {
    //   console.log('API Service - Received params:', params);
    //   Object.entries(params).forEach(([key, value]) => {
    //     console.log(`API Service - Processing ${key}: ${value} (type: ${typeof value})`);
    //     if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
    //       queryParams.append(key, value.toString());
    //       console.log(`API Service - Added ${key}=${value} to query`);
    //     } else {
    //       console.log(`API Service - Skipped ${key}=${value} (empty/null/undefined)`);
    //     }
    //   });
    // }
    // const query = queryParams.toString();
    // console.log('API Service - Final query string:', query);
    return apiService.get<PaginatedResponse<any>>(`/products?page=${page}&limit=${limit}`);
  },
  
  getProduct: (id: string) =>
    apiService.get<ApiResponse>(`/products/${id}`),
  
  createProduct: (formData: FormData) =>
    apiService.uploadFile<ApiResponse>('/products/add', formData),
  
  updateProduct: (id: string, data: any) =>
    
    apiService.put<ApiResponse>(`/products/${id}`, data),
  
  deleteProduct: (id: string) =>
    apiService.delete<ApiResponse>(`/products/${id}`),
  
  searchProducts: (query: string) =>
    apiService.get<ApiResponse>(`/products/search?q=${encodeURIComponent(query)}`),
  
  getFeaturedProducts: (query: string) =>
    apiService.get<ApiResponse>(`/products/featured?limit=${encodeURIComponent(query)}`),
  
  getProductsByCategory: (category: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiService.get<ApiResponse>(`/products/category/${category}${query ? `?${query}` : ''}`);
  },
  
  updateProductStock: (id: string, stock: number) =>
    apiService.patch<ApiResponse>(`/products/${id}/stock`, { stock }),
  
  toggleProductStatus: (id: string) =>
    apiService.patch<ApiResponse>(`/products/${id}/status`),
  
  getProductAnalytics: (id: string) =>
    apiService.get<ApiResponse>(`/products/${id}/analytics`),
};

// Order API endpoints
export const orderApi = {
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiService.get<PaginatedResponse<any>>(`/orders${query ? `?${query}` : ''}`);
  },
  
  getOrder: (id: string) =>
    apiService.get<ApiResponse>(`/orders/${id}`),
  
  createOrder: (data: any) =>
    apiService.post<ApiResponse>('/orders', data),
  
  updateOrder: (id: string, data: any) =>
    apiService.put<ApiResponse>(`/orders/${id}`, data),
  
  deleteOrder: (id: string) =>
    apiService.delete<ApiResponse>(`/orders/${id}`),
  
  getOrderStats: () =>
    apiService.get<ApiResponse>('/orders/stats'),
};

// Payment API endpoints
export const paymentApi = {
  getPayments: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiService.get<PaginatedResponse<any>>(`/payments${query ? `?${query}` : ''}`);
  },
  
  getPayment: (id: string) =>
    apiService.get<ApiResponse>(`/payments/${id}`),
  
  createPayment: (data: any) =>
    apiService.post<ApiResponse>('/payments', data),
  
  updatePayment: (id: string, data: any) =>
    apiService.put<ApiResponse>(`/payments/${id}`, data),
  
  deletePayment: (id: string) =>
    apiService.delete<ApiResponse>(`/payments/${id}`),
  
  getPaymentStats: () =>
    apiService.get<ApiResponse>('/payments/stats'),
  
  processPayment: (id: string) =>
    apiService.post<ApiResponse>(`/payments/${id}/process`),
};

// Dashboard API endpoints
export const dashboardApi = {
  getStats: () =>
    apiService.get<ApiResponse>('/dashboard/stats'),
  
  getRecentOrders: (limit?: number) =>
    apiService.get<ApiResponse>(`/dashboard/recent-orders${limit ? `?limit=${limit}` : ''}`),
  
  getRecentProducts: (limit?: number) =>
    apiService.get<ApiResponse>(`/dashboard/recent-products${limit ? `?limit=${limit}` : ''}`),
  
  getRecentPayments: (limit?: number) =>
    apiService.get<ApiResponse>(`/dashboard/recent-payments${limit ? `?limit=${limit}` : ''}`),
};

// Notification API endpoints
export const notificationApi = {
  getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiService.get<PaginatedResponse<any>>(`/notifications${query ? `?${query}` : ''}`);
  },
  
  markAsRead: (id: string) =>
    apiService.patch<ApiResponse>(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    apiService.patch<ApiResponse>('/notifications/read-all'),
  
  deleteNotification: (id: string) =>
    apiService.delete<ApiResponse>(`/notifications/${id}`),
};

// KYC API endpoints
export const kycApi = {
  getKyc: () =>
    apiService.get<ApiResponse>('/kyc'),
  
  submitKyc: (data: any) =>
    apiService.post<ApiResponse>('/kyc', data),
  
  updateKyc: (data: any) =>
    apiService.put<ApiResponse>('/kyc', data),
  
  uploadDocument: (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    return apiService.uploadFile<ApiResponse>(`/kyc/upload/${documentType}`, formData);
  },
};

// Chat API endpoints
export const chatApi = {
  getChatRooms: () =>
    apiService.get<ApiResponse>('/chat/rooms'),
  
  getChatMessages: (roomId: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiService.get<PaginatedResponse<any>>(`/chat/rooms/${roomId}/messages${query ? `?${query}` : ''}`);
  },
  
  sendMessage: (roomId: string, message: string) =>
    apiService.post<ApiResponse>(`/chat/rooms/${roomId}/messages`, { message }),
  
  markMessagesAsRead: (roomId: string) =>
    apiService.patch<ApiResponse>(`/chat/rooms/${roomId}/read`),
  
  createChatRoom: (participantId: string) =>
    apiService.post<ApiResponse>('/chat/rooms', { participantId }),
};

export default apiService;
