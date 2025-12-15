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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, Star, Trash2 } from 'lucide-react';
import adminApi from '@/services/admin-api';
import { toast } from 'sonner';

// --- Zod Schema ---
const vehicleSchema = z.object({
  marca: z.string().min(1, 'Seleccione una marca'),
  modelo: z.string().min(1, 'Seleccione un modelo'),
  version: z.string().optional(),
  anio: z.coerce.number().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  patente: z.string().min(6, 'Mínimo 6 caracteres').toUpperCase(),
  color: z.string().min(1, 'Color requerido'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  moneda: z.string().min(1, 'Seleccione moneda'),
  combustible: z.string().min(1, 'Seleccione combustible'),
  caja: z.string().min(1, 'Seleccione caja'),
  estado: z.string().min(1, 'Seleccione estado'),
  condicion: z.string().min(1, 'Seleccione condición'),
  vendedor_dueno: z.string().min(1, 'Seleccione vendedor'),
  km: z.coerce.number().min(0).default(0),
  vtv: z.boolean().default(false),
  mostrar_en_web: z.boolean().default(true),
  destacar_en_web: z.boolean().default(false),
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
  const [combustibles, setCombustibles] = useState<Parameter[]>([]);
  const [cajas, setCajas] = useState<Parameter[]>([]);
  const [estados, setEstados] = useState<Parameter[]>([]);
  const [condiciones, setCondiciones] = useState<Parameter[]>([]);
  const [monedas, setMonedas] = useState<Parameter[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  
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
      km: 0,
      vtv: false,
      mostrar_en_web: true,
      destacar_en_web: false,
      version: '',
      color: '',
      patente: '',
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
        const [m, c, ca, e, co, mo, v] = await Promise.all([
          adminApi.get('/api/parametros/marcas/?activo=true'),
          adminApi.get('/api/parametros/combustibles/'),
          adminApi.get('/api/parametros/cajas/'),
          adminApi.get('/api/parametros/estados/'),
          adminApi.get('/api/parametros/condiciones/'),
          adminApi.get('/api/parametros/monedas/'),
          adminApi.get('/api/vendedores/?activo=true'),
        ]);

        setMarcas(m.data);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        
        {/* Datos Principales */}
        <Card>
            <CardHeader>
                <CardTitle>Datos Principales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Marca</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Marca" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {marcas.map(m => (
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
                    name="modelo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modelo</FormLabel>
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
                            <FormLabel>Año</FormLabel>
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
                            <FormLabel>Patente</FormLabel>
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
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Blanco" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </CardContent>
        </Card>

        {/* Detalles Técnicos */}
        <Card>
            <CardHeader>
                <CardTitle>Mecánica y Estado</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="combustible"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Combustible</FormLabel>
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
                            <FormLabel>Caja</FormLabel>
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
                            <FormLabel>Estado</FormLabel>
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
                            <FormLabel>Condición</FormLabel>
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
                    name="vtv"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>VTV Vigente</FormLabel>
                                <FormDescription>
                                    ¿El vehículo tiene la VTV al día?
                                </FormDescription>
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
            </CardContent>
        </Card>

        {/* Precio y Comercial */}
        <Card>
            <CardHeader>
                <CardTitle>Comercial</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                     <FormField
                        control={form.control}
                        name="moneda"
                        render={({ field }) => (
                            <FormItem className="w-32">
                                <FormLabel>Moneda</FormLabel>
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
                                <FormLabel>Precio</FormLabel>
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
                    name="vendedor_dueno"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendedor / Dueño</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mostrar_en_web"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Mostrar en Web</FormLabel>
                                <FormDescription>
                                    Visible públicamente en el catálogo.
                                </FormDescription>
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
                    name="destacar_en_web"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Destacado</FormLabel>
                                <FormDescription>
                                    Aparecerá en la sección de destacados.
                                </FormDescription>
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
            </CardContent>
        </Card>

        {/* Imágenes */}
        <Card>
            <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <p className="text-sm text-muted-foreground">La primera imagen será la principal (portada).</p>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="text-sm text-gray-500"><span className="font-semibold">Click para subir</span> o arrastrar fotos</p>
                                <p className="text-xs text-gray-500">JPG, PNG (MAX. 15 fotos)</p>
                            </div>
                            <input 
                                id="dropzone-file" 
                                type="file" 
                                className="hidden" 
                                multiple 
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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

        <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
            </Button>
        </div>

      </form>
    </Form>
  );
}
