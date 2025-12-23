import { apiClient } from "@/lib/api-client";

// Tipos auxiliares para objetos anidados
export interface BrandDetail {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export interface ModelDetail {
  id: number;
  nombre: string;
  marca: number;
  activo: boolean;
  orden: number;
}

export interface CombustibleDetail {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export interface CajaDetail {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export interface VendedorDetail {
  id: number;
  nombre: string;
  apellido: string;
  full_name: string;
  email: string;
  celular: string;
  dni: string;
  tiene_cartel: boolean;
  activo: boolean;
  location?: string; // Agregado opcional si no viene en API, para UI
}

export interface ImagenVehiculo {
  id: number;
  imagen: string;
  imagen_url: string;
  orden: number;
  es_principal: boolean;
  created_at: string;
}

// Tipo completo del detalle del vehículo
export interface ApiVehicleDetail {
  id: number;
  titulo: string;
  marca: number;
  modelo: number;
  segmento1: number;
  segmento2: number | null;
  combustible: number;
  caja: number;
  estado: number;
  condicion: number;
  moneda: number;
  vendedor_dueno: number;
  cargado_por: number;
  
  // Detalles anidados
  marca_detail: BrandDetail;
  modelo_detail: ModelDetail;
  combustible_detail: CombustibleDetail;
  caja_detail: CajaDetail;
  vendedor_detail: VendedorDetail;
  
  cargado_por_nombre: string;
  version: string;
  patente: string;
  anio: number;
  km: number;
  color: string;
  precio: string;
  precio_financiado: string;
  moneda_nombre: string; // Helper backend
  
  disponible: boolean;
  mostrar_en_web: boolean;
  destacar_en_web: boolean;
  oportunidad: boolean;
  
  comentario_carga: string; // Descripción
  imagenes: ImagenVehiculo[];
  
  created_at: string;
  updated_at: string;
}

// Tipos para listado (existentes)
export interface ApiVehicleSummary {
  id: number;
  titulo: string;
  patente: string;
  marca: number;
  marca_nombre: string;
  modelo: number;
  modelo_nombre: string;
  version: string;
  anio: number;
  km: number;
  color: string;
  precio: string;
  moneda: number;
  moneda_nombre: string;
  estado_nombre: string;
  combustible_nombre?: string;
  caja_nombre?: string;
  imagen_principal: string;
  destacar_en_web: boolean;
  oportunidad: boolean;
}

// Tipo que usa tu componente Frontend
export interface VehicleCard {
  id: number;
  name: string;
  price: number;
  currency: string;
  year: number;
  km: number;
  image: string;
  brand: string;
  segment: string;
  fuel: string;
  transmission: string;
  badge?: string;
  prevPrice?: number;
  discount?: number;
}

export interface VehicleFilters {
  marca?: string | number;
  modelo?: string | number;
  precio_min?: number;
  precio_max?: number;
  anio_min?: number;
  anio_max?: number;
  km_min?: number;
  km_max?: number;
  combustible?: string | number;
  // La API documentada filtra por `caja` (transmisión)
  caja?: string | number;
  // Backward-compat: algunos lugares podrían seguir usando `transmision`
  transmision?: string | number;
  segmento?: string | number;
  estado?: string | number;
  search?: string;
  disponible?: boolean;
  oportunidad?: boolean;
  destacar_en_web?: boolean;
  ordering?: string;
  page?: number;
  limit?: number;
  // Tipo de vehículo: "auto" | "camioneta" | "camion" | "moto"
  tipo_vehiculo?: string;
}

function mapApiToVehicleCard(apiVehicle: ApiVehicleSummary): VehicleCard {
  return {
    id: apiVehicle.id,
    name: apiVehicle.titulo,
    price: parseFloat(apiVehicle.precio),
    currency: apiVehicle.moneda_nombre === 'Dólar' || apiVehicle.moneda_nombre === 'USD' ? 'USD' : 'ARS',
    year: apiVehicle.anio,
    km: apiVehicle.km,
    image: apiVehicle.imagen_principal || "/placeholder.jpg",
    brand: apiVehicle.marca_nombre,
    segment: apiVehicle.modelo_nombre,
    fuel: apiVehicle.combustible_nombre || "N/A",
    transmission: apiVehicle.caja_nombre || "N/A",
    badge: apiVehicle.oportunidad ? "Oportunidad" : (apiVehicle.destacar_en_web ? "Destacado" : undefined),
  };
}

export const vehiclesService = {
  getLatestArrivals: async (): Promise<VehicleCard[]> => {
    try {
      const data = await apiClient.get<ApiVehicleSummary[]>("/api/vehiculos/", {
        params: {
          ordering: "-created_at",
          limit: 10,
        },
      });
      return data.map(mapApiToVehicleCard);
    } catch (error) {
      console.error("Falló la carga de últimos ingresos", error);
      return []; 
    }
  },

  getVehicles: async (filters: VehicleFilters = {}): Promise<VehicleCard[]> => {
    try {
      const data = await apiClient.get<ApiVehicleSummary[]>("/api/vehiculos/", {
        params: {
          ...filters,
        } as Record<string, string | number | boolean | undefined>,
      });
      return data.map(mapApiToVehicleCard);
    } catch (error) {
      console.error("Error fetching vehicles with filters:", error);
      return [];
    }
  },

  /**
   * Obtiene el detalle de un vehículo por ID.
   * Endpoint: GET /api/vehiculos/{id}/
   */
  getVehicleById: async (id: string): Promise<ApiVehicleDetail> => {
    return apiClient.get<ApiVehicleDetail>(`/api/vehiculos/${id}/`);
  }
};
