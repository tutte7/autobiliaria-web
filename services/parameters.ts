import { apiClient } from "@/lib/api-client";

export interface Parameter {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export interface ModelParameter extends Parameter {
  marca: number;
  marca_nombre: string;
}

// Helper para normalizar respuestas de API (Array directo vs Paginación DRF)
function handleListResponse<T>(response: any): T[] {
  if (Array.isArray(response)) {
    return response;
  }
  // Soporte para respuestas paginadas estándar de Django Rest Framework
  if (response && Array.isArray(response.results)) {
    return response.results;
  }
  // console.warn("⚠️ [API Warning] Formato de respuesta inesperado en parámetros:", response);
  return [];
}

export const parametersService = {
  /**
   * Obtiene la lista de marcas activas (PÚBLICO).
   */
  getBrands: async (): Promise<Parameter[]> => {
    try {
      const data = await apiClient.get<any>("/api/parametros/marcas/", {
        params: { activo: true, ordering: "nombre", limit: 1000 },
      });
      return handleListResponse<Parameter>(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  },

  /**
   * Obtiene la lista de modelos, opcionalmente filtrada por marca (PÚBLICO).
   */
  getModels: async (brandId?: number): Promise<ModelParameter[]> => {
    try {
      const params: any = { activo: true, ordering: "nombre", limit: 2000 };
      if (brandId) params.marca = brandId;

      const data = await apiClient.get<any>("/api/parametros/modelos/", {
        params,
      });
      return handleListResponse<ModelParameter>(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      return [];
    }
  },

  /**
   * Obtiene la lista de tipos de combustible (PÚBLICO).
   */
  getFuels: async (): Promise<Parameter[]> => {
    try {
      const data = await apiClient.get<any>("/api/parametros/combustibles/", {
        params: { activo: true, limit: 100 },
      });
      return handleListResponse<Parameter>(data);
    } catch (error) {
      console.error("Error fetching fuels:", error);
      return [];
    }
  },

  /**
   * Obtiene la lista de tipos de transmisión (cajas) (PÚBLICO).
   */
  getTransmissions: async (): Promise<Parameter[]> => {
    try {
      const data = await apiClient.get<any>("/api/parametros/cajas/", {
        params: { activo: true, limit: 100 },
      });
      return handleListResponse<Parameter>(data);
    } catch (error) {
      console.error("Error fetching transmissions:", error);
      return [];
    }
  },

  /**
   * Obtiene la lista de segmentos (PÚBLICO).
   */
  getSegments: async (): Promise<Parameter[]> => {
    try {
      const data = await apiClient.get<any>("/api/parametros/segmentos/", {
        params: { activo: true, limit: 100 },
      });
      return handleListResponse<Parameter>(data);
    } catch (error) {
      console.error("Error fetching segments:", error);
      return [];
    }
  },

  /**
   * Obtiene la lista de estados (0km, Usado).
   * NOTA: Según documentación, este endpoint podría requerir autenticación.
   * Si falla por auth (401/403), devolvemos valores básicos para no romper el frontend público.
   */
  getStates: async (): Promise<Parameter[]> => {
    try {
      const data = await apiClient.get<any>("/api/parametros/estados/", {
        params: { activo: true, limit: 100 },
      });
      return handleListResponse<Parameter>(data);
    } catch (error: any) {
      // Si el error es de autenticación o permisos, usamos fallback
      const status = error.status || (error.message && error.message.includes('401')) || (error.message && error.message.includes('403'));
      
      if (status || error.toString().includes('401') || error.toString().includes('403')) {
        console.warn("⚠️ getStates requiere auth. Usando fallback local.");
        return [
          { id: 1, nombre: '0km', activo: true, orden: 1 },
          { id: 2, nombre: 'Usado', activo: true, orden: 2 }
        ];
      }
      
      console.error("Error fetching states:", error);
      return [];
    }
  },

  /**
   * Obtiene la lista de monedas (Probablemente Privado, pero útil si se necesita).
   */
  getCurrencies: async (): Promise<Parameter[]> => {
    try {
      const data = await apiClient.get<any>("/api/parametros/monedas/", {
        params: { activo: true, limit: 100 },
      });
      return handleListResponse<Parameter>(data);
    } catch (error) {
       console.error("Error fetching currencies:", error);
       return [];
    }
  }
};
