'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import adminApi from '@/services/admin-api';
import type { Reunion, ReunionCreate } from '@/services/meetings';

// Esquema Zod
const meetingSchema = z.object({
  fecha: z.date({ required_error: 'Seleccione una fecha' }),
  hora: z.string().min(1, 'Seleccione una hora'),
  ubicacion: z.enum(['falucho', 'playa_grande'], { required_error: 'Seleccione ubicacion' }),
  coordinador: z.string().min(1, 'Seleccione coordinador'),
  comprador_nombre: z.string().min(1, 'Ingrese nombre del comprador'),
  vendedor_tipo: z.enum(['existente', 'texto']),
  vendedor: z.string().optional(),
  vendedor_texto: z.string().optional(),
  vehiculo: z.string().optional(),
  notas: z.string().optional(),
  estado: z.enum(['pendiente', 'completada', 'cancelada']).default('pendiente'),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface Usuario { id: number; first_name: string; last_name: string; }
interface Vendedor { id: number; nombre: string; apellido: string; }
interface Vehiculo { id: number; titulo: string; patente: string; }

interface MeetingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Reunion | null;
  selectedDate?: Date;
  onSuccess: () => void;
}

// Horarios disponibles (8:00 a 20:00 cada 30 min)
const HORAS_DISPONIBLES = Array.from({ length: 25 }, (_, i) => {
  const hora = Math.floor(i / 2) + 8;
  const minutos = (i % 2) * 30;
  return `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
});

export function MeetingForm({ open, onOpenChange, meeting, selectedDate, onSuccess }: MeetingFormProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      fecha: selectedDate || new Date(),
      hora: '',
      ubicacion: 'falucho',
      coordinador: '',
      comprador_nombre: '',
      vendedor_tipo: 'texto',
      vendedor: '',
      vendedor_texto: '',
      vehiculo: 'none',
      notas: '',
      estado: 'pendiente',
    },
  });

  const vendedorTipo = form.watch('vendedor_tipo');

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosRes, vendedoresRes, vehiculosRes] = await Promise.all([
          adminApi.get('/api/auth/me/'),
          adminApi.get('/api/vendedores/?activo=true'),
          adminApi.get('/api/vehiculos/?disponible=true'),
        ]);

        // Por ahora solo tenemos el usuario actual, pero podrían agregarse más
        const currentUser = usuariosRes.data;
        setUsuarios([currentUser]);

        setVendedores(vendedoresRes.data.results || vendedoresRes.data || []);
        setVehiculos(vehiculosRes.data.results || vehiculosRes.data || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Resetear form cuando cambia el meeting o se abre/cierra
  useEffect(() => {
    if (open) {
      if (meeting) {
        // Modo edicion
        form.reset({
          fecha: new Date(meeting.fecha),
          hora: meeting.hora.slice(0, 5),
          ubicacion: meeting.ubicacion,
          coordinador: meeting.coordinador.toString(),
          comprador_nombre: meeting.comprador_nombre,
          vendedor_tipo: meeting.vendedor ? 'existente' : 'texto',
          vendedor: meeting.vendedor?.toString() || '',
          vendedor_texto: meeting.vendedor_texto || '',
          vehiculo: meeting.vehiculo?.toString() || 'none',
          notas: meeting.notas || '',
          estado: meeting.estado,
        });
      } else {
        // Modo creacion
        form.reset({
          fecha: selectedDate || new Date(),
          hora: '',
          ubicacion: 'falucho',
          coordinador: '',
          comprador_nombre: '',
          vendedor_tipo: 'texto',
          vendedor: '',
          vendedor_texto: '',
          vehiculo: 'none',
          notas: '',
          estado: 'pendiente',
        });
      }
    }
  }, [open, meeting, selectedDate, form]);

  const onSubmit = async (values: MeetingFormValues) => {
    setIsSubmitting(true);
    try {
      const data: ReunionCreate = {
        fecha: format(values.fecha, 'yyyy-MM-dd'),
        hora: values.hora,
        ubicacion: values.ubicacion,
        coordinador: parseInt(values.coordinador),
        comprador_nombre: values.comprador_nombre,
        vendedor: values.vendedor_tipo === 'existente' && values.vendedor ? parseInt(values.vendedor) : null,
        vendedor_texto: values.vendedor_tipo === 'texto' ? values.vendedor_texto : '',
        vehiculo: values.vehiculo && values.vehiculo !== 'none' ? parseInt(values.vehiculo) : null,
        notas: values.notas || '',
        estado: values.estado,
      };

      if (meeting) {
        await adminApi.patch(`/api/reuniones/${meeting.id}/`, data);
      } else {
        await adminApi.post('/api/reuniones/', data);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error guardando reunion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meeting ? 'Editar Reunion' : 'Nueva Reunion'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar hora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HORAS_DISPONIBLES.map((hora) => (
                          <SelectItem key={hora} value={hora}>
                            {hora}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ubicacion y Coordinador */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ubicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicacion</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar ubicacion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="falucho">Falucho</SelectItem>
                        <SelectItem value="playa_grande">Playa Grande</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coordinador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordinador</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar coordinador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usuarios.map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.id.toString()}>
                            {usuario.first_name} {usuario.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comprador */}
            <FormField
              control={form.control}
              name="comprador_nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Comprador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el nombre del comprador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vendedor - Tipo */}
            <FormField
              control={form.control}
              name="vendedor_tipo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Vendedor</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existente" id="vendedor_existente" />
                        <label htmlFor="vendedor_existente" className="text-sm font-medium">
                          Seleccionar existente
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="texto" id="vendedor_texto" />
                        <label htmlFor="vendedor_texto" className="text-sm font-medium">
                          Escribir nombre
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Vendedor - Select o Input */}
            {vendedorTipo === 'existente' ? (
              <FormField
                control={form.control}
                name="vendedor"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vendedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendedores.map((vendedor) => (
                          <SelectItem key={vendedor.id} value={vendedor.id.toString()}>
                            {vendedor.nombre} {vendedor.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="vendedor_texto"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre del vendedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Vehiculo */}
            <FormField
              control={form.control}
              name="vehiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehiculo (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vehiculo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin vehiculo</SelectItem>
                      {vehiculos.map((vehiculo) => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                          {vehiculo.titulo} ({vehiculo.patente})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado (solo en edicion) */}
            {meeting && (
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Notas */}
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre la reunion..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0188c8] hover:bg-[#0188c8]/90"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {meeting ? 'Guardar Cambios' : 'Crear Reunion'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
