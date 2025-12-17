import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Cliente de API pública (sin autenticación)
 * Para endpoints que no requieren login
 */
const publicApi = axios.create({
    baseURL: API_URL,
});

export interface TipoVehiculo {
    value: string;
    label: string;
}

export interface PublicacionPayload {
    nombre: string;
    email: string;
    telefono: string;
    tipo_vehiculo: string;
    marca: number;
    modelo: number;
    anio: number;
    km: number;
}

export const publicApiService = {
    /**
     * Obtiene los tipos de vehículo disponibles
     * GET /api/publicaciones/tipos-vehiculo/
     */
    getTiposVehiculo: async (): Promise<TipoVehiculo[]> => {
        try {
            const { data } = await publicApi.get<TipoVehiculo[]>('/api/publicaciones/tipos-vehiculo/');
            return data;
        } catch (error) {
            console.error('Error al obtener tipos de vehículo:', error);
            // Fallback values
            return [
                { value: 'auto', label: 'Auto' },
                { value: 'camioneta', label: 'Camioneta' },
                { value: 'camion', label: 'Camión' },
                { value: 'moto', label: 'Moto' },
            ];
        }
    },

    /**
     * Crea una nueva publicación de vehículo (con imágenes)
     * POST /api/publicaciones/
     * Requiere multipart/form-data
     */
    crearPublicacion: async (
        payload: PublicacionPayload,
        imagenes: File[]
    ): Promise<any> => {
        const formData = new FormData();

        // Datos del formulario
        formData.append('nombre', payload.nombre);
        formData.append('email', payload.email);
        formData.append('telefono', payload.telefono);
        formData.append('tipo_vehiculo', payload.tipo_vehiculo);
        formData.append('marca', payload.marca.toString());
        formData.append('modelo', payload.modelo.toString());
        formData.append('anio', payload.anio.toString());
        formData.append('km', payload.km.toString());

        // Imágenes (máximo 4)
        imagenes.slice(0, 4).forEach((imagen) => {
            formData.append('imagenes', imagen);
        });

        const response = await publicApi.post('/api/publicaciones/', formData, {
            headers: {
                // Browser seteará automáticamente el boundary correcto
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};

export default publicApi;
