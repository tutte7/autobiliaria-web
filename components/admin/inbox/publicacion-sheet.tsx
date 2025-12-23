'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import adminApi from '@/services/admin-api';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Phone,
    Mail,
    User,
    Calendar,
    Car,
    Gauge,
    Eye,
    Trash2,
    X,
    ZoomIn,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';
import type { Publicacion, PublicacionDetalle, PublicacionImagen } from './publicaciones-table';

interface PublicacionSheetProps {
    publicacion: Publicacion | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMarkAsViewed: (id: number) => void;
    onDiscard: (id: number) => void;
}

function formatFullDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatKm(km: number): string {
    return new Intl.NumberFormat('es-AR').format(km);
}

export function PublicacionSheet({
    publicacion,
    open,
    onOpenChange,
    onMarkAsViewed,
    onDiscard
}: PublicacionSheetProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [detalle, setDetalle] = useState<PublicacionDetalle | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Fetch full detail when sheet opens
    useEffect(() => {
        if (open && publicacion?.id) {
            setLoadingDetail(true);
            adminApi.get(`/api/publicaciones/${publicacion.id}/`)
                .then((response) => {
                    setDetalle(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching publicacion detail:', error);
                })
                .finally(() => {
                    setLoadingDetail(false);
                });
        } else {
            setDetalle(null);
        }
    }, [open, publicacion?.id]);

    if (!publicacion) return null;

    const images: PublicacionImagen[] = detalle?.imagenes || [];

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getStatusBadge = () => {
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
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:max-w-xl overflow-y-auto p-6">
                    <SheetHeader className="pb-4 border-b">
                        <div className="flex items-center gap-2">
                            {getStatusBadge()}
                        </div>
                        <SheetTitle className="text-xl flex items-center gap-2">
                            <Car className="h-5 w-5 text-[#0188c8]" />
                            {publicacion.marca_nombre} {publicacion.modelo_nombre}
                        </SheetTitle>
                        <SheetDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatFullDate(publicacion.created_at)}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                        {/* Galería de Imágenes */}
                        {loadingDetail ? (
                            <div className="p-6 bg-gray-50 rounded-xl text-center">
                                <Loader2 className="h-10 w-10 text-gray-400 mx-auto mb-2 animate-spin" />
                                <p className="text-gray-500 text-sm">Cargando imágenes...</p>
                            </div>
                        ) : images.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Fotos del Cliente ({images.length})
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {images.map((img, index) => (
                                        <div
                                            key={img.id}
                                            onClick={() => openLightbox(index)}
                                            className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
                                        >
                                            <img
                                                src={img.imagen_url}
                                                alt={`Foto ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-xl text-center">
                                <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">Sin fotos adjuntas</p>
                            </div>
                        )}

                        {/* Datos Técnicos */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                Datos del Vehículo
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Marca</div>
                                    <div className="font-semibold text-gray-900">{publicacion.marca_nombre}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Modelo</div>
                                    <div className="font-semibold text-gray-900">{publicacion.modelo_nombre}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Año</div>
                                    <div className="font-semibold text-gray-900">{publicacion.anio}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                                    <Gauge className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase">Kilometraje</div>
                                        <div className="font-semibold text-gray-900">{formatKm(publicacion.km)} km</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notas del Staff */}
                        {detalle?.notas_staff && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">Notas del Staff</h3>
                                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {detalle.notas_staff}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Datos del Cliente */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Datos del Cliente
                            </h3>

                            <div className="space-y-3">
                                <div className="text-lg font-bold text-gray-900">
                                    {publicacion.nombre}
                                </div>

                                {publicacion.telefono && (
                                    <a
                                        href={`tel:${publicacion.telefono}`}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Teléfono</div>
                                            <div className="text-lg font-semibold text-gray-900">{publicacion.telefono}</div>
                                        </div>
                                    </a>
                                )}

                                {publicacion.email && (
                                    <a
                                        href={`mailto:${publicacion.email}`}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Email</div>
                                            <div className="text-sm font-medium text-gray-900 break-all">{publicacion.email}</div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="flex gap-2 pt-4 border-t">
                        {publicacion.estado === 'pendiente' && (
                            <Button
                                onClick={() => onMarkAsViewed(publicacion.id)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Marcar como Vista
                            </Button>
                        )}
                        {publicacion.estado !== 'eliminada' && (
                            <Button
                                variant="outline"
                                onClick={() => onDiscard(publicacion.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Descartar
                            </Button>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Lightbox para imágenes */}
            {lightboxOpen && images.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </>
                    )}

                    <div className="max-w-4xl max-h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[lightboxIndex].imagen_url}
                            alt={`Foto ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        <div className="text-center mt-4 text-white/70 text-sm">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
