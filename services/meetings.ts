import adminApi from './admin-api';

// Tipos
export interface Reunion {
  id: number;
  fecha: string;
  hora: string;
  ubicacion: 'falucho' | 'playa_grande';
  ubicacion_display: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  estado_display: string;
  coordinador: number;
  coordinador_nombre: string;
  comprador_nombre: string;
  vendedor: number | null;
  vendedor_nombre: string | null;
  vendedor_texto: string;
  vendedor_display: string;
  vehiculo: number | null;
  vehiculo_display: string | null;
  vehiculo_titulo: string | null;
  vehiculo_patente: string | null;
  notas: string;
  creada_por: number;
  creada_por_nombre: string;
  created_at: string;
  updated_at: string;
}

export interface ReunionCreate {
  fecha: string;
  hora: string;
  ubicacion: 'falucho' | 'playa_grande';
  coordinador: number;
  comprador_nombre: string;
  vendedor?: number | null;
  vendedor_texto?: string;
  vehiculo?: number | null;
  notas?: string;
  estado?: 'pendiente' | 'completada' | 'cancelada';
}

export interface ReunionEstadisticas {
  hoy: number;
  manana: number;
  semana: number;
  mes: number;
}

// API Functions
export const meetingsService = {
  /**
   * Obtener lista de reuniones con filtros opcionales
   */
  async getAll(params?: Record<string, any>): Promise<Reunion[]> {
    const response = await adminApi.get('/api/reuniones/', { params });
    return response.data;
  },

  /**
   * Obtener reuniones de una fecha específica
   */
  async getByDate(fecha: string): Promise<Reunion[]> {
    const response = await adminApi.get(`/api/reuniones/por-fecha/${fecha}/`);
    return response.data;
  },

  /**
   * Obtener estadísticas de reuniones
   */
  async getEstadisticas(): Promise<ReunionEstadisticas> {
    const response = await adminApi.get('/api/reuniones/estadisticas/');
    return response.data;
  },

  /**
   * Obtener una reunión por ID
   */
  async getById(id: number): Promise<Reunion> {
    const response = await adminApi.get(`/api/reuniones/${id}/`);
    return response.data;
  },

  /**
   * Crear una nueva reunión
   */
  async create(data: ReunionCreate): Promise<Reunion> {
    const response = await adminApi.post('/api/reuniones/', data);
    return response.data;
  },

  /**
   * Actualizar una reunión
   */
  async update(id: number, data: Partial<ReunionCreate>): Promise<Reunion> {
    const response = await adminApi.patch(`/api/reuniones/${id}/`, data);
    return response.data;
  },

  /**
   * Eliminar una reunión
   */
  async delete(id: number): Promise<void> {
    await adminApi.delete(`/api/reuniones/${id}/`);
  },

  /**
   * Marcar reunión como completada
   */
  async marcarCompletada(id: number): Promise<Reunion> {
    const response = await adminApi.patch(`/api/reuniones/${id}/marcar-completada/`);
    return response.data;
  },

  /**
   * Marcar reunión como cancelada
   */
  async marcarCancelada(id: number): Promise<Reunion> {
    const response = await adminApi.patch(`/api/reuniones/${id}/marcar-cancelada/`);
    return response.data;
  },
};

export default meetingsService;
