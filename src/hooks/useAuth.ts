import { useState } from 'react';
import { authService } from '../services/auth.service';
import { LoginRequest, AuthState } from '../types/auth.types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = async (credentials: LoginRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      setAuthState({
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
};
