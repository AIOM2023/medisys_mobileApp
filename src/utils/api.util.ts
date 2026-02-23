import { AxiosError, AxiosRequestConfig } from 'axios';
import { api } from '../services/api.service';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    console.log(
      error.response?.data?.message,
      error.message,
      error,
      error.response?.data,
      error.response?.status,
    );
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred';
    const apiError: ApiError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    };
    throw apiError;
  }
  throw new Error('Network error. Please try again.');
};

export const apiUtil = {
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api.get<T>(url, config);
      console.log('get: ', response, url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('get: ', error, url, config);
      return handleApiError(error);
    }
  },

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api.post<T>(url, data, config);
      console.log('post: ', response, url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('post: ', error, url, data, config);
      return handleApiError(error);
    }
  },
};
