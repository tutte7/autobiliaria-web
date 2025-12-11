"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { parametersService, Parameter } from "@/services/parameters"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

export default function SellVehicleForm() {
  const [brands, setBrands] = useState<Parameter[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [openBrand, setOpenBrand] = useState(false)

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    condition: "usado",
    km: "",
    price: "",
    fuel: "",
    transmission: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    images: [] as File[],
  })

  const [submitted, setSubmitted] = useState(false)

  // Cargar marcas al inicio
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await parametersService.getBrands()
        setBrands(data)
      } catch (error) {
        console.error("Error al cargar marcas:", error)
      } finally {
        setLoadingBrands(false)
      }
    }
    fetchBrands()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 8),
    }))
  }

  const removeImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        brand: "",
        model: "",
        year: "",
        condition: "usado",
        km: "",
        price: "",
        fuel: "",
        transmission: "",
        description: "",
        name: "",
        email: "",
        phone: "",
        city: "",
        images: [],
      })
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Vehicle Information */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Información del Vehículo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-foreground">Marca *</label>
            <Popover open={openBrand} onOpenChange={setOpenBrand}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBrand}
                  className={cn(
                    "w-full justify-between px-3 py-2 h-10 font-normal border-border bg-background hover:bg-background/90",
                    !formData.brand && "text-muted-foreground"
                  )}
                >
                  {loadingBrands ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                    </span>
                  ) : formData.brand ? (
                    brands.find((b) => b.id.toString() === formData.brand)?.nombre || "Marca seleccionada"
                  ) : (
                    "Selecciona marca"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar marca..." />
                  <CommandList>
                    <CommandEmpty>No se encontró la marca.</CommandEmpty>
                    <CommandGroup>
                      {brands.map((brand) => (
                        <CommandItem
                          key={brand.id}
                          value={brand.nombre}
                          onSelect={() => {
                            setFormData((prev) => ({ ...prev, brand: brand.id.toString() }))
                            setOpenBrand(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.brand === brand.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {brand.nombre}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Modelo *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Ej: Corolla, Civic"
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Año *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="2023"
              min="1990"
              max="2025"
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Condición *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
              <option value="seminuevo">Seminuevo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Kilómetros *</label>
            <input
              type="number"
              name="km"
              value={formData.km}
              onChange={handleInputChange}
              placeholder="45000"
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Precio ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="15000"
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Combustible *</label>
            <select
              name="fuel"
              value={formData.fuel}
              onChange={handleInputChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecciona combustible</option>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="hibrido">Híbrido</option>
              <option value="electrico">Eléctrico</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Transmisión *</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecciona transmisión</option>
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
              <option value="cvt">CVT</option>
            </select>
          </div>

        </div>

        <div className="space-y-2">
          <label className="font-semibold text-foreground">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe el estado, características especiales, etc..."
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Fotos del Vehículo</h2>

        <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/60 transition-colors cursor-pointer">
          <label className="cursor-pointer space-y-3">
            <Upload size={40} className="mx-auto text-primary" />
            <div>
              <p className="font-semibold text-foreground">Sube tus fotos</p>
              <p className="text-sm text-muted-foreground">Hasta 8 imágenes</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Image Preview */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((file, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Preview ${idx}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tus Datos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-semibold text-foreground">Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Teléfono *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-foreground">Ciudad *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300"
      >
        Publicar Vehículo
      </button>

      {/* Success Message */}
      {submitted && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold animate-fade-in-up">
          ¡Vehículo publicado exitosamente!
        </div>
      )}
    </form>
  )
}
