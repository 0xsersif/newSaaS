import axios, { type AxiosInstance, type AxiosError } from 'axios';

interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        throw error;
      }
    );
  }

  // Auth endpoints
  register(data: any): Promise<ApiResponse> {
    return this.client.post('/auth/register', data);
  }

  login(email: string, password: string): Promise<ApiResponse> {
    return this.client.post('/auth/login', { email, password });
  }

  verifyOtp(userId: number, otp: string): Promise<ApiResponse> {
    return this.client.post('/auth/verify-otp', { user_id: userId, otp });
  }

  resendOtp(email: string): Promise<ApiResponse> {
    return this.client.post('/auth/resend-otp', { email });
  }

  logout(): Promise<ApiResponse> {
    return this.client.post('/auth/logout');
  }

  // Store endpoints
  getPlans(): Promise<any[]> {
    return this.client.get('/stores/plans');
  }

  createStore(storeName: string, planId: number): Promise<ApiResponse> {
    return this.client.post('/stores', { store_name: storeName, plan_id: planId });
  }

  getStore(): Promise<ApiResponse> {
    return this.client.get('/stores/current');
  }

  updateStore(data: any): Promise<ApiResponse> {
    return this.client.put('/stores/current', data);
  }

  connectCustomDomain(domain: string): Promise<ApiResponse> {
    return this.client.post('/stores/current/custom-domain', { custom_domain: domain });
  }

  renewSubscription(months: number): Promise<ApiResponse> {
    return this.client.post('/stores/current/renew-subscription', { months });
  }

  // Product endpoints
  getProducts(page: number = 1): Promise<any> {
    return this.client.get(`/products?page=${page}`);
  }

  createProduct(data: any): Promise<ApiResponse> {
    return this.client.post('/products', data);
  }

  updateProduct(id: number, data: any): Promise<ApiResponse> {
    return this.client.put(`/products/${id}`, data);
  }

  deleteProduct(id: number): Promise<ApiResponse> {
    return this.client.delete(`/products/${id}`);
  }

  // Order endpoints
  getOrders(filters?: any): Promise<any> {
    return this.client.get('/orders', { params: filters });
  }

  createOrder(data: any): Promise<ApiResponse> {
    return this.client.post('/orders', data);
  }

  getOrder(id: number): Promise<ApiResponse> {
    return this.client.get(`/orders/${id}`);
  }

  updateOrderStatus(id: number, status: string): Promise<ApiResponse> {
    return this.client.put(`/orders/${id}/status`, { status });
  }

  // Customer endpoints
  getCustomers(): Promise<any> {
    return this.client.get('/customers');
  }

  getCustomer(id: number): Promise<ApiResponse> {
    return this.client.get(`/customers/${id}`);
  }

  getCustomerOrders(id: number): Promise<any> {
    return this.client.get(`/customers/${id}/orders`);
  }

  // Statistics endpoints
  getTenantStats(): Promise<ApiResponse> {
    return this.client.get('/statistics/tenant');
  }

  getSuperAdminStats(): Promise<ApiResponse> {
    return this.client.get('/statistics/admin');
  }
}

export default new ApiClient();
