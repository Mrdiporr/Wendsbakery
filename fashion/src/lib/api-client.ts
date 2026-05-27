import { ErrorResponse } from './types';

export interface ApiClientConfig {
  baseUrl: string;
  storeId: string;
  apiKey?: string;
}

export class ApiClient {
  private baseUrl: string;
  private storeId: string;
  private apiKey?: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.storeId = config.storeId;
    this.apiKey = config.apiKey;
  }

  private getHeaders(idempotencyKey?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Store-ID': this.storeId,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    idempotencyKey?: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(idempotencyKey),
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData: ErrorResponse;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'An unknown error occurred while contacting the server.' };
        }
        
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      if (response.status === 204) return {} as T;
      return await response.json() as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  async getProducts(params?: Record<string, string>): Promise<any> {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/api/v1/products${qs}`);
  }

  async getProduct(id: string | number): Promise<any> {
    return this.request<any>(`/api/v1/products/${id}`);
  }

  async getCategories(): Promise<any[]> {
    return this.request<any[]>('/api/v1/categories');
  }

  async createOrder(orderPayload: any, idempotencyKey: string): Promise<any> {
    return this.request<any>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }, idempotencyKey);
  }
}

// Configured for Wardrobe Sensation (Fashion)
export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8000',
  storeId: process.env.NEXT_PUBLIC_STORE_ID || 'fashion',
  apiKey: process.env.STOREFRONT_API_KEY,
});
