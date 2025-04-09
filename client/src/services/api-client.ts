import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { config } from '../config';

import { API_PREFIX } from '@shared/constants/network';
import { AnyObject } from '@shared/types/general';

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  requestId?: string;
}

export interface ApiResponse<T = AnyObject> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  data?: AnyObject;
}

export class ApiClient {
  private instance: AxiosInstance;
  private cancelTokens: Map<string, CancelTokenSource> = new Map();

  constructor(clientConfig: ApiClientConfig = {}) {
    this.instance = axios.create({
      baseURL: `${clientConfig.baseURL || config.baseUrl}/${API_PREFIX}`,
      timeout: clientConfig.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...clientConfig.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this.handleError(error as AxiosError))
    );
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data as AnyObject,
    };

    if (error.response) {
      // Server responded with a status code outside of 2xx range
      apiError.message = error.response.data && typeof error.response.data === 'object' 
        ? ((error.response.data as AnyObject)?.message as string) || `Request failed with status code ${error.response.status}`
        : `Request failed with status code ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'No response received from server';
    } else {
      // Error setting up the request
      apiError.message = error.message;
    }

    if (error.code) {
      apiError.code = error.code;
    }

    return apiError;
  }

  private createCancelToken(requestId?: string): CancelTokenSource {
    const source = axios.CancelToken.source();
    if (requestId) {
      // Cancel previous request with same ID if exists
      this.cancelRequest(requestId);
      this.cancelTokens.set(requestId, source);
    }
    return source;
  }

  public cancelRequest(requestId: string): void {
    const source = this.cancelTokens.get(requestId);
    if (source) {
      source.cancel(`Request with ID ${requestId} was cancelled`);
      this.cancelTokens.delete(requestId);
    }
  }

  public async get<T = AnyObject>(
    url: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      if (config.requestId) {
        config.cancelToken = this.createCancelToken(config.requestId).token;
      }
      const response = await this.instance.get<T>(url, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async post<T = AnyObject, D = AnyObject>(
    url: string,
    data?: D,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      if (config.requestId) {
        config.cancelToken = this.createCancelToken(config.requestId).token;
      }
      const response = await this.instance.post<T>(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  }
}

// Create default instance
export const apiClient = new ApiClient();

// Export factory function for creating custom instances
export const createApiClient = (config: ApiClientConfig = {}): ApiClient => {
  return new ApiClient(config);
};
