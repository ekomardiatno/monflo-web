import { apiFetch } from './api';
import type { AuthResponse, User } from '@/types';

export function loginApi(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

export function registerApi(email: string, name: string, password: string) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
    skipAuth: true,
  });
}

export function googleAuthApi(accessToken: string) {
  return apiFetch<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
    skipAuth: true,
  });
}

export function logoutApi(refreshToken: string) {
  return apiFetch<{ message: string }>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function getMeApi() {
  return apiFetch<User>('/auth/me');
}

export function changeNameApi(name: string) {
  return apiFetch<User>('/auth/change-name', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function setPasswordApi(password: string) {
  return apiFetch<{ message: string }>('/auth/set-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function changePasswordApi(currentPassword: string, newPassword: string) {
  return apiFetch<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function forgotPasswordApi(email: string) {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

export function resetPasswordApi(token: string, email: string, password: string) {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, email, password }),
    skipAuth: true,
  });
}
