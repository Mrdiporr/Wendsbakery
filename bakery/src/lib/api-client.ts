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

  /**
   * Helper method to standardize headers for requests.
   */
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

  /**
   * Internal fetch wrapper to handle JSON and standardized errors.
   */
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

      // For 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json() as T;
    } catch (error) {
      // Standardize network/fetch errors
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  // --- Products & Categories (Read-Only from Storefront) ---

  async getProducts(params?: Record<string, string>): Promise<any[]> {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any[]>(`/api/v1/products${qs}`);
  }

  async getProduct(id: string | number): Promise<any> {
    return this.request<any>(`/api/v1/products/${id}`);
  }

  async getCategories(): Promise<any[]> {
    return this.request<any[]>('/api/v1/categories');
  }

  // --- Orders & Checkout (Bidirectional) ---

  /**
   * Submits a new order to the Admin Dashboard.
   * Uses an Idempotency-Key to prevent duplicate orders on network retries.
   */
  async createOrder(orderPayload: any, idempotencyKey: string): Promise<any> {
    return this.request<any>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }, idempotencyKey);
  }

  /**
   * Specialized endpoint for custom orders / quotes (Wendy's Bakehouse)
   */
  async submitCustomQuote(quotePayload: any): Promise<any> {
    return this.request<any>('/api/v1/quotes', {
      method: 'POST',
      body: JSON.stringify(quotePayload),
    });
  }
}

// Export a singleton instance configured for this specific environment
export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8000',
  storeId: process.env.NEXT_PUBLIC_STORE_ID || 'bakery', // Defaults to bakery, but should be set in .env
  apiKey: process.env.STOREFRONT_API_KEY, // Server-side only
});
