'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/services/admin-api';
import { useDebounce } from '@/hooks/use-debounce';
import { DataTable } from '@/components/admin/vehicles/data-table';
import { getColumns, Vehicle } from '@/components/admin/vehicles/columns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, Car, CheckCircle2, Clock, TrendingUp, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminVehiclesPage() {
  const router = useRouter();

  const [data, setData] = useState<Vehicle[]>([]);
  const [allData, setAllData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  const debouncedSearch = useDebounce(search, 400);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};

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
          params.include_deleted = true;
          break;
        case 'all':
        default:
          break;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const response = await adminApi.get('/api/vehiculos/', { params });

      let results = response.data.results || response.data;

      if (activeTab === 'trash') {
        results = results.filter((v: Vehicle) => v.deleted_at !== null);
      }

      setData(results);

      // Cargar todos para stats
      if (activeTab !== 'all' && !debouncedSearch) {
        const allResponse = await adminApi.get('/api/vehiculos/');
        setAllData(allResponse.data.results || allResponse.data || []);
      } else {
        setAllData(results);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Stats calculados
  const stats = useMemo(() => {
    const total = allData.filter(v => !v.deleted_at).length;
    const disponibles = allData.filter(v => v.disponible && !v.reservado && !v.vendido && !v.deleted_at).length;
    const reservados = allData.filter(v => v.reservado && !v.deleted_at).length;
    const vendidos = allData.filter(v => v.vendido && !v.deleted_at).length;
    return { total, disponibles, reservados, vendidos };
  }, [allData]);

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
      await adminApi.patch(`/api/vehiculos/${id}/`, {
        vendido: false,
        mostrar_en_web: true
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

  const statCards = [
    { label: 'Total', value: stats.total, icon: Car, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Disponibles', value: stats.disponibles, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Reservados', value: stats.reservados, icon: Clock, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { label: 'Vendidos', value: stats.vendidos, icon: TrendingUp, color: 'bg-sky-50 text-sky-700 border-sky-200' },
  ];

  return (
    <div className="flex flex-col space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventario</h1>
          <p className="text-gray-500 mt-1">Gestiona todos los vehículos de la flota</p>
        </div>
        <Button
          asChild
          className="rounded-xl bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 shadow-md shadow-[#0188c8]/25 hover:shadow-lg hover:shadow-[#0188c8]/30"
        >
          <Link href="/admin/vehiculos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Vehículo
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className={`rounded-xl border px-4 py-3 ${stat.color} transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium opacity-80">{stat.label}</div>
              </div>
              <stat.icon className="h-8 w-8 opacity-50" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="h-11 p-1 bg-gray-100/80 rounded-xl gap-1 grid grid-cols-5 sm:inline-flex sm:w-auto">
            <TabsTrigger
              value="all"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 font-medium text-sm"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 font-medium text-sm"
            >
              <span className="hidden sm:inline">Disponibles</span>
              <span className="sm:hidden">Disp.</span>
            </TabsTrigger>
            <TabsTrigger
              value="reserved"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 font-medium text-sm"
            >
              <span className="hidden sm:inline">Reservados</span>
              <span className="sm:hidden">Res.</span>
            </TabsTrigger>
            <TabsTrigger
              value="sold"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-sky-600 font-medium text-sm"
            >
              <span className="hidden sm:inline">Vendidos</span>
              <span className="sm:hidden">Vend.</span>
            </TabsTrigger>
            <TabsTrigger
              value="trash"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-600 font-medium text-sm"
            >
              <Trash2 className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Papelera</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por marca, modelo o patente..."
            className="pl-10 h-11 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[#0188c8]/20 focus:border-[#0188c8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
