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
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, MoreHorizontal, Pencil, Trash2, Phone, Loader2 } from 'lucide-react';
import type { Vendedor } from '@/app/admin/vendedores/page';

interface VendorsTableProps {
    onEdit: (vendedor: Vendedor) => void;
    onDataChange?: () => void;
}

export function VendorsTable({ onEdit, onDataChange }: VendorsTableProps) {
    const [data, setData] = useState<Vendedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vendedorToDelete, setVendedorToDelete] = useState<Vendedor | null>(null);

    const fetchVendedores = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.get('/api/vendedores/');
            const results = response.data.results || response.data || [];
            // Ordenar por fecha descendente
            const sorted = results.sort((a: Vendedor, b: Vendedor) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setData(sorted);
        } catch (error) {
            console.error('Error fetching vendedores:', error);
            toast.error('Error al cargar vendedores');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVendedores();
    }, [fetchVendedores]);

    const handleDeleteClick = (vendedor: Vendedor) => {
        setVendedorToDelete(vendedor);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!vendedorToDelete) return;

        try {
            await adminApi.delete(`/api/vendedores/${vendedorToDelete.id}/`);
            toast.success('Vendedor eliminado correctamente');
            setData(prev => prev.filter(v => v.id !== vendedorToDelete.id));
            onDataChange?.();
        } catch (error) {
            console.error('Error deleting vendedor:', error);
            toast.error('Error al eliminar vendedor');
        } finally {
            setDeleteDialogOpen(false);
            setVendedorToDelete(null);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Nombre
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Documento
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Contacto
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Estado
                            </TableHead>
                            <TableHead className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#0188c8]" />
                                        <span className="text-sm text-gray-500">Cargando vendedores...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <div className="p-3 rounded-full bg-gray-100">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <span className="text-gray-600 font-medium">No hay vendedores</span>
                                        <span className="text-sm text-gray-400">Agrega un vendedor para comenzar</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((vendedor) => (
                                <TableRow
                                    key={vendedor.id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    <TableCell className="px-4 py-3">
                                        <span className="font-semibold text-gray-900">
                                            {vendedor.full_name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="text-gray-700">{vendedor.dni}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-700">{vendedor.email}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {vendedor.celular}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {vendedor.activo && (
                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                                    Activo
                                                </Badge>
                                            )}
                                            {vendedor.tiene_cartel && (
                                                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                                    Con Cartel
                                                </Badge>
                                            )}
                                            {!vendedor.activo && !vendedor.tiene_cartel && (
                                                <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                                                    Inactivo
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(vendedor)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(vendedor)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar vendedor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el vendedor
                            <span className="font-semibold"> {vendedorToDelete?.full_name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
