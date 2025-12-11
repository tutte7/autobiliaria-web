import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback for dev

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log(`Intentando login a: ${BASE_URL}/api/auth/login/`); // Debug log

      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // El backend requiere específicamente el campo 'email'
        body: JSON.stringify({
          email: credentials.username || credentials.email,
          password: credentials.password
        }),
      });

      if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;
        let errorDetail = '';

        try {
          const text = await response.text();
          try {
            const json = JSON.parse(text);
            errorDetail = json.detail || JSON.stringify(json);
          } catch {
            // Si falla el parseo a JSON, usamos el texto plano (podría ser HTML de un 404/500)
            errorDetail = text.slice(0, 200); // Limitamos longitud por seguridad visual
          }
        } catch (e) {
          errorDetail = 'No se pudo leer la respuesta del servidor';
        }

        // Si el detalle está vacío, ponemos algo genérico
        if (!errorDetail || errorDetail === '{}') {
           errorDetail = 'Error desconocido (respuesta vacía)';
        }

        throw new Error(`Error ${status} (${statusText}): ${errorDetail}`);
      }

      const data: AuthResponse = await response.json();

      // Guardar token en cookies
      // admin_access_token
      Cookies.set('admin_access_token', data.access, { expires: 1 }); // 1 día de expiración
      Cookies.set('admin_refresh_token', data.refresh, { expires: 7 }); // 7 días

      return data;
    } catch (error) {
      console.error('Login error full:', error);
      throw error;
    }
  },

  logout() {
    Cookies.remove('admin_access_token');
    Cookies.remove('admin_refresh_token');
    window.location.href = '/auth/login';
  },

  isAuthenticated() {
    return !!Cookies.get('admin_access_token');
  }
};
