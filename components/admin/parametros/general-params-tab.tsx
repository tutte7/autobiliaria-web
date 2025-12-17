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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    List,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
    Search,
    ArrowUpDown,
    Save,
} from 'lucide-react';

// Resource configuration
const RECURSOS = [
    { value: 'segmentos', label: 'Segmentos', singular: 'Segmento' },
    { value: 'combustibles', label: 'Combustibles', singular: 'Combustible' },
    { value: 'cajas', label: 'Cajas', singular: 'Caja' },
    { value: 'estados', label: 'Estados', singular: 'Estado' },
    { value: 'condiciones', label: 'Condiciones', singular: 'Condición' },
    { value: 'monedas', label: 'Monedas', singular: 'Moneda' },
];

// Types
interface Parametro {
    id: number;
    nombre: string;
    activo: boolean;
    orden: number;
    created_at: string;
    updated_at: string;
}

// Form schema
const parametroSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    activo: z.boolean(),
});

type ParametroFormData = z.infer<typeof parametroSchema>;

export function GeneralParamsTab() {
    const [selectedRecurso, setSelectedRecurso] = useState(RECURSOS[0].value);
    const [data, setData] = useState<Parametro[]>([]);
    const [filteredData, setFilteredData] = useState<Parametro[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Parametro | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Parametro | null>(null);

    // Get current resource config
    const currentRecurso = RECURSOS.find((r) => r.value === selectedRecurso) || RECURSOS[0];

    const form = useForm<ParametroFormData>({
        resolver: zodResolver(parametroSchema),
        defaultValues: {
            nombre: '',
            activo: true,
        },
    });

    const { reset, formState: { isSubmitting } } = form;

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.get(`/api/parametros/${selectedRecurso}/`);
            const results = response.data.results || response.data || [];
            setData(results);
            setFilteredData(results);
        } catch (error) {
            console.error(`Error fetching ${selectedRecurso}:`, error);
            toast.error(`Error al cargar ${currentRecurso.label.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    }, [selectedRecurso, currentRecurso.label]);

    // Fetch when resource changes
    useEffect(() => {
        setSearchQuery('');
        fetchData();
    }, [fetchData]);

    // Search filter and sort
    useEffect(() => {
        const filtered = data.filter((item) =>
            item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const sorted = [...filtered].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a.nombre.localeCompare(b.nombre);
            }
            return b.nombre.localeCompare(a.nombre);
        });
        setFilteredData(sorted);
    }, [searchQuery, data, sortDirection]);

    // Optimistic toggle
    const handleToggleStatus = async (item: Parametro) => {
        // Optimistically update
        setData((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, activo: !i.activo } : i))
        );

        try {
            await adminApi.patch(`/api/parametros/${selectedRecurso}/${item.id}/`, {
                activo: !item.activo,
            });
            toast.success(
                `${item.nombre} ${!item.activo ? 'activado' : 'desactivado'}`
            );
        } catch (error) {
            // Revert on error
            setData((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, activo: item.activo } : i))
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
        setSelectedItem(null);
        reset({ nombre: '', activo: true });
        setDialogOpen(true);
    };

    const handleEdit = (item: Parametro) => {
        setSelectedItem(item);
        reset({ nombre: item.nombre, activo: item.activo });
        setDialogOpen(true);
    };

    const handleDeleteClick = (item: Parametro) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        try {
            await adminApi.delete(`/api/parametros/${selectedRecurso}/${itemToDelete.id}/`);
            toast.success(`${currentRecurso.singular} eliminado correctamente`);
            setData((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(`Error al eliminar ${currentRecurso.singular.toLowerCase()}`);
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const onSubmit = async (formData: ParametroFormData) => {
        try {
            if (selectedItem) {
                await adminApi.patch(
                    `/api/parametros/${selectedRecurso}/${selectedItem.id}/`,
                    formData
                );
                toast.success(`${currentRecurso.singular} actualizado correctamente`);
            } else {
                await adminApi.post(`/api/parametros/${selectedRecurso}/`, formData);
                toast.success(`${currentRecurso.singular} creado correctamente`);
            }
            setDialogOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving item:', error);
            const errorMessage =
                error.response?.data?.nombre?.[0] ||
                error.response?.data?.detail ||
                `Error al guardar ${currentRecurso.singular.toLowerCase()}`;
            toast.error(errorMessage);
        }
    };

    return (
        <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    {/* Resource Selector */}
                    <Select value={selectedRecurso} onValueChange={setSelectedRecurso}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Seleccionar catálogo" />
                        </SelectTrigger>
                        <SelectContent>
                            {RECURSOS.map((recurso) => (
                                <SelectItem key={recurso.value} value={recurso.value}>
                                    {recurso.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={`Buscar ${currentRecurso.singular.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-[#0188c8] to-[#0166a1] hover:from-[#0166a1] hover:to-[#014a7a] text-white shadow-md"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar {currentRecurso.singular}
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
                                            Cargando {currentRecurso.label.toLowerCase()}...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <div className="p-3 rounded-full bg-gray-100">
                                            <List className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <span className="text-gray-600 font-medium">
                                            {searchQuery
                                                ? `No se encontraron ${currentRecurso.label.toLowerCase()}`
                                                : `No hay ${currentRecurso.label.toLowerCase()}`}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {searchQuery
                                                ? 'Intenta con otra búsqueda'
                                                : `Agrega un ${currentRecurso.singular.toLowerCase()} para comenzar`}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    <TableCell className="px-4 py-3">
                                        <span className="font-semibold text-gray-900">
                                            {item.nombre}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={item.activo}
                                                onCheckedChange={() => handleToggleStatus(item)}
                                            />
                                            <span
                                                className={`text-sm ${item.activo
                                                    ? 'text-emerald-600'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {item.activo ? 'Activo' : 'Inactivo'}
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
                                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(item)}
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
                            {selectedItem ? (
                                <>
                                    <Save className="h-5 w-5 text-[#0188c8]" />
                                    Editar {currentRecurso.singular}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 text-[#0188c8]" />
                                    Nuevo {currentRecurso.singular}
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedItem
                                ? `Modifica los datos del ${currentRecurso.singular.toLowerCase()}`
                                : `Ingresa los datos para crear un nuevo ${currentRecurso.singular.toLowerCase()}`}
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
                                            <Input placeholder={`Nombre del ${currentRecurso.singular.toLowerCase()}`} {...field} />
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
                                                Los {currentRecurso.label.toLowerCase()} inactivos no aparecerán en los formularios
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
                                            {selectedItem ? 'Guardar Cambios' : `Crear ${currentRecurso.singular}`}
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
                        <AlertDialogTitle>¿Eliminar {currentRecurso.singular.toLowerCase()}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente
                            <span className="font-semibold"> {itemToDelete?.nombre}</span>.
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
