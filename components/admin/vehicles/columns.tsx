'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, ExternalLink, Trash2, Edit, CheckCircle, XCircle, Tag, Banknote, RefreshCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

// Definición de tipos basada en la respuesta de la API
export type Vehicle = {
  id: number;
  titulo: string;
  patente: string;
  precio: string; // Viene como string "2500000.00"
  moneda_nombre: string;
  estado_nombre: string;
  reservado: boolean;
  vendido: boolean;
  disponible: boolean;
  mostrar_en_web: boolean;
  imagen_principal: string | null;
  deleted_at?: string | null;
  // Agregamos otros campos útiles
  anio: number;
  marca_nombre: string;
  modelo_nombre: string;
};

// Acciones que se pasarán desde el padre
interface ColumnActions {
  onMarkSold: (id: number) => void;
  onMarkAvailable: (id: number) => void;
  onMarkReserved: (id: number) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

// Creamos una función que reciba las acciones y devuelva las columnas
export const getColumns = ({
  onMarkSold,
  onMarkAvailable,
  onMarkReserved,
  onDelete,
  onRestore
}: ColumnActions): ColumnDef<Vehicle>[] => [
  {
    accessorKey: 'imagen_principal',
    header: '',
    cell: ({ row }) => {
      const image = row.getValue('imagen_principal') as string;
      const title = row.original.titulo;
      return (
        <Avatar className="h-10 w-10 rounded-md border border-gray-200">
          <AvatarImage src={image} alt={title} className="object-cover" />
          <AvatarFallback className="rounded-md bg-gray-100 text-[10px] text-gray-500 font-bold">
            IMG
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'titulo',
    header: 'Vehículo',
    cell: ({ row }) => {
      const { marca_nombre, modelo_nombre, anio, patente } = row.original;
      // Construimos el título si no viniera completo
      const title = `${marca_nombre} ${modelo_nombre} ${anio}`;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 line-clamp-1">
             {title}
          </span>
          <span className="text-xs text-gray-500 font-mono uppercase">
            {patente}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('precio'));
      const currency = row.original.moneda_nombre;
      
      // Formateo simple si no tenemos la función formatCurrency completa
      const formatted = new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return (
        <div className="font-medium text-gray-900">
          {currency} {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const { reservado, vendido, disponible, deleted_at } = row.original;
      
      if (deleted_at) {
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">Eliminado</Badge>;
      }
      if (vendido) {
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">Vendido</Badge>;
      }
      if (reservado) {
        return <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200">Reservado</Badge>;
      }
      if (disponible) {
        return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">Disponible</Badge>;
      }
      return <Badge variant="outline">No Disp.</Badge>;
    },
  },
  {
    accessorKey: 'mostrar_en_web',
    header: 'Web',
    cell: ({ row }) => {
      const isVisible = row.getValue('mostrar_en_web');
      return (
        <div className="flex items-center justify-center">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isVisible ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={isVisible ? 'Visible en web' : 'No visible'}
          />
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const vehicle = row.original;
      const isDeleted = !!vehicle.deleted_at;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            
            {!isDeleted && (
              <DropdownMenuItem asChild>
                <Link href={`/admin/vehiculos/${vehicle.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <a href={`/vehiculos/${vehicle.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver en Web
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {!isDeleted && !vehicle.vendido && (
                <DropdownMenuItem onClick={() => onMarkSold(vehicle.id)}>
                    <Banknote className="mr-2 h-4 w-4" />
                    Marcar Vendido
                </DropdownMenuItem>
            )}

            {!isDeleted && vehicle.vendido && (
                <DropdownMenuItem onClick={() => onMarkAvailable(vehicle.id)}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Poner a la venta
                </DropdownMenuItem>
            )}

             {!isDeleted && !vehicle.vendido && (
                <DropdownMenuItem onClick={() => onMarkReserved(vehicle.id)}>
                    <Tag className="mr-2 h-4 w-4" />
                    {vehicle.reservado ? 'Quitar Reserva' : 'Marcar Reservado'}
                </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {isDeleted ? (
              <DropdownMenuItem onClick={() => onRestore(vehicle.id)}>
                 <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                 Restaurar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onDelete(vehicle.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
