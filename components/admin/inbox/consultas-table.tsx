'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import adminApi from '@/services/admin-api';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Calendar, Loader2 } from 'lucide-react';
import { ConsultaSheet } from './consulta-sheet';

export interface Consulta {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    tipo: string; // 'consulta' | 'reserva'
    tipo_display: string;
    leida: boolean;
    atendida: boolean;
    created_at: string;
    vehiculo: number | null;
    vehiculo_titulo: string | null;
    vehiculo_patente: string | null;
}

interface ConsultasTableProps {
    onDataChange?: () => void;
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 60) {
        return `hace ${diffMinutes} min`;
    } else if (diffHours < 24) {
        return `hace ${diffHours}h`;
    } else if (diffDays < 7) {
        return `hace ${diffDays}d`;
    } else {
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    }
}

export function ConsultasTable({ onDataChange }: ConsultasTableProps) {
    const [data, setData] = useState<Consulta[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const fetchConsultas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.get('/api/consultas/');
            const results = response.data.results || response.data || [];
            // Ordenar por fecha descendente (más recientes primero)
            const sorted = results.sort((a: Consulta, b: Consulta) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setData(sorted);
        } catch (error) {
            console.error('Error fetching consultas:', error);
            toast.error('Error al cargar consultas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConsultas();
    }, [fetchConsultas]);

    const handleRowClick = async (consulta: Consulta) => {
        // Marcar como leída si no lo está
        if (!consulta.leida) {
            try {
                await adminApi.patch(`/api/consultas/${consulta.id}/`, { leida: true });
                // Actualizar localmente
                setData(prev => prev.map(c =>
                    c.id === consulta.id ? { ...c, leida: true } : c
                ));
                onDataChange?.();
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
        setSelectedConsulta({ ...consulta, leida: true });
        setSheetOpen(true);
    };

    const handleMarkAttended = async (id: number) => {
        try {
            await adminApi.patch(`/api/consultas/${id}/marcar-atendida/`);
            toast.success('Consulta marcada como atendida');
            setData(prev => prev.map(c =>
                c.id === id ? { ...c, atendida: true } : c
            ));
            setSheetOpen(false);
            onDataChange?.();
        } catch (error) {
            console.error('Error marking as attended:', error);
            toast.error('Error al marcar como atendida');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta consulta?')) return;
        try {
            await adminApi.delete(`/api/consultas/${id}/`);
            toast.success('Consulta eliminada');
            setData(prev => prev.filter(c => c.id !== id));
            setSheetOpen(false);
            onDataChange?.();
        } catch (error) {
            console.error('Error deleting consulta:', error);
            toast.error('Error al eliminar consulta');
        }
    };

    const getStatusIndicator = (consulta: Consulta) => {
        if (consulta.atendida) {
            return (
                <div className="flex items-center justify-center" title="Atendida">
                    <div className="h-3 w-3 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            );
        } else if (!consulta.leida) {
            return (
                <div className="flex items-center justify-center" title="Nueva">
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                </div>
            );
        } else {
            return (
                <div className="flex items-center justify-center" title="Leída">
                    <div className="h-3 w-3 rounded-full bg-gray-300" />
                </div>
            );
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                                Estado
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fecha
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Cliente
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Tipo
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Vehículo
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#0188c8]" />
                                        <span className="text-sm text-gray-500">Cargando consultas...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <div className="p-3 rounded-full bg-gray-100">
                                            <MessageCircle className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <span className="text-gray-600 font-medium">No hay consultas</span>
                                        <span className="text-sm text-gray-400">Las nuevas consultas aparecerán aquí</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((consulta) => (
                                <TableRow
                                    key={consulta.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${!consulta.leida ? 'bg-blue-50/30' : ''
                                        }`}
                                    onClick={() => handleRowClick(consulta)}
                                >
                                    <TableCell className="px-4 py-3">
                                        {getStatusIndicator(consulta)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            {formatRelativeTime(consulta.created_at)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${!consulta.leida ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {consulta.nombre}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {consulta.telefono || consulta.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge
                                            className={
                                                consulta.tipo === 'reserva'
                                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                                    : 'bg-sky-100 text-sky-700 border-sky-200'
                                            }
                                        >
                                            {consulta.tipo === 'reserva' ? 'Reserva' : 'Consulta'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {consulta.vehiculo_titulo ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-700 line-clamp-1">
                                                    {consulta.vehiculo_titulo}
                                                </span>
                                                {consulta.vehiculo_patente && (
                                                    <span className="text-xs text-gray-500">
                                                        {consulta.vehiculo_patente}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">General</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Sheet for detail view */}
            <ConsultaSheet
                consulta={selectedConsulta}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                onMarkAttended={handleMarkAttended}
                onDelete={handleDelete}
            />
        </>
    );
}
