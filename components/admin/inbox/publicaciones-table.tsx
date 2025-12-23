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
import { Car, Image as ImageIcon, User, Loader2 } from 'lucide-react';
import { PublicacionSheet } from './publicacion-sheet';

export interface Publicacion {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    tipo_vehiculo: string;
    tipo_vehiculo_display: string;
    marca: number;
    marca_nombre: string;
    modelo: number;
    modelo_nombre: string;
    anio: number;
    km: number;
    estado: string; // 'pendiente' | 'vista' | 'eliminada'
    estado_display: string;
    notas_staff?: string;
    cant_imagenes: number;
    created_at: string;
}

export interface PublicacionDetalle extends Publicacion {
    imagenes: PublicacionImagen[];
    revisada_por: number | null;
    revisada_por_nombre: string | null;
    fecha_revision: string | null;
}

export interface PublicacionImagen {
    id: number;
    imagen: string;
    imagen_url: string;
    orden: number;
    created_at: string;
}

interface PublicacionesTableProps {
    onDataChange?: () => void;
}

function formatKm(km: number): string {
    return new Intl.NumberFormat('es-AR').format(km);
}

export function PublicacionesTable({ onDataChange }: PublicacionesTableProps) {
    const [data, setData] = useState<Publicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const fetchPublicaciones = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.get('/api/publicaciones/');
            const results = response.data.results || response.data || [];
            // Ordenar por fecha descendente (más recientes primero)
            const sorted = results.sort((a: Publicacion, b: Publicacion) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setData(sorted);
        } catch (error) {
            console.error('Error fetching publicaciones:', error);
            toast.error('Error al cargar tasaciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPublicaciones();
    }, [fetchPublicaciones]);

    const handleRowClick = (publicacion: Publicacion) => {
        setSelectedPublicacion(publicacion);
        setSheetOpen(true);
    };

    const handleMarkAsViewed = async (id: number) => {
        try {
            await adminApi.patch(`/api/publicaciones/${id}/marcar-vista/`);
            toast.success('Tasación marcada como vista');
            setData(prev => prev.map(p =>
                p.id === id ? { ...p, estado: 'vista', estado_display: 'Vista' } : p
            ));
            setSheetOpen(false);
            onDataChange?.();
        } catch (error) {
            console.error('Error marking as viewed:', error);
            toast.error('Error al marcar como vista');
        }
    };

    const handleDiscard = async (id: number) => {
        if (!confirm('¿Estás seguro de descartar esta tasación?')) return;
        try {
            await adminApi.patch(`/api/publicaciones/${id}/marcar-eliminada/`);
            toast.success('Tasación descartada');
            setData(prev => prev.map(p =>
                p.id === id ? { ...p, estado: 'eliminada', estado_display: 'Eliminada' } : p
            ));
            setSheetOpen(false);
            onDataChange?.();
        } catch (error) {
            console.error('Error discarding publicacion:', error);
            toast.error('Error al descartar tasación');
        }
    };

    const getStatusBadge = (publicacion: Publicacion) => {
        if (publicacion.estado === 'eliminada') {
            return <Badge className="bg-red-100 text-red-700 border-red-200">Descartada</Badge>;
        }
        if (publicacion.estado === 'vista') {
            return <Badge className="bg-green-100 text-green-700 border-green-200">Vista</Badge>;
        }
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Pendiente</Badge>;
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                                Estado
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Vehículo
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Cliente
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                                Fotos
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#0188c8]" />
                                        <span className="text-sm text-gray-500">Cargando tasaciones...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <div className="p-3 rounded-full bg-gray-100">
                                            <Car className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <span className="text-gray-600 font-medium">No hay tasaciones</span>
                                        <span className="text-sm text-gray-400">Las solicitudes de venta aparecerán aquí</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((publicacion) => (
                                <TableRow
                                    key={publicacion.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${publicacion.estado === 'pendiente' ? 'bg-blue-50/30' : ''} ${publicacion.estado === 'eliminada' ? 'opacity-50' : ''}`}
                                    onClick={() => handleRowClick(publicacion)}
                                >
                                    <TableCell className="px-4 py-3">
                                        {getStatusBadge(publicacion)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${publicacion.estado === 'pendiente' ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {publicacion.marca_nombre} {publicacion.modelo_nombre}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {publicacion.anio} • {formatKm(publicacion.km)} km
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{publicacion.nombre}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {publicacion.cant_imagenes > 0 ? (
                                            <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                                                <ImageIcon className="h-3 w-3 mr-1" />
                                                {publicacion.cant_imagenes} fotos
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-gray-400">Sin fotos</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Sheet for detail view */}
            <PublicacionSheet
                publicacion={selectedPublicacion}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                onMarkAsViewed={handleMarkAsViewed}
                onDiscard={handleDiscard}
            />
        </>
    );
}
