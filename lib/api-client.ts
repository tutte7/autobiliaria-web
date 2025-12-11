const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

if (!BASE_URL) {
  console.warn("⚠️ La variable NEXT_PUBLIC_API_URL no está definida.");
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Cliente HTTP personalizado para manejar peticiones a la API
 * Centraliza la configuración de URL base y Headers.
 */
export const apiClient = {
  async get<T>(endpoint: string, { params, ...customConfig }: FetchOptions = {}): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      // @ts-ignore - HeadersInit type complexity
      ...customConfig.headers,
    };

    // Construir URL con Query Params si existen
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        ...customConfig,
        headers,
      });

      if (!response.ok) {
        // Manejo básico de errores HTTP
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || errorBody.error || `Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error en petición a ${endpoint}:`, error);
      throw error;
    }
  },
};

