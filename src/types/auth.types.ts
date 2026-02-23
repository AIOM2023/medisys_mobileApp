export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginSuccessResponse {
  token: string;
  message: string;
}

export interface ErrorResponse {
  httpStatus: number;
  success: boolean;
  message: string;
  data: {
    errorCode: string | null;
    message: string | null;
    httpStatus: number | null;
  };
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
