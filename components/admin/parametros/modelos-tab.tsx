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
import { Badge } from '@/components/ui/badge';
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
    CarFront,
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
}

interface Modelo {
    id: number;
    nombre: string;
    marca: number;
    marca_nombre: string;
    activo: boolean;
    orden: number;
    created_at: string;
    updated_at: string;
}

// Form schema
const modeloSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    marca: z.string().min(1, 'La marca es requerida'),
    activo: z.boolean(),
});

type ModeloFormData = z.infer<typeof modeloSchema>;

export function ModelosTab() {
    const [data, setData] = useState<Modelo[]>([]);
    const [filteredData, setFilteredData] = useState<Modelo[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [modeloToDelete, setModeloToDelete] = useState<Modelo | null>(null);

    const form = useForm<ModeloFormData>({
        resolver: zodResolver(modeloSchema),
        defaultValues: {
            nombre: '',
            marca: '',
            activo: true,
        },
    });

    const { reset, formState: { isSubmitting } } = form;

    // Fetch modelos
    const fetchModelos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.get('/api/parametros/modelos/');
            const results = response.data.results || response.data || [];
            setData(results);
            setFilteredData(results);
        } catch (error) {
            console.error('Error fetching modelos:', error);
            toast.error('Error al cargar modelos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch active marcas for select
    const fetchMarcas = useCallback(async () => {
        try {
            const response = await adminApi.get('/api/parametros/marcas/?activo=true');
            const results = response.data.results || response.data || [];
            setMarcas(results);
        } catch (error) {
            console.error('Error fetching marcas:', error);
        }
    }, []);

    useEffect(() => {
        fetchModelos();
        fetchMarcas();
    }, [fetchModelos, fetchMarcas]);

    // Search filter
    useEffect(() => {
        const filtered = data.filter(
            (modelo) =>
                modelo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                modelo.marca_nombre.toLowerCase().includes(searchQuery.toLowerCase())
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
    const handleToggleStatus = async (modelo: Modelo) => {
        // Optimistically update
        setData((prev) =>
            prev.map((m) => (m.id === modelo.id ? { ...m, activo: !m.activo } : m))
        );

        try {
            await adminApi.patch(`/api/parametros/modelos/${modelo.id}/`, {
                activo: !modelo.activo,
            });
            toast.success(
                `${modelo.nombre} ${!modelo.activo ? 'activado' : 'desactivado'}`
            );
        } catch (error) {
            // Revert on error
            setData((prev) =>
                prev.map((m) =>
                    m.id === modelo.id ? { ...m, activo: modelo.activo } : m
                )
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
        setSelectedModelo(null);
        reset({ nombre: '', marca: '', activo: true });
        setDialogOpen(true);
    };

    const handleEdit = (modelo: Modelo) => {
        setSelectedModelo(modelo);
        reset({
            nombre: modelo.nombre,
            marca: modelo.marca.toString(),
            activo: modelo.activo,
        });
        setDialogOpen(true);
    };

    const handleDeleteClick = (modelo: Modelo) => {
        setModeloToDelete(modelo);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!modeloToDelete) return;

        try {
            await adminApi.delete(`/api/parametros/modelos/${modeloToDelete.id}/`);
            toast.success('Modelo eliminado correctamente');
            setData((prev) => prev.filter((m) => m.id !== modeloToDelete.id));
        } catch (error) {
            console.error('Error deleting modelo:', error);
            toast.error('Error al eliminar modelo');
        } finally {
            setDeleteDialogOpen(false);
            setModeloToDelete(null);
        }
    };

    const onSubmit = async (formData: ModeloFormData) => {
        const payload = {
            nombre: formData.nombre,
            marca: parseInt(formData.marca),
            activo: formData.activo,
        };

        try {
            if (selectedModelo) {
                await adminApi.patch(
                    `/api/parametros/modelos/${selectedModelo.id}/`,
                    payload
                );
                toast.success('Modelo actualizado correctamente');
            } else {
                await adminApi.post('/api/parametros/modelos/', payload);
                toast.success('Modelo creado correctamente');
            }
            setDialogOpen(false);
            fetchModelos();
        } catch (error: any) {
            console.error('Error saving modelo:', error);
            const errorMessage =
                error.response?.data?.nombre?.[0] ||
                error.response?.data?.marca?.[0] ||
                error.response?.data?.detail ||
                'Error al guardar modelo';
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
                        placeholder="Buscar modelo o marca..."
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
                    Nuevo Modelo
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
                                Marca
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
                                <TableCell colSpan={4} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#0188c8]" />
                                        <span className="text-sm text-gray-500">
                                            Cargando modelos...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <div className="p-3 rounded-full bg-gray-100">
                                            <CarFront className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <span className="text-gray-600 font-medium">
                                            {searchQuery
                                                ? 'No se encontraron modelos'
                                                : 'No hay modelos'}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {searchQuery
                                                ? 'Intenta con otra búsqueda'
                                                : 'Agrega un modelo para comenzar'}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((modelo) => (
                                <TableRow
                                    key={modelo.id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    <TableCell className="px-4 py-3">
                                        <span className="font-semibold text-gray-900">
                                            {modelo.nombre}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                            {modelo.marca_nombre}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={modelo.activo}
                                                onCheckedChange={() => handleToggleStatus(modelo)}
                                            />
                                            <span
                                                className={`text-sm ${modelo.activo
                                                        ? 'text-emerald-600'
                                                        : 'text-gray-400'
                                                    }`}
                                            >
                                                {modelo.activo ? 'Activo' : 'Inactivo'}
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
                                                <DropdownMenuItem onClick={() => handleEdit(modelo)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(modelo)}
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
                            {selectedModelo ? (
                                <>
                                    <Save className="h-5 w-5 text-[#0188c8]" />
                                    Editar Modelo
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 text-[#0188c8]" />
                                    Nuevo Modelo
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedModelo
                                ? 'Modifica los datos del modelo'
                                : 'Ingresa los datos para crear un nuevo modelo'}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar marca" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {marcas.map((marca) => (
                                                    <SelectItem
                                                        key={marca.id}
                                                        value={marca.id.toString()}
                                                    >
                                                        {marca.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre del Modelo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Corolla" {...field} />
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
                                                Los modelos inactivos no aparecerán en los
                                                formularios
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
                                            {selectedModelo ? 'Guardar Cambios' : 'Crear Modelo'}
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
                        <AlertDialogTitle>¿Eliminar modelo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el
                            modelo
                            <span className="font-semibold"> {modeloToDelete?.nombre}</span> de{' '}
                            <span className="font-semibold">
                                {modeloToDelete?.marca_nombre}
                            </span>
                            .
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
