import { apiClient } from '@/shared/api/client';

const BASE_URL = process.env.NEXT_PUBLIC_IDENTITY_API_URL;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_IDENTITY_API_URL is not configured');
  }

  const res = await apiClient.post('/auth/login', data, {
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data;
}