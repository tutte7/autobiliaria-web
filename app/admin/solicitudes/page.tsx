'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '@/services/admin-api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConsultasTable } from '@/components/admin/inbox/consultas-table';
import { PublicacionesTable } from '@/components/admin/inbox/publicaciones-table';
import { Inbox, MessageCircle, Car, Eye, Clock } from 'lucide-react';

export default function SolicitudesPage() {
    const [activeTab, setActiveTab] = useState('consultas');
    const [consultasStats, setConsultasStats] = useState({ total: 0, pendientes: 0, atendidas: 0 });
    const [publicacionesStats, setPublicacionesStats] = useState({ total: 0, pendientes: 0, vistas: 0 });

    const fetchStats = useCallback(async () => {
        try {
            // Fetch consultas stats
            const consultasRes = await adminApi.get('/api/consultas/');
            const consultas = consultasRes.data.results || consultasRes.data || [];
            setConsultasStats({
                total: consultas.length,
                pendientes: consultas.filter((c: any) => !c.atendida).length,
                atendidas: consultas.filter((c: any) => c.atendida).length,
            });

            // Fetch publicaciones stats
            const publicacionesRes = await adminApi.get('/api/publicaciones/');
            const publicaciones = publicacionesRes.data.results || publicacionesRes.data || [];
            setPublicacionesStats({
                total: publicaciones.length,
                pendientes: publicaciones.filter((p: any) => !p.vista && !p.eliminada).length,
                vistas: publicaciones.filter((p: any) => p.vista).length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const statCards = [
        {
            label: 'Consultas Pendientes',
            value: consultasStats.pendientes,
            icon: MessageCircle,
            color: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
            label: 'Consultas Atendidas',
            value: consultasStats.atendidas,
            icon: Eye,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
            label: 'Tasaciones Pendientes',
            value: publicacionesStats.pendientes,
            icon: Car,
            color: 'bg-amber-50 text-amber-700 border-amber-200'
        },
        {
            label: 'Tasaciones Vistas',
            value: publicacionesStats.vistas,
            icon: Clock,
            color: 'bg-violet-50 text-violet-700 border-violet-200'
        },
    ];

    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Inbox className="h-8 w-8 text-[#0188c8]" />
                        Bandeja de Entrada
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gestiona consultas de compra y solicitudes de tasación
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <div
                        key={i}
                        className={`rounded-xl border px-4 py-3 ${stat.color} transition-all hover:shadow-md`}
                    >
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

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="h-11 p-1 bg-gray-100/80 rounded-xl gap-1 inline-flex">
                    <TabsTrigger
                        value="consultas"
                        className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0188c8] font-medium text-sm"
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Consultas
                        {consultasStats.pendientes > 0 && (
                            <span className="ml-2 rounded-full bg-blue-500 text-white text-xs px-2 py-0.5">
                                {consultasStats.pendientes}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="tasaciones"
                        className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0188c8] font-medium text-sm"
                    >
                        <Car className="h-4 w-4 mr-2" />
                        Tasaciones
                        {publicacionesStats.pendientes > 0 && (
                            <span className="ml-2 rounded-full bg-amber-500 text-white text-xs px-2 py-0.5">
                                {publicacionesStats.pendientes}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="consultas" className="mt-6">
                    <ConsultasTable onDataChange={fetchStats} />
                </TabsContent>

                <TabsContent value="tasaciones" className="mt-6">
                    <PublicacionesTable onDataChange={fetchStats} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
