'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Tags,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
    Search,
    ArrowUpDown,
    Save,
} from 'lucide-react';

// Types
interface Marca {
    id: number;
    nombre: string;
    activo: boolean;
    orden: number;
    created_at: string;
    updated_at: string;
}

// Form schema
const marcaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    activo: z.boolean(),
});

type MarcaFormData = z.infer<typeof marcaSchema>;

export function MarcasTab() {
    const [data, setData] = useState<Marca[]>([]);
    const [filteredData, setFilteredData] = useState<Marca[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null);

    const form = useForm<MarcaFormData>({
        resolver: zodResolver(marcaSchema),
        defaultValues: {
            nombre: '',
            activo: true,
        },
    });

    const { reset, formState: { isSubmitting } } = form;

    // Fetch data
    const fetchMarcas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.get('/api/parametros/marcas/');
            const results = response.data.results || response.data || [];
            setData(results);
            setFilteredData(results);
        } catch (error) {
            console.error('Error fetching marcas:', error);
            toast.error('Error al cargar marcas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMarcas();
    }, [fetchMarcas]);

    // Search filter
    useEffect(() => {
        const filtered = data.filter((marca) =>
            marca.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );
        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a.nombre.localeCompare(b.nombre);
            }
            return b.nombre.localeCompare(a.nombre);
        });
        setFilteredData(sorted);
    }, [searchQuery, data, sortDirection]);

    // Optimistic toggle
    const handleToggleStatus = async (marca: Marca) => {
        // Optimistically update
        setData((prev) =>
            prev.map((m) => (m.id === marca.id ? { ...m, activo: !m.activo } : m))
        );

        try {
            await adminApi.patch(`/api/parametros/marcas/${marca.id}/`, {
                activo: !marca.activo,
            });
            toast.success(
                `${marca.nombre} ${!marca.activo ? 'activada' : 'desactivada'}`
            );
        } catch (error) {
            // Revert on error
            setData((prev) =>
                prev.map((m) => (m.id === marca.id ? { ...m, activo: marca.activo } : m))
            );
            console.error('Error toggling status:', error);
            toast.error('Error al actualizar estado');
        }
    };

    // Sort toggle
    const toggleSort = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    // Dialog handlers
    const handleAdd = () => {
        setSelectedMarca(null);
        reset({ nombre: '', activo: true });
        setDialogOpen(true);
    };

    const handleEdit = (marca: Marca) => {
        setSelectedMarca(marca);
        reset({ nombre: marca.nombre, activo: marca.activo });
        setDialogOpen(true);
    };

    const handleDeleteClick = (marca: Marca) => {
        setMarcaToDelete(marca);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!marcaToDelete) return;

        try {
            await adminApi.delete(`/api/parametros/marcas/${marcaToDelete.id}/`);
            toast.success('Marca eliminada correctamente');
            setData((prev) => prev.filter((m) => m.id !== marcaToDelete.id));
        } catch (error) {
            console.error('Error deleting marca:', error);
            toast.error('Error al eliminar marca');
        } finally {
            setDeleteDialogOpen(false);
            setMarcaToDelete(null);
        }
    };

    const onSubmit = async (formData: MarcaFormData) => {
        try {
            if (selectedMarca) {
                await adminApi.patch(
                    `/api/parametros/marcas/${selectedMarca.id}/`,
                    formData
                );
                toast.success('Marca actualizada correctamente');
            } else {
                await adminApi.post('/api/parametros/marcas/', formData);
                toast.success('Marca creada correctamente');
            }
            setDialogOpen(false);
            fetchMarcas();
        } catch (error: any) {
            console.error('Error saving marca:', error);
            const errorMessage =
                error.response?.data?.nombre?.[0] ||
                error.response?.data?.detail ||
                'Error al guardar marca';
            toast.error(errorMessage);
        }
    };

    return (
        <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar marca..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-[#0188c8] to-[#0166a1] hover:from-[#0166a1] hover:to-[#014a7a] text-white shadow-md"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Marca
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                            <TableHead className="h-12 px-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSort}
                                    className="text-xs font-semibold text-gray-600 uppercase tracking-wider -ml-2 hover:bg-gray-100"
                                >
                                    Nombre
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </Button>
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
                                <TableCell colSpan={3} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#0188c8]" />
                                        <span className="text-sm text-gray-500">
                                            Cargando marcas...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <div className="p-3 rounded-full bg-gray-100">
                                            <Tags className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <span className="text-gray-600 font-medium">
                                            {searchQuery
                                                ? 'No se encontraron marcas'
                                                : 'No hay marcas'}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {searchQuery
                                                ? 'Intenta con otra búsqueda'
                                                : 'Agrega una marca para comenzar'}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((marca) => (
                                <TableRow
                                    key={marca.id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    <TableCell className="px-4 py-3">
                                        <span className="font-semibold text-gray-900">
                                            {marca.nombre}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={marca.activo}
                                                onCheckedChange={() => handleToggleStatus(marca)}
                                            />
                                            <span
                                                className={`text-sm ${marca.activo
                                                        ? 'text-emerald-600'
                                                        : 'text-gray-400'
                                                    }`}
                                            >
                                                {marca.activo ? 'Activo' : 'Inactivo'}
                                            </span>
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
                                                <DropdownMenuItem onClick={() => handleEdit(marca)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(marca)}
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

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedMarca ? (
                                <>
                                    <Save className="h-5 w-5 text-[#0188c8]" />
                                    Editar Marca
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 text-[#0188c8]" />
                                    Nueva Marca
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMarca
                                ? 'Modifica los datos de la marca'
                                : 'Ingresa los datos para crear una nueva marca'}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Toyota" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="activo"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">¿Activo?</FormLabel>
                                            <p className="text-sm text-gray-500">
                                                Las marcas inactivas no aparecerán en los formularios
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-[#0188c8] to-[#0166a1] hover:from-[#0166a1] hover:to-[#014a7a]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {selectedMarca ? 'Guardar Cambios' : 'Crear Marca'}
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar marca?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la
                            marca
                            <span className="font-semibold"> {marcaToDelete?.nombre}</span>.
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
