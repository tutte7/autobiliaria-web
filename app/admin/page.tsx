'use client';

import { useEffect, useState } from 'react';
import {
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Eye,
  Settings,
  Inbox,
  CalendarDays,
  MapPin,
  User,
  CalendarPlus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import adminApi from '@/services/admin-api';
import meetingsService, { Reunion } from '@/services/meetings';
import { MeetingForm } from '@/components/admin/agenda/meeting-form';
import { toast } from 'sonner';

interface DashboardStats {
  totalVehiculos: number;
  disponibles: number;
  reservados: number;
  vendidosEsteMes: number;
  valorInventario: number;
  solicitudesPendientes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dolarBlue, setDolarBlue] = useState<number>(1200);

  // Estado para reuniones de hoy
  const [reunionesHoy, setReunionesHoy] = useState<Reunion[]>([]);
  const [reunionesLoading, setReunionesLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener cotizacion del dolar blue
        let cotizacion = 1200; // Fallback
        try {
          const dolarRes = await fetch('https://dolarapi.com/v1/dolares/blue');
          if (dolarRes.ok) {
            const dolarData = await dolarRes.json();
            cotizacion = dolarData.venta;
            setDolarBlue(cotizacion);
          }
        } catch (error) {
          console.error('Error al obtener cotizacion:', error);
        }

        const response = await adminApi.get('/api/vehiculos/');
        const vehiculos = response.data.results || response.data || [];

        const disponibles = vehiculos.filter((v: any) => v.disponible && !v.reservado && !v.vendido).length;
        const reservados = vehiculos.filter((v: any) => v.reservado).length;
        const vendidos = vehiculos.filter((v: any) => v.vendido).length;

        // Calcular valor del inventario en USD (solo disponibles)
        const valorInventario = vehiculos
          .filter((v: any) => v.disponible && !v.vendido)
          .reduce((acc: number, v: any) => {
            const precio = parseFloat(v.precio) || 0;
            // Convertir a USD si esta en pesos
            const esUSD = v.moneda_nombre === 'Dolar' || v.moneda_nombre === 'USD';
            const precioEnUSD = esUSD ? precio : precio / cotizacion;
            return acc + precioEnUSD;
          }, 0);

        setStats({
          totalVehiculos: vehiculos.length,
          disponibles,
          reservados,
          vendidosEsteMes: vendidos,
          valorInventario: Math.round(valorInventario),
          solicitudesPendientes: 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalVehiculos: 0,
          disponibles: 0,
          reservados: 0,
          vendidosEsteMes: 0,
          valorInventario: 0,
          solicitudesPendientes: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch reuniones de hoy
  const fetchReunionesHoy = async () => {
    setReunionesLoading(true);
    try {
      const hoy = format(new Date(), 'yyyy-MM-dd');
      const data = await meetingsService.getByDate(hoy);
      setReunionesHoy(data);
    } catch (error) {
      console.error('Error cargando reuniones:', error);
      setReunionesHoy([]);
    } finally {
      setReunionesLoading(false);
    }
  };

  useEffect(() => {
    fetchReunionesHoy();
  }, []);

  const handleFormSuccess = () => {
    toast.success('Reunion agendada exitosamente');
    fetchReunionesHoy();
  };

  const statCards = [
    {
      title: 'Total Vehiculos',
      value: stats?.totalVehiculos || 0,
      description: 'En inventario',
      icon: Car,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Disponibles',
      value: stats?.disponibles || 0,
      description: 'Listos para venta',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Reservados',
      value: stats?.reservados || 0,
      description: 'En proceso',
      icon: Clock,
      color: 'from-cyan-500 to-cyan-600',
      bgLight: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Vendidos',
      value: stats?.vendidosEsteMes || 0,
      description: 'Total vendidos',
      icon: TrendingUp,
      color: 'from-sky-500 to-sky-600',
      bgLight: 'bg-sky-50',
      iconColor: 'text-sky-600'
    },
  ];

  const quickActions = [
    { label: 'Agregar Vehiculo', href: '/admin/vehiculos/nuevo', icon: Plus, color: 'bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 text-white shadow-md shadow-[#0188c8]/25 hover:shadow-lg' },
    { label: 'Ver Inventario', href: '/admin/vehiculos', icon: Car, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { label: 'Bandeja de Entrada', href: '/admin/solicitudes', icon: Inbox, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { label: 'Configuracion', href: '/admin/parametros', icon: Settings, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0188c8]"></div>
          <span className="text-sm text-gray-500">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bienvenido al panel de administracion de Autobiliaria</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/admin/vehiculos">
              <Eye className="mr-2 h-4 w-4" />
              Ver Inventario
            </Link>
          </Button>
          <Button className="rounded-xl bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 shadow-md shadow-[#0188c8]/25 hover:shadow-lg hover:shadow-[#0188c8]/30" asChild>
            <Link href="/admin/vehiculos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Vehiculo
            </Link>
          </Button>
        </div>
      </div>

      {/* 1. Valor del Inventario + Solicitudes Pendientes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Valor del Inventario */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl bg-[#0188c8]/10">
                <DollarSign className="h-5 w-5 text-[#0188c8]" />
              </div>
              Valor del Inventario
            </CardTitle>
            <CardDescription>Valor total estimado de vehiculos disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#0188c8] to-[#00e8ff] bg-clip-text text-transparent">
              USD {stats?.valorInventario?.toLocaleString('es-AR') || 0}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Cotizacion: $1 USD = ${dolarBlue.toLocaleString('es-AR')} ARS
            </p>
          </CardContent>
        </Card>

        {/* Solicitudes Pendientes */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl bg-amber-100">
                <Inbox className="h-5 w-5 text-amber-600" />
              </div>
              Solicitudes Pendientes
            </CardTitle>
            <CardDescription>Contactos y consultas por responder</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-4xl font-bold text-amber-600">
              {stats?.solicitudesPendientes || 0}
            </div>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/admin/solicitudes">
                Ver Bandeja
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2. Agenda de Hoy */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100">
              <CalendarDays className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Agenda de Hoy</CardTitle>
              <CardDescription>
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="rounded-xl bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 shadow-md shadow-[#0188c8]/25 hover:shadow-lg"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Nueva Reunion
          </Button>
        </CardHeader>
        <CardContent>
          {reunionesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0188c8]"></div>
            </div>
          ) : reunionesHoy.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay reuniones para hoy</p>
              <Button
                variant="link"
                onClick={() => setFormOpen(true)}
                className="mt-2 text-[#0188c8]"
              >
                Agendar una reunion
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reunionesHoy.slice(0, 5).map((reunion) => (
                <div
                  key={reunion.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {/* Hora */}
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {reunion.hora.slice(0, 5)}
                    </span>
                  </div>

                  {/* Ubicacion Badge */}
                  <div className="flex-shrink-0">
                    {reunion.ubicacion === 'falucho' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <MapPin className="mr-1 h-3 w-3" />
                        Falucho
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <MapPin className="mr-1 h-3 w-3" />
                        Playa Grande
                      </Badge>
                    )}
                  </div>

                  {/* Participantes */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-900 truncate">
                        {reunion.comprador_nombre}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600 truncate">
                        {reunion.vendedor_display}
                      </span>
                    </div>
                    {reunion.vehiculo_titulo && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Car className="h-3 w-3" />
                        <span className="truncate">{reunion.vehiculo_titulo}</span>
                      </div>
                    )}
                  </div>

                  {/* Estado Badge */}
                  <div className="flex-shrink-0">
                    {reunion.estado === 'pendiente' && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        Pendiente
                      </Badge>
                    )}
                    {reunion.estado === 'completada' && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Completada
                      </Badge>
                    )}
                    {reunion.estado === 'cancelada' && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        Cancelada
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {reunionesHoy.length > 5 && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  +{reunionesHoy.length - 5} reuniones mas
                </p>
              )}
            </div>
          )}

          {/* Link a agenda completa */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <Button variant="ghost" className="rounded-xl text-[#0188c8] hover:text-[#0188c8]/80 hover:bg-sky-50" asChild>
              <Link href="/admin/agenda">
                Ver agenda completa
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Metricas de Vehiculos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Metricas de Vehiculos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.bgLight}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Acciones Rapidas */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rapidas</CardTitle>
          <CardDescription>Accede rapidamente a las funciones mas utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="ghost"
                className={`h-auto py-4 px-4 rounded-xl flex flex-col items-center gap-2 ${action.color} transition-all hover:scale-[1.02]`}
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Nueva Reunion */}
      <MeetingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        selectedDate={new Date()}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
