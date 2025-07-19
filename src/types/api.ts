// Enhanced API Types with better error handling and response structure
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp: string;
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface FilterOptions {
  label: string;
  value: string;
  count?: number;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  responseTime?: number;
}