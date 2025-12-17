'use client';

import { useState, useEffect, useCallback } from 'react';
import adminApi from '@/services/admin-api';
import { VendorsTable } from '@/components/admin/vendors/vendors-table';
import { VendorSheet } from '@/components/admin/vendors/vendor-sheet';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, UserCheck, Megaphone } from 'lucide-react';

export interface Vendedor {
    id: number;
    nombre: string;
    apellido: string;
    full_name: string;
    email: string;
    celular: string;
    dni: string;
    direccion: string;
    tiene_cartel: boolean;
    activo: boolean;
    comentarios: string;
    created_at: string;
    updated_at: string;
}

export default function VendedoresPage() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedVendedor, setSelectedVendedor] = useState<Vendedor | null>(null);
    const [stats, setStats] = useState({ total: 0, activos: 0, conCartel: 0 });
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchStats = useCallback(async () => {
        try {
            const response = await adminApi.get('/api/vendedores/');
            const vendedores = response.data.results || response.data || [];
            setStats({
                total: vendedores.length,
                activos: vendedores.filter((v: Vendedor) => v.activo).length,
                conCartel: vendedores.filter((v: Vendedor) => v.tiene_cartel).length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats, refreshKey]);

    const handleAddVendedor = () => {
        setSelectedVendedor(null);
        setSheetOpen(true);
    };

    const handleEditVendedor = (vendedor: Vendedor) => {
        setSelectedVendedor(vendedor);
        setSheetOpen(true);
    };

    const handleSheetClose = () => {
        setSheetOpen(false);
        setSelectedVendedor(null);
    };

    const handleDataChange = () => {
        setRefreshKey(prev => prev + 1);
        fetchStats();
    };

    const statCards = [
        {
            label: 'Total Vendedores',
            value: stats.total,
            icon: Users,
            color: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
            label: 'Activos',
            value: stats.activos,
            icon: UserCheck,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
            label: 'Con Cartel',
            value: stats.conCartel,
            icon: Megaphone,
            color: 'bg-amber-50 text-amber-700 border-amber-200'
        },
    ];

    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-[#0188c8]" />
                        Vendedores
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gestiona los dueños de los vehículos
                    </p>
                </div>
                <Button
                    onClick={handleAddVendedor}
                    className="bg-gradient-to-r from-[#0188c8] to-[#0166a1] hover:from-[#0166a1] hover:to-[#014a7a] text-white shadow-md"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Vendedor
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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

            {/* Table */}
            <VendorsTable
                key={refreshKey}
                onEdit={handleEditVendedor}
                onDataChange={handleDataChange}
            />

            {/* Sheet */}
            <VendorSheet
                vendedor={selectedVendedor}
                open={sheetOpen}
                onOpenChange={handleSheetClose}
                onSuccess={handleDataChange}
            />
        </div>
    );
}
