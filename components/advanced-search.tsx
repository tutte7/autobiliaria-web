"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Check, ChevronsUpDown } from "lucide-react"
import { parametersService, Parameter, ModelParameter } from "@/services/parameters"
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

interface AdvancedSearchProps {
  className?: string
}

export default function AdvancedSearch({ className }: AdvancedSearchProps) {
  const router = useRouter()
  const [brands, setBrands] = useState<Parameter[]>([])
  const [models, setModels] = useState<ModelParameter[]>([])
  const [openBrand, setOpenBrand] = useState(false)
  const [openModel, setOpenModel] = useState(false)
  
  const [advancedSearch, setAdvancedSearch] = useState({
    marca: "",
    modelo: "",
    caracteristicas: "",
    precioMin: "",
    precioMax: "",
  })

  // Cargar marcas al montar
  useEffect(() => {
    const fetchBrands = async () => {
      const data = await parametersService.getBrands()
      setBrands(data)
    }
    fetchBrands()
  }, [])

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    const fetchModels = async () => {
      if (advancedSearch.marca) {
        const data = await parametersService.getModels(Number(advancedSearch.marca))
        setModels(data)
      } else {
        setModels([])
      }
    }
    fetchModels()
  }, [advancedSearch.marca])

  // Limpiar modelo si cambia la marca
  useEffect(() => {
    setAdvancedSearch(prev => ({ ...prev, modelo: "" }))
  }, [advancedSearch.marca])

  const handleInputChange = (key: keyof typeof advancedSearch, value: string) => {
    setAdvancedSearch((prev) => ({ ...prev, [key]: value }))
  }

  const handleAdvancedSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()

    const marca = advancedSearch.marca.trim()
    const modelo = advancedSearch.modelo.trim()
    const caracteristicas = advancedSearch.caracteristicas.trim().toLowerCase()
    const precioMin = advancedSearch.precioMin.trim()
    const precioMax = advancedSearch.precioMax.trim()

    if (marca) params.set("marca", marca)
    if (modelo) params.set("modelo", modelo) // Enviamos el ID del modelo
    
    // Si hay características, las mandamos como search genérico
    if (caracteristicas) params.set("search", caracteristicas)

    if (precioMin) params.set("precio_min", precioMin)
    if (precioMax) params.set("precio_max", precioMax)

    const query = params.toString()
    router.push(`/comprar${query ? `?${query}` : ""}`)
  }

  // Buscar nombres para mostrar en botones
  const selectedBrandName = brands.find(
    (b) => b.id.toString() === advancedSearch.marca
  )?.nombre

  const selectedModelName = models.find(
    (m) => m.id.toString() === advancedSearch.modelo
  )?.nombre

  return (
    <div className={className}>
      <form onSubmit={handleAdvancedSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Selector de Marca */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Marca
            </label>
            <Popover open={openBrand} onOpenChange={setOpenBrand}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBrand}
                  className="w-full justify-between rounded-xl border-border/60 bg-white px-3 py-2 text-sm font-normal text-muted-foreground hover:bg-white hover:text-foreground"
                >
                  {selectedBrandName || "Selecciona una marca"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
                            handleInputChange("marca", brand.id.toString())
                            setOpenBrand(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              advancedSearch.marca === brand.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
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

          {/* Selector de Modelo Dinámico */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Modelo
            </label>
            <Popover open={openModel} onOpenChange={setOpenModel}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openModel}
                  disabled={!advancedSearch.marca} // Deshabilitado si no hay marca
                  className="w-full justify-between rounded-xl border-border/60 bg-white px-3 py-2 text-sm font-normal text-muted-foreground hover:bg-white hover:text-foreground disabled:opacity-50"
                >
                  {selectedModelName || (advancedSearch.marca ? "Selecciona un modelo" : "Elige una marca primero")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Buscar modelo..." />
                  <CommandList>
                    <CommandEmpty>No se encontró el modelo.</CommandEmpty>
                    <CommandGroup>
                      {models.map((model) => (
                        <CommandItem
                          key={model.id}
                          value={model.nombre}
                          onSelect={() => {
                            handleInputChange("modelo", model.id.toString())
                            setOpenModel(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              advancedSearch.modelo === model.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.nombre}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Características Adicionales
          </label>
          <input
            type="text"
            value={advancedSearch.caracteristicas}
            onChange={(event) => handleInputChange("caracteristicas", event.target.value)}
            placeholder="Ej: automático, cuero, 4x4"
            className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Precio mínimo
            </label>
            <input
              type="number"
              min={0}
              value={advancedSearch.precioMin}
              onChange={(event) => handleInputChange("precioMin", event.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Precio máximo
            </label>
            <input
              type="number"
              min={0}
              value={advancedSearch.precioMax}
              onChange={(event) => handleInputChange("precioMax", event.target.value)}
              placeholder="Sin límite"
              className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          <Search size={18} /> Buscar vehículos
        </button>
      </form>
    </div>
  )
}
