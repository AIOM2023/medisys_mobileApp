import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { getToken } from '../utils/storage.util';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async config => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response interceptor
    this.api.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }

  public getInstance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getInstance();
