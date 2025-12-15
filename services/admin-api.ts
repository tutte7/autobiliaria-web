import axios from 'axios';
import Cookies from 'js-cookie';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Inyecta el token
adminApi.interceptors.request.use(
  (config) => {
    // Usamos la cookie definida en tu auth.ts
    const token = Cookies.get('admin_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: Maneja errores 401 y Refresh Token
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es un error 401 y no hemos reintentado todavía
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('admin_refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Intentamos renovar el token
        const { data } = await axios.post(`${API_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        // Actualizamos las cookies con los nuevos tokens
        Cookies.set('admin_access_token', data.access, { expires: 1 });
        // Algunos backends devuelven un nuevo refresh token, otros no. Si viene, lo actualizamos.
        if (data.refresh) {
          Cookies.set('admin_refresh_token', data.refresh, { expires: 7 });
        }

        // Actualizamos el header del request original y reintentamos
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return adminApi(originalRequest);

      } catch (refreshError) {
        // Si falla la renovación, cerramos sesión y redirigimos
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;

