"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, X, Check, ChevronsUpDown, Loader2, Car, User, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

import { parametersService, Parameter, ModelParameter } from "@/services/parameters"
import { publicApiService, TipoVehiculo } from "@/services/public-api"

// Esquema de validación con Zod
const sellVehicleSchema = z.object({
  tipo_vehiculo: z.string().min(1, "Selecciona tipo de vehículo"),
  marca: z.string().min(1, "Selecciona una marca"),
  modelo: z.string().min(1, "Selecciona un modelo"),
  anio: z.coerce.number()
    .min(1900, "El año debe ser mayor a 1900")
    .max(2025, "El año no puede ser mayor a 2025"),
  km: z.coerce.number()
    .min(0, "El kilometraje no puede ser negativo"),
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(6, "El teléfono debe tener al menos 6 caracteres"),
})

type SellVehicleFormData = z.infer<typeof sellVehicleSchema>

export default function SellVehicleForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para los datos de catálogos
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([])
  const [marcas, setMarcas] = useState<Parameter[]>([])
  const [modelos, setModelos] = useState<ModelParameter[]>([])

  // Estados de carga
  const [loadingTipos, setLoadingTipos] = useState(true)
  const [loadingMarcas, setLoadingMarcas] = useState(true)
  const [loadingModelos, setLoadingModelos] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para imágenes
  const [imagenes, setImagenes] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  // Control de popovers
  const [openMarca, setOpenMarca] = useState(false)
  const [openModelo, setOpenModelo] = useState(false)

  // React Hook Form
  const form = useForm<SellVehicleFormData>({
    resolver: zodResolver(sellVehicleSchema),
    defaultValues: {
      tipo_vehiculo: "",
      marca: "",
      modelo: "",
      anio: undefined,
      km: undefined,
      nombre: "",
      email: "",
      telefono: "",
    },
  })

  const selectedMarca = form.watch("marca")

  // Cargar tipos de vehículo al montar
  useEffect(() => {
    const fetchTipos = async () => {
      setLoadingTipos(true)
      const tipos = await publicApiService.getTiposVehiculo()
      setTiposVehiculo(tipos)
      setLoadingTipos(false)
    }
    fetchTipos()
  }, [])

  // Cargar marcas al montar
  useEffect(() => {
    const fetchMarcas = async () => {
      setLoadingMarcas(true)
      const data = await parametersService.getBrands()
      setMarcas(data)
      setLoadingMarcas(false)
    }
    fetchMarcas()
  }, [])

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    if (selectedMarca) {
      const fetchModelos = async () => {
        setLoadingModelos(true)
        form.setValue("modelo", "") // Reset modelo al cambiar marca
        const data = await parametersService.getModels(Number(selectedMarca))
        setModelos(data)
        setLoadingModelos(false)
      }
      fetchModelos()
    } else {
      setModelos([])
    }
  }, [selectedMarca, form])

  // Manejar selección de imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = imagenes.length + files.length

    if (totalImages > 4) {
      toast.error("Máximo 4 imágenes permitidas")
      return
    }

    const newImagenes = [...imagenes, ...files].slice(0, 4)
    setImagenes(newImagenes)

    // Crear previews
    const newPreviews = newImagenes.map(file => URL.createObjectURL(file))
    // Cleanup old object URLs
    previews.forEach(url => URL.revokeObjectURL(url))
    setPreviews(newPreviews)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remover imagen
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setImagenes(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Enviar formulario
  const onSubmit = async (data: SellVehicleFormData) => {
    setIsSubmitting(true)

    try {
      await publicApiService.crearPublicacion(
        {
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          tipo_vehiculo: data.tipo_vehiculo,
          marca: Number(data.marca),
          modelo: Number(data.modelo),
          anio: data.anio,
          km: data.km,
        },
        imagenes
      )

      // Limpiar previews
      previews.forEach(url => URL.revokeObjectURL(url))

      // Redirigir a página de éxito
      router.push("/vender/exito")
    } catch (error: any) {
      console.error("Error al enviar publicación:", error)

      // Mostrar error del API o mensaje genérico
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(", ")
        : "Ocurrió un error al enviar tu solicitud. Intenta nuevamente."

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Sección 1: El Vehículo */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Car className="h-5 w-5 text-primary" />
              El Vehículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de Vehículo */}
              <FormField
                control={form.control}
                name="tipo_vehiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vehículo *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingTipos}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingTipos ? "Cargando..." : "Selecciona tipo"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposVehiculo.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Marca - Combobox searchable */}
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Marca *</FormLabel>
                    <Popover open={openMarca} onOpenChange={setOpenMarca}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={loadingMarcas}
                          >
                            {loadingMarcas ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                              </span>
                            ) : field.value ? (
                              marcas.find((m) => m.id.toString() === field.value)?.nombre
                            ) : (
                              "Selecciona marca"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar marca..." />
                          <CommandList>
                            <CommandEmpty>No se encontró la marca.</CommandEmpty>
                            <CommandGroup>
                              {marcas.map((marca) => (
                                <CommandItem
                                  key={marca.id}
                                  value={marca.nombre}
                                  onSelect={() => {
                                    form.setValue("marca", marca.id.toString())
                                    setOpenMarca(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === marca.id.toString() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {marca.nombre}
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

              {/* Modelo - Combobox searchable dependiente */}
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Modelo *</FormLabel>
                    <Popover open={openModelo} onOpenChange={setOpenModelo}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!selectedMarca || loadingModelos}
                          >
                            {loadingModelos ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                              </span>
                            ) : field.value ? (
                              modelos.find((m) => m.id.toString() === field.value)?.nombre
                            ) : (
                              selectedMarca ? "Selecciona modelo" : "Primero selecciona marca"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar modelo..." />
                          <CommandList>
                            <CommandEmpty>No se encontró el modelo.</CommandEmpty>
                            <CommandGroup>
                              {modelos.map((modelo) => (
                                <CommandItem
                                  key={modelo.id}
                                  value={modelo.nombre}
                                  onSelect={() => {
                                    form.setValue("modelo", modelo.id.toString())
                                    setOpenModelo(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === modelo.id.toString() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {modelo.nombre}
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

              {/* Año */}
              <FormField
                control={form.control}
                name="anio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 2020"
                        min={1900}
                        max={2025}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kilómetros */}
              <FormField
                control={form.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilómetros *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 50000"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sección 2: Fotos */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="h-5 w-5 text-primary" />
              Fotos del Vehículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Área de carga */}
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                imagenes.length >= 4
                  ? "border-muted-foreground/30 bg-muted/30 cursor-not-allowed"
                  : "border-primary/30 hover:border-primary/60"
              )}
              onClick={() => imagenes.length < 4 && fileInputRef.current?.click()}
            >
              <Upload size={40} className={cn(
                "mx-auto mb-3",
                imagenes.length >= 4 ? "text-muted-foreground" : "text-primary"
              )} />
              <p className="font-semibold text-foreground">
                {imagenes.length >= 4 ? "Límite alcanzado" : "Subí tus fotos"}
              </p>
              <p className="text-sm text-muted-foreground">
                {imagenes.length}/4 imágenes
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={imagenes.length >= 4}
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sección 3: Tus Datos */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Tus Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Teléfono */}
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Ej: 1122334455" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botón de envío */}
        <Button
          type="submit"
          size="lg"
          className="w-full py-6 text-lg font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando...
            </span>
          ) : (
            "Enviar Solicitud"
          )}
        </Button>
      </form>
    </Form>
  )
}
