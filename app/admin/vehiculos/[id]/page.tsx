'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { VehicleForm, VehicleFormValues, ExistingImage } from '@/components/admin/vehicles/vehicle-form';
import adminApi from '@/services/admin-api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Partial<VehicleFormValues> | null>(null);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        // Intento 1: Carga normal
        let response;
        try {
            response = await adminApi.get(`/api/vehiculos/${id}/`);
        } catch (error: any) {
            // Intento 2: Si es 404, probamos con include_deleted (si la API lo soporta en detalle)
            // Si la API no soporta include_deleted en detalle, esto fallará de nuevo y es correcto.
            if (error.response?.status === 404) {
                 // Nota: Algunos backends requieren el flag incluso en detalle si está borrado
                 response = await adminApi.get(`/api/vehiculos/${id}/`, { params: { include_deleted: true }});
            } else {
                throw error;
            }
        }

        const { data } = response;
        
        // Transformar datos de la API al formato del Formulario
        const formValues: Partial<VehicleFormValues> = {
            marca: data.marca.toString(),
            modelo: data.modelo.toString(),
            version: data.version || '',
            anio: data.anio,
            patente: data.patente,
            color: data.color,
            precio: parseFloat(data.precio),
            moneda: data.moneda.toString(),
            combustible: data.combustible.toString(),
            caja: data.caja.toString(),
            estado: data.estado.toString(),
            condicion: data.condicion.toString(),
            vendedor_dueno: data.vendedor_dueno.toString(),
            km: data.km || 0,
            vtv: data.vtv || false,
            mostrar_en_web: data.mostrar_en_web,
            destacar_en_web: data.destacar_en_web,
        };

        setInitialData(formValues);
        setExistingImages(data.imagenes || []);

      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('No se pudo cargar el vehículo (puede que no exista o esté eliminado permanentemente)');
        router.push('/admin/vehiculos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchVehicle();
    }
  }, [id, router]);

  const handleSubmit = async (values: VehicleFormValues, newImages: File[], deletedImageIds: number[]) => {
    setIsSubmitting(true);
    try {
        // 1. Actualizar Datos del Vehículo (PATCH)
        await adminApi.patch(`/api/vehiculos/${id}/`, values);

        // 2. Eliminar Imágenes Borradas
        if (deletedImageIds.length > 0) {
            await Promise.all(
                deletedImageIds.map(imgId => 
                    adminApi.delete(`/api/vehiculos/${id}/imagenes/${imgId}/`)
                )
            );
        }

        // 3. Subir Imágenes Nuevas
        if (newImages.length > 0) {
            // Calculamos el orden inicial para las nuevas imágenes
            const maxOrder = existingImages.reduce((max, img) => Math.max(max, img.orden), -1);
            let currentOrder = maxOrder + 1;

            for (const file of newImages) {
                const formData = new FormData();
                formData.append('imagen', file);
                formData.append('orden', currentOrder.toString());
                formData.append('es_principal', 'false'); // Las nuevas no son principales por defecto al editar

                await adminApi.post(`/api/vehiculos/${id}/imagenes/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                currentOrder++;
            }
        }

        toast.success('Vehículo actualizado correctamente');
        router.push('/admin/vehiculos');

    } catch (error: any) {
        console.error('Error updating vehicle:', error);
        const errorMsg = error.response?.data 
            ? JSON.stringify(error.response.data) 
            : 'Error desconocido';
        toast.error(`Error al guardar: ${errorMsg}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
      );
  }

  if (!initialData) return null;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar Vehículo</h1>
        <p className="text-muted-foreground mt-2">
          Modifica los datos del vehículo #{id}.
        </p>
      </div>
      
      <VehicleForm 
        initialData={initialData} 
        existingImages={existingImages}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
