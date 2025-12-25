'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  MapPin,
  User,
  Car,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Clock
} from 'lucide-react';
import type { Reunion } from '@/services/meetings';

interface MeetingCardProps {
  meeting: Reunion;
  onEdit: (meeting: Reunion) => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  onDelete: (id: number) => void;
}

export function MeetingCard({ meeting, onEdit, onComplete, onCancel, onDelete }: MeetingCardProps) {
  const getUbicacionBadge = (ubicacion: string) => {
    if (ubicacion === 'falucho') {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <MapPin className="mr-1 h-3 w-3" />
          Falucho
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        <MapPin className="mr-1 h-3 w-3" />
        Playa Grande
      </Badge>
    );
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
      case 'completada':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completada
          </Badge>
        );
      case 'cancelada':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatHora = (hora: string) => {
    return hora.slice(0, 5); // Obtener HH:MM
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-0 rounded-xl">
      <CardContent className="p-0">
        <div className="flex">
          {/* Hora */}
          <div className="bg-gradient-to-b from-[#0188c8] to-[#0166a0] text-white flex items-center justify-center min-w-[90px] py-4">
            <span className="text-2xl font-bold">{formatHora(meeting.hora)}</span>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                {/* Badges de ubicacion y estado */}
                <div className="flex items-center gap-2 flex-wrap">
                  {getUbicacionBadge(meeting.ubicacion)}
                  {getEstadoBadge(meeting.estado)}
                </div>

                {/* Coordinador */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Coordinador:</span>
                  <span>{meeting.coordinador_nombre}</span>
                </div>

                {/* Comprador y Vendedor */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Comprador:</span>
                    <span className="text-gray-600">{meeting.comprador_nombre}</span>
                  </div>
                  <span className="hidden sm:inline text-gray-400">→</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Vendedor:</span>
                    <span className="text-gray-600">{meeting.vendedor_display}</span>
                  </div>
                </div>

                {/* Vehiculo */}
                {meeting.vehiculo_display && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{meeting.vehiculo_titulo}</span>
                    <span className="text-gray-400">({meeting.vehiculo_patente})</span>
                  </div>
                )}

                {/* Notas */}
                {meeting.notas && (
                  <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-2">
                    {meeting.notas}
                  </p>
                )}
              </div>

              {/* Menu de acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(meeting)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  {meeting.estado === 'pendiente' && (
                    <>
                      <DropdownMenuItem onClick={() => onComplete(meeting.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        Marcar Completada
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCancel(meeting.id)}>
                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                        Cancelar
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(meeting.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
