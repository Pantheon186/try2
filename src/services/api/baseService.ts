// Base Service for API Operations
import { config } from '../../config/environment';
import { AppErrorHandler, RetryHandler } from '../../utils/errorHandler';
import { ApiResponse, PaginatedResponse } from '../../types';

export abstract class BaseService {
  protected baseUrl: string;
  protected timeout: number;
  protected maxRetries: number;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.timeout = config.app.apiTimeout;
    this.maxRetries = config.app.maxRetries;
  }

  // Generic API request method
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      ...options,
    };

    try {
      const response = await RetryHandler.withRetry(
        () => this.fetchWithTimeout(url, defaultOptions),
        this.maxRetries
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, `API Request: ${endpoint}`);
      
      return {
        data: null as any,
        success: false,
        error: appError.message,
      };
    }
  }

  // Fetch with timeout
  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Get authentication headers
  protected getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Generic CRUD operations
  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  protected async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  protected async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  protected async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Paginated requests
  protected async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    limit: number = config.ui.itemsPerPage
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<{
      data: T[];
      total: number;
      page: number;
      limit: number;
    }>(`${endpoint}?page=${page}&limit=${limit}`);

    if (response.success && response.data) {
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        hasMore: response.data.page * response.data.limit < response.data.total,
      };
    }

    return {
      data: [],
      total: 0,
      page: 1,
      limit,
      hasMore: false,
    };
  }

  // Search with filters
  protected async search<T>(
    endpoint: string,
    filters: Record<string, any>
  ): Promise<ApiResponse<T[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const url = queryParams.toString() 
      ? `${endpoint}?${queryParams.toString()}`
      : endpoint;

    return this.get<T[]>(url);
  }
}

