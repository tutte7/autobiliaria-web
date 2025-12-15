'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VehicleForm, VehicleFormValues } from '@/components/admin/vehicles/vehicle-form';
import adminApi from '@/services/admin-api';
import { toast } from 'sonner';

export default function NewVehiclePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: VehicleFormValues, images: File[]) => {
    setIsSubmitting(true);
    let vehicleId: number | null = null;

    try {
      // 1. Crear el vehículo
      const { data: vehicle } = await adminApi.post('/api/vehiculos/', values);
      vehicleId = vehicle.id;
      
      // 2. Subir imágenes si existen
      if (images.length > 0 && vehicleId) {
        // Subimos secuencialmente para mantener el orden (aunque el backend acepte paralelo, es más seguro así para el orden)
        // La primera imagen del array ya fue ordenada en el componente como principal
        for (let i = 0; i < images.length; i++) {
            const formData = new FormData();
            formData.append('imagen', images[i]);
            formData.append('orden', i.toString());
            // La primera es principal por lógica de UI del formulario
            formData.append('es_principal', (i === 0).toString());

            await adminApi.post(`/api/vehiculos/${vehicleId}/imagenes/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
      }

      toast.success('Vehículo creado exitosamente');
      router.push('/admin/vehiculos');

    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      
      if (vehicleId) {
          // Si el vehículo se creó pero fallaron las imágenes
          toast.warning('Vehículo creado, pero hubo errores al subir algunas imágenes.');
          router.push(`/admin/vehiculos/${vehicleId}`); // Redirigir a edición para intentar subir fotos de nuevo
      } else {
          // Si falló la creación del vehículo
          const errorMsg = error.response?.data 
            ? Object.entries(error.response.data)
                .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                .join(' | ')
            : 'Error desconocido al crear vehículo';
          
          toast.error(`Error: ${errorMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Nuevo Vehículo</h1>
        <p className="text-muted-foreground mt-2">
          Completa el formulario para ingresar un nuevo vehículo al inventario.
        </p>
      </div>
      
      <VehicleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

