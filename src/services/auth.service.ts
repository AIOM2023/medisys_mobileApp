import { API_CONFIG } from '../config/api.config';
import { LoginRequest, LoginSuccessResponse } from '../types/auth.types';
import { saveToken, removeToken } from '../utils/storage.util';
import { apiUtil } from '../utils/api.util';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginSuccessResponse> {
    const response = await apiUtil.post<LoginSuccessResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials,
    );

    if (response.data.token) {
      await saveToken(response.data.token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    await removeToken();
  }
}

export const authService = new AuthService();
