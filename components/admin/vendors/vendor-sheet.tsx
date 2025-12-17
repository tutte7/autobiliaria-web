'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import adminApi from '@/services/admin-api';
import { toast } from 'sonner';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Save, UserPlus } from 'lucide-react';
import type { Vendedor } from '@/app/admin/vendedores/page';

const vendedorSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    apellido: z.string().min(1, 'El apellido es requerido'),
    dni: z.string().min(1, 'El DNI es requerido'),
    email: z.string().email('El email no es válido'),
    celular: z.string().min(1, 'El celular es requerido'),
    direccion: z.string().min(1, 'La dirección es requerida'),
    comentarios: z.string().optional(),
    activo: z.boolean(),
    tiene_cartel: z.boolean(),
});

type VendedorFormData = z.infer<typeof vendedorSchema>;

interface VendorSheetProps {
    vendedor: Vendedor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function VendorSheet({ vendedor, open, onOpenChange, onSuccess }: VendorSheetProps) {
    const isEditMode = !!vendedor;

    const form = useForm<VendedorFormData>({
        resolver: zodResolver(vendedorSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            dni: '',
            email: '',
            celular: '',
            direccion: '',
            comentarios: '',
            activo: true,
            tiene_cartel: false,
        },
    });

    const { reset, formState: { isSubmitting } } = form;

    // Reset form when vendedor changes or sheet opens/closes
    useEffect(() => {
        if (open) {
            if (vendedor) {
                reset({
                    nombre: vendedor.nombre,
                    apellido: vendedor.apellido,
                    dni: vendedor.dni,
                    email: vendedor.email,
                    celular: vendedor.celular,
                    direccion: vendedor.direccion,
                    comentarios: vendedor.comentarios || '',
                    activo: vendedor.activo,
                    tiene_cartel: vendedor.tiene_cartel,
                });
            } else {
                reset({
                    nombre: '',
                    apellido: '',
                    dni: '',
                    email: '',
                    celular: '',
                    direccion: '',
                    comentarios: '',
                    activo: true,
                    tiene_cartel: false,
                });
            }
        }
    }, [vendedor, open, reset]);

    const onSubmit = async (data: VendedorFormData) => {
        try {
            if (isEditMode) {
                await adminApi.patch(`/api/vendedores/${vendedor.id}/`, data);
                toast.success('Vendedor actualizado correctamente');
            } else {
                await adminApi.post('/api/vendedores/', data);
                toast.success('Vendedor creado correctamente');
            }
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error('Error saving vendedor:', error);
            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.email?.[0] ||
                error.response?.data?.dni?.[0] ||
                'Error al guardar vendedor';
            toast.error(errorMessage);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader className="pb-4 border-b">
                    <SheetTitle className="text-xl flex items-center gap-2">
                        {isEditMode ? (
                            <>
                                <Save className="h-5 w-5 text-[#0188c8]" />
                                Editar Vendedor
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5 text-[#0188c8]" />
                                Nuevo Vendedor
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditMode
                            ? 'Modifica los datos del vendedor'
                            : 'Completa los datos para agregar un nuevo vendedor'}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="py-6 space-y-4">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apellido"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Pérez" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* DNI */}
                        <FormField
                            control={form.control}
                            name="dni"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>DNI</FormLabel>
                                    <FormControl>
                                        <Input placeholder="12345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email y Celular */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="juan@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="celular"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Celular</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1122334455" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Dirección */}
                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Av. Corrientes 1234, CABA" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Comentarios */}
                        <FormField
                            control={form.control}
                            name="comentarios"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comentarios (opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notas adicionales sobre el vendedor..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Switches */}
                        <div className="space-y-4 pt-2">
                            <FormField
                                control={form.control}
                                name="activo"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">¿Está Activo?</FormLabel>
                                            <p className="text-sm text-gray-500">
                                                Indica si el vendedor está activo en el sistema
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

                            <FormField
                                control={form.control}
                                name="tiene_cartel"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">¿Tiene Cartel?</FormLabel>
                                            <p className="text-sm text-gray-500">
                                                Indica si el vehículo tiene cartel de venta
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
                        </div>

                        <SheetFooter className="pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#0188c8] to-[#0166a1] hover:from-[#0166a1] hover:to-[#014a7a]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {isEditMode ? 'Guardar Cambios' : 'Crear Vendedor'}
                                    </>
                                )}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
