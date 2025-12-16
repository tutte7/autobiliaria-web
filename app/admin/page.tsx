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
  Inbox
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import adminApi from '@/services/admin-api';

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.get('/api/vehiculos/');
        const vehiculos = response.data.results || response.data || [];

        const disponibles = vehiculos.filter((v: any) => v.disponible && !v.reservado && !v.vendido).length;
        const reservados = vehiculos.filter((v: any) => v.reservado).length;
        const vendidos = vehiculos.filter((v: any) => v.vendido).length;

        // Calcular valor del inventario (solo disponibles)
        const valorInventario = vehiculos
          .filter((v: any) => v.disponible && !v.vendido)
          .reduce((acc: number, v: any) => acc + (parseFloat(v.precio) || 0), 0);

        setStats({
          totalVehiculos: vehiculos.length,
          disponibles,
          reservados,
          vendidosEsteMes: vendidos,
          valorInventario,
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

  const statCards = [
    {
      title: 'Total Vehículos',
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
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Vendidos',
      value: stats?.vendidosEsteMes || 0,
      description: 'Total vendidos',
      icon: TrendingUp,
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      iconColor: 'text-violet-600'
    },
  ];

  const quickActions = [
    { label: 'Agregar Vehículo', href: '/admin/vehiculos/nuevo', icon: Plus, color: 'bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 text-white shadow-md shadow-[#0188c8]/25 hover:shadow-lg' },
    { label: 'Ver Inventario', href: '/admin/vehiculos', icon: Car, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { label: 'Bandeja de Entrada', href: '/admin/solicitudes', icon: Inbox, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { label: 'Configuración', href: '/admin/parametros', icon: Settings, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
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
          <p className="text-gray-500 mt-1">Bienvenido al panel de administración de Autobiliaria</p>
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
              Nuevo Vehículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Secondary Stats Row */}
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
            <CardDescription>Valor total estimado de vehículos disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#0188c8] to-[#00e8ff] bg-clip-text text-transparent">
              USD {stats?.valorInventario?.toLocaleString('es-AR') || 0}
            </div>
          </CardContent>
        </Card>

        {/* Solicitudes Pendientes */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
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

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
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
    </div>
  );
}
