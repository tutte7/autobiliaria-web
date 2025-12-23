'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, UploadCloud, Star, Trash2, Car, Wrench, DollarSign, ImageIcon, Check, ChevronsUpDown, Tag, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import adminApi from '@/services/admin-api';
import { toast } from 'sonner';
import { VendorSheet } from '@/components/admin/vendors/vendor-sheet';

// --- Tipos de Vehículo (constante local) ---
const TIPOS_VEHICULO = [
  { id: 'auto', nombre: 'Auto' },
  { id: 'camioneta', nombre: 'Camioneta' },
  { id: 'camion', nombre: 'Camión' },
  { id: 'moto', nombre: 'Moto' },
];

// --- Zod Schema ---
const vehicleSchema = z.object({
  // Datos principales
  tipo_vehiculo: z.string().default('auto'),
  marca: z.string().min(1, 'Seleccione una marca'),
  modelo: z.string().min(1, 'Seleccione un modelo'),
  version: z.string().optional(),
  anio: z.coerce.number().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  patente: z.string().min(6, 'Mínimo 6 caracteres').toUpperCase(),
  color: z.string().min(1, 'Color requerido'),
  // Segmentos
  segmento1: z.string().optional(),
  segmento2: z.string().optional(),
  // Mecánica y estado
  combustible: z.string().min(1, 'Seleccione combustible'),
  caja: z.string().min(1, 'Seleccione caja'),
  km: z.coerce.number().min(0).default(0),
  estado: z.string().min(1, 'Seleccione estado'),
  condicion: z.string().min(1, 'Seleccione condición'),
  vtv: z.boolean().default(false),
  cant_duenos: z.coerce.number().min(1, 'Mínimo 1 dueño').default(1),
  plan_ahorro: z.boolean().default(false),
  // Comercial
  moneda: z.string().min(1, 'Seleccione moneda'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  porcentaje_financiacion: z.coerce.number().min(0).max(100).optional().nullable(),
  vendedor_dueno: z.string().min(1, 'Seleccione vendedor'),
  mostrar_en_web: z.boolean().default(true),
  destacar_en_web: z.boolean().default(false),
  oportunidad: z.boolean().default(false),
  oportunidad_grupo: z.boolean().default(false),
  reventa: z.boolean().default(false),
  // Notas internas
  comentario_carga: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

// --- Interfaces para Parámetros ---
interface Parameter { id: number; nombre: string; }
interface Vendedor { id: number; full_name: string; dni: string; }

// Interfaz para imágenes existentes
export interface ExistingImage {
    id: number;
    imagen_url: string;
    es_principal: boolean;
    orden: number;
}

interface VehicleFormProps {
  initialData?: Partial<VehicleFormValues> & { modelo?: string }; // initialData puede traer strings o numbers, pero lo convertiremos
  existingImages?: ExistingImage[];
  onSubmit: (data: VehicleFormValues, newImages: File[], deletedImageIds: number[]) => Promise<void>;
  isSubmitting?: boolean;
}

export function VehicleForm({ initialData, existingImages = [], onSubmit, isSubmitting = false }: VehicleFormProps) {
  // --- Estados de Parámetros ---
  const [marcas, setMarcas] = useState<Parameter[]>([]);
  const [modelos, setModelos] = useState<Parameter[]>([]);
  const [segmentos, setSegmentos] = useState<Parameter[]>([]);
  const [combustibles, setCombustibles] = useState<Parameter[]>([]);
  const [cajas, setCajas] = useState<Parameter[]>([]);
  const [estados, setEstados] = useState<Parameter[]>([]);
  const [condiciones, setCondiciones] = useState<Parameter[]>([]);
  const [monedas, setMonedas] = useState<Parameter[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  // --- Estado para Combobox de Marca ---
  const [openMarca, setOpenMarca] = useState(false);

  // --- Estado para VendorSheet ---
  const [showVendorSheet, setShowVendorSheet] = useState(false);
  
  // --- Estado de Imágenes ---
  // Imágenes que YA existen en el servidor
  const [serverImages, setServerImages] = useState<ExistingImage[]>([]);
  // IDs de imágenes eliminadas para enviar al backend
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  
  // Imágenes NUEVAS seleccionadas localmente
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Ref para evitar loops en effects
  const initialLoadRef = useRef(true);

  // --- React Hook Form ---
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      tipo_vehiculo: 'auto',
      km: 0,
      vtv: false,
      cant_duenos: 1,
      plan_ahorro: false,
      mostrar_en_web: true,
      destacar_en_web: false,
      oportunidad: false,
      oportunidad_grupo: false,
      reventa: false,
      version: '',
      color: '',
      patente: '',
      segmento1: '',
      segmento2: '',
      porcentaje_financiacion: null,
      comentario_carga: '',
      ...initialData,
    },
  });

  const selectedMarca = form.watch('marca');

  // --- Initialize State ---
  useEffect(() => {
      if (existingImages && initialLoadRef.current) {
          // Ordenar por 'orden' o poner la principal primero
          const sorted = [...existingImages].sort((a, b) => {
              if (a.es_principal) return -1;
              if (b.es_principal) return 1;
              return a.orden - b.orden;
          });
          setServerImages(sorted);
          initialLoadRef.current = false;
      }
  }, [existingImages]);

  // --- Fetch Parameters ---
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const [m, s, c, ca, e, co, mo, v] = await Promise.all([
          adminApi.get('/api/parametros/marcas/?activo=true'),
          adminApi.get('/api/parametros/segmentos/'),
          adminApi.get('/api/parametros/combustibles/'),
          adminApi.get('/api/parametros/cajas/'),
          adminApi.get('/api/parametros/estados/'),
          adminApi.get('/api/parametros/condiciones/'),
          adminApi.get('/api/parametros/monedas/'),
          adminApi.get('/api/vendedores/?activo=true'),
        ]);

        setMarcas(m.data);
        setSegmentos(s.data);
        setCombustibles(c.data);
        setCajas(ca.data);
        setEstados(e.data);
        setCondiciones(co.data);
        setMonedas(mo.data);
        setVendedores(v.data);
      } catch (error) {
        toast.error('Error cargando parámetros');
        console.error(error);
      }
    };
    fetchParameters();
  }, []);

  // --- Función para recargar vendedores ---
  const fetchVendedores = async () => {
    try {
      const res = await adminApi.get('/api/vendedores/?activo=true');
      setVendedores(res.data);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    }
  };

  // --- Fetch Models ---
  useEffect(() => {
    if (!selectedMarca) {
        setModelos([]);
        return;
    }

    const fetchModelos = async () => {
      try {
        const res = await adminApi.get(`/api/parametros/modelos/?marca=${selectedMarca}`);
        setModelos(res.data);
        
        const currentModelId = form.getValues('modelo');
        if (currentModelId) {
            const modelExists = res.data.some((m: Parameter) => m.id.toString() === currentModelId.toString());
            if (!modelExists) {
                form.setValue('modelo', '');
            }
        }
      } catch (error) {
          console.error(error);
      }
    };

    fetchModelos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarca]); 

  // --- Image Handlers ---

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
      
      const urls = files.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...urls]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeServerImage = (id: number) => {
      setServerImages(prev => prev.filter(img => img.id !== id));
      setDeletedImageIds(prev => [...prev, id]);
  };

  const handleSubmit = (values: VehicleFormValues) => {
    onSubmit(values, newImages, deletedImageIds);
  };

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* Datos Principales */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow pt-0 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white py-4 !pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-xl bg-[#0188c8]/10">
                        <Car className="h-5 w-5 text-[#0188c8]" />
                    </div>
                    Datos Principales
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">

                <FormField
                    control={form.control}
                    name="tipo_vehiculo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Vehículo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {TIPOS_VEHICULO.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Marca <span className="text-red-500">*</span></FormLabel>
                            <Popover open={openMarca} onOpenChange={setOpenMarca}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openMarca}
                                            className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value
                                                ? marcas.find((m) => m.id.toString() === field.value)?.nombre
                                                : "Buscar marca..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Buscar marca..." />
                                        <CommandList>
                                            <CommandEmpty>No se encontró la marca.</CommandEmpty>
                                            <CommandGroup>
                                                {marcas.map((m) => (
                                                    <CommandItem
                                                        key={m.id}
                                                        value={m.nombre}
                                                        onSelect={() => {
                                                            field.onChange(m.id.toString())
                                                            setOpenMarca(false)
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", field.value === m.id.toString() ? "opacity-100" : "opacity-0")} />
                                                        {m.nombre}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modelo <span className="text-red-500">*</span></FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                value={field.value?.toString()}
                                disabled={!selectedMarca}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Modelo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {modelos.map(m => (
                                        <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Versión (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: 1.6 Titanium" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="anio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Año <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="patente"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patente <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input 
                                    {...field} 
                                    value={field.value || ''}
                                    className="uppercase" 
                                    onChange={e => field.onChange(e.target.value.toUpperCase())}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                 <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Blanco" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </CardContent>
        </Card>

        {/* Segmentos */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow pt-0 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white py-4 !pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-xl bg-emerald-100">
                        <Tag className="h-5 w-5 text-emerald-600" />
                    </div>
                    Segmentos
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <FormField
                    control={form.control}
                    name="segmento1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Segmento Principal</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                                value={field.value?.toString() || 'none'}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Segmento" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">Sin segmento</SelectItem>
                                    {segmentos.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-gray-500">
                                Ej: SUV, Sedan, Hatchback
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="segmento2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Segmento Secundario (Opcional)</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                                value={field.value?.toString() || 'none'}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Segmento" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">Sin segmento</SelectItem>
                                    {segmentos.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-gray-500">
                                Categoría adicional si aplica
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        {/* Detalles Técnicos */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow pt-0 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white py-4 !pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-xl bg-[#0188c8]/10">
                        <Wrench className="h-5 w-5 text-[#0188c8]" />
                    </div>
                    Mecánica y Estado
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <FormField
                    control={form.control}
                    name="combustible"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Combustible <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {combustibles.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="caja"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Caja <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cajas.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="km"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kilómetros</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value || 0} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {estados.map(e => (
                                        <SelectItem key={e.id} value={e.id.toString()}>{e.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="condicion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Condición <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {condiciones.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cant_duenos"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cantidad de Dueños</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} {...field} value={field.value || 1} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Switches de Mecánica en grid compacto */}
                <div className="md:col-span-3 grid grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name="vtv"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">VTV Vigente</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-[#0188c8]"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="plan_ahorro"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">Plan de Ahorro</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-[#0188c8]"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>

        {/* Precio y Comercial */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow pt-0 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white py-4 !pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-xl bg-emerald-100">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    Comercial
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <div className="flex gap-4">
                     <FormField
                        control={form.control}
                        name="moneda"
                        render={({ field }) => (
                            <FormItem className="w-32">
                                <FormLabel>Moneda <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="$" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {monedas.map(m => (
                                            <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="precio"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Precio <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value || 0} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="porcentaje_financiacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>% Financiación (Opcional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={0.01}
                                    placeholder="0"
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500">
                                Porcentaje adicional al precio por financiación
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="vendedor_dueno"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendedor / Dueño <span className="text-red-500">*</span></FormLabel>
                            <div className="flex gap-2">
                                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Seleccionar Vendedor" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {vendedores.map(v => (
                                            <SelectItem key={v.id} value={v.id.toString()}>
                                                {v.full_name} ({v.dni})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowVendorSheet(true)}
                                    title="Agregar nuevo vendedor"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Switches de Visibilidad en grid compacto */}
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name="mostrar_en_web"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">Mostrar en Web</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-[#0188c8]"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="destacar_en_web"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">Destacado</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-amber-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="oportunidad"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">Oportunidad</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="oportunidad_grupo"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">Oportunidad Grupo</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reventa"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                                <FormLabel className="text-sm font-medium cursor-pointer">Reventa</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-orange-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>

        {/* Notas Internas */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow pt-0 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white py-4 !pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-xl bg-slate-100">
                        <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    Notas Internas
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <FormField
                    control={form.control}
                    name="comentario_carga"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comentarios / Observaciones</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Notas internas sobre el vehículo (no visibles públicamente)..."
                                    className="min-h-[100px] resize-y"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500">
                                Información adicional para uso interno
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        {/* Imágenes */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow pt-0 overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white py-4 !pb-4">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 rounded-xl bg-slate-100">
                            <ImageIcon className="h-5 w-5 text-slate-600" />
                        </div>
                        Imágenes
                    </CardTitle>
                    <span className={cn(
                        "text-sm font-medium px-3 py-1 rounded-full",
                        serverImages.length + newImages.length >= 15
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                    )}>
                        {serverImages.length + newImages.length} / 15
                    </span>
                </div>
                <p className="text-sm text-gray-500">La primera imagen será la principal (portada).</p>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid gap-6">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-[#0188c8]/5 border-gray-300 hover:border-[#0188c8]/50 transition-all duration-200 group">
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="p-4 rounded-full bg-[#0188c8]/10 mb-4 group-hover:bg-[#0188c8]/20 transition-colors">
                                    <UploadCloud className="w-10 h-10 text-[#0188c8]" />
                                </div>
                                <p className="text-base text-gray-600">
                                    <span className="font-semibold text-[#0188c8]">Click para subir</span> o arrastra las fotos
                                </p>
                                <p className="text-sm text-gray-400 mt-2">JPG, PNG, WEBP (máximo 15 fotos)</p>
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                disabled={serverImages.length + newImages.length >= 15}
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Imágenes Guardadas (Server) */}
                        {serverImages.map((img) => (
                             <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-100">
                                <img src={img.imagen_url} alt="Server Image" className="w-full h-full object-cover" />
                                
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button
                                        type="button"
                                        onClick={() => removeServerImage(img.id)}
                                        className="bg-white/80 p-1 rounded-full text-red-600 hover:bg-white transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {img.es_principal && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/90 p-1 flex justify-center text-white">
                                        <span className="text-xs font-medium flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-white" /> Principal
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Imágenes Nuevas (Local) */}
                        {newImagePreviews.map((url, index) => (
                            <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-100 ring-2 ring-blue-500/20">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                
                                <div className="absolute top-2 right-2 flex gap-1">
                                     <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="bg-white/80 p-1 rounded-full text-red-600 hover:bg-white transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Etiqueta "Nueva" */}
                                <div className="absolute top-2 left-2">
                                     <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow">Nueva</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Button
                variant="outline"
                type="button"
                onClick={() => window.history.back()}
                className="rounded-xl px-6"
            >
                Cancelar
            </Button>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl px-8 bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 shadow-md shadow-[#0188c8]/25 hover:shadow-lg hover:shadow-[#0188c8]/30"
            >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
            </Button>
        </div>

      </form>
    </Form>

    {/* Modal para agregar vendedor */}
    <VendorSheet
      vendedor={null}
      open={showVendorSheet}
      onOpenChange={setShowVendorSheet}
      onSuccess={(newVendor) => {
        fetchVendedores();
        if (newVendor) {
          form.setValue('vendedor_dueno', newVendor.id.toString());
        }
      }}
    />
    </>
  );
}
