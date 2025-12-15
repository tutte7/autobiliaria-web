'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/services/admin-api';
import { useDebounce } from '@/hooks/use-debounce';
import { DataTable } from '@/components/admin/vehicles/data-table';
import { getColumns, Vehicle } from '@/components/admin/vehicles/columns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminVehiclesPage() {
  const router = useRouter();
  
  // Estado local
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // default: active (available)

  // Debounce de búsqueda
  const debouncedSearch = useDebounce(search, 400);

  // Función de carga de datos
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};

      // Mapeo de Tabs a filtros de API
      switch (activeTab) {
        case 'active':
          params.disponible = true;
          break;
        case 'reserved':
          params.reservado = true;
          break;
        case 'sold':
          params.vendido = true;
          break;
        case 'trash':
          params.include_deleted = true; // Solo soft-deleted no tenemos filtro directo, usamos include_deleted y filtraremos en UI o backend debería soportar "only_deleted"
          break;
        case 'all':
        default:
          // Sin filtros adicionales (trae todo, excepto eliminados si no se pide)
          break;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const response = await adminApi.get('/api/vehiculos/', { params });
      
      let results = response.data.results || response.data; // Manejo de paginación Django

      // Filtro manual para "Trash" si la API devuelve todo mezclado con include_deleted=true
      if (activeTab === 'trash') {
         // Si la API no soporta filtrar SOLO borrados, filtramos en cliente
         // Asumimos que include_deleted=true trae todo (activos + borrados)
         // Ojo: Si tu backend tiene un filtro especifico para 'deleted_only', úsalo. 
         // Si no, iteramos.
         results = results.filter((v: Vehicle) => v.deleted_at !== null);
      } else if (activeTab === 'all') {
          // 'all' normalmente no incluye eliminados a menos que se pida
          // Si queremos ver historial completo, podríamos usar include_deleted=true
      }
      
      setData(results);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  // Efecto de carga
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Handlers de Acciones
  const handleMarkSold = async (id: number) => {
    try {
      await adminApi.patch(`/api/vehiculos/${id}/marcar-vendido/`);
      toast.success('Vehículo marcado como vendido');
      fetchVehicles();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleMarkAvailable = async (id: number) => {
    try {
        // Para "desmarcar" como vendido, actualizamos manualmente el campo
        // y también aseguramos que esté disponible y visible si es necesario
        await adminApi.patch(`/api/vehiculos/${id}/`, {
            vendido: false,
            mostrar_en_web: true // Opcional: volver a mostrarlo en web automáticamente
        });
        toast.success('Vehículo puesto a la venta nuevamente');
        fetchVehicles();
    } catch (error) {
        toast.error('Error al poner a la venta');
        console.error(error);
    }
  };

  const handleMarkReserved = async (id: number) => {
    try {
        await adminApi.patch(`/api/vehiculos/${id}/marcar-reservado/`);
        toast.success('Estado de reserva actualizado');
        fetchVehicles();
    } catch (error) {
        toast.error('Error al actualizar reserva');
    }
  };

  const handleDelete = async (id: number) => {
      if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
      try {
          await adminApi.delete(`/api/vehiculos/${id}/`);
          toast.success('Vehículo eliminado');
          fetchVehicles();
      } catch (error) {
          toast.error('Error al eliminar vehículo');
      }
  };

  const handleRestore = async (id: number) => {
      try {
          await adminApi.post(`/api/vehiculos/${id}/restaurar/`);
          toast.success('Vehículo restaurado');
          fetchVehicles();
      } catch (error) {
          toast.error('Error al restaurar vehículo');
      }
  };

  const columns = getColumns({
    onMarkSold: handleMarkSold,
    onMarkAvailable: handleMarkAvailable,
    onMarkReserved: handleMarkReserved,
    onDelete: handleDelete,
    onRestore: handleRestore
  });

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventario</h1>
           <p className="text-muted-foreground text-sm">Gestiona todos los vehículos de la flota.</p>
        </div>
        <Button asChild>
          <Link href="/admin/vehiculos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Vehículo
          </Link>
        </Button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-grid">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Disponibles</TabsTrigger>
                <TabsTrigger value="reserved">Reservados</TabsTrigger>
                <TabsTrigger value="sold">Vendidos</TabsTrigger>
                <TabsTrigger value="trash">Papelera</TabsTrigger>
            </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por marca, modelo o patente..."
                    className="pl-9 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
      />

    </div>
  );
}
