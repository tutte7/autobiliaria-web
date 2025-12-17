'use client';

import * as React from 'react';
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
    Car,
    Calendar,
    CheckCircle,
    Trash2,
    MessageSquare,
    ExternalLink
} from 'lucide-react';
import type { Consulta } from './consultas-table';

interface ConsultaSheetProps {
    consulta: Consulta | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMarkAttended: (id: number) => void;
    onDelete: (id: number) => void;
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

export function ConsultaSheet({
    consulta,
    open,
    onOpenChange,
    onMarkAttended,
    onDelete
}: ConsultaSheetProps) {
    if (!consulta) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader className="pb-4 border-b">
                    <div className="flex items-center gap-2">
                        <Badge
                            className={
                                consulta.tipo === 'reserva'
                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                    : 'bg-sky-100 text-sky-700 border-sky-200'
                            }
                        >
                            {consulta.tipo === 'reserva' ? 'Reserva' : 'Consulta'}
                        </Badge>
                        {consulta.atendida && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Atendida
                            </Badge>
                        )}
                    </div>
                    <SheetTitle className="text-xl">
                        Detalle de {consulta.tipo === 'reserva' ? 'Reserva' : 'Consulta'}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatFullDate(consulta.created_at)}
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    {/* Datos de Contacto - Destacados */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Datos del Cliente
                        </h3>

                        <div className="space-y-3">
                            <div className="text-lg font-bold text-gray-900">
                                {consulta.nombre}
                            </div>

                            {consulta.telefono && (
                                <a
                                    href={`tel:${consulta.telefono}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors group"
                                >
                                    <div className="p-2 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase">Teléfono</div>
                                        <div className="text-lg font-semibold text-gray-900">{consulta.telefono}</div>
                                    </div>
                                </a>
                            )}

                            {consulta.email && (
                                <a
                                    href={`mailto:${consulta.email}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase">Email</div>
                                        <div className="text-sm font-medium text-gray-900 break-all">{consulta.email}</div>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mensaje */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Mensaje
                        </h3>
                        <div className="p-4 bg-white border border-gray-200 rounded-xl">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {consulta.mensaje || <em className="text-gray-400">Sin mensaje</em>}
                            </p>
                        </div>
                    </div>

                    {/* Vehículo Relacionado */}
                    {consulta.vehiculo && consulta.vehiculo_titulo && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                Vehículo de Interés
                            </h3>
                            <a
                                href={`/vehiculos/${consulta.vehiculo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-[#0188c8]/5 border border-[#0188c8]/20 rounded-xl hover:bg-[#0188c8]/10 transition-colors group"
                            >
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {consulta.vehiculo_titulo}
                                    </div>
                                    {consulta.vehiculo_patente && (
                                        <div className="text-sm text-gray-500">
                                            Patente: {consulta.vehiculo_patente}
                                        </div>
                                    )}
                                </div>
                                <ExternalLink className="h-5 w-5 text-[#0188c8] group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    )}
                </div>

                <SheetFooter className="flex gap-2 pt-4 border-t">
                    {!consulta.atendida && (
                        <Button
                            onClick={() => onMarkAttended(consulta.id)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Atendida
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => onDelete(consulta.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
