"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterState {
  brand: string
  model: string
  opportunity: boolean
  priceMin: number
  priceMax: number
  year: number
  km: number
  fuel: string
  transmission: string
  segment: string
  state: string
}

interface VehicleFiltersProps {
  onChange?: (filters: FilterState) => void
  externalFilters?: FilterState
}

const INITIAL_FILTERS: FilterState = {
  brand: "",
  model: "",
  opportunity: false,
  priceMin: 0,
  priceMax: 100000000,
  year: 2000,
  km: 200000,
  fuel: "",
  transmission: "",
  segment: "",
  state: "",
}

export default function VehicleFilters({ onChange, externalFilters }: VehicleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [isOpen, setIsOpen] = useState(false)

  // Estados para catálogos
  const [brands, setBrands] = useState<Parameter[]>([])
  const [models, setModels] = useState<ModelParameter[]>([])
  const [fuels, setFuels] = useState<Parameter[]>([])
  const [transmissions, setTransmissions] = useState<Parameter[]>([])
  const [segments, setSegments] = useState<Parameter[]>([])
  const [states, setStates] = useState<Parameter[]>([]) // Estados 0km/Usado

  // Loading states
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)

  // Popover states
  const [openBrand, setOpenBrand] = useState(false)
  const [openModel, setOpenModel] = useState(false)

  // Cargar catálogos estáticos al inicio
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [brandsData, fuelsData, transmData, segmentsData, statesData] = await Promise.all([
          parametersService.getBrands(),
          parametersService.getFuels(),
          parametersService.getTransmissions(),
          parametersService.getSegments(),
          parametersService.getStates(),
        ])
        setBrands(brandsData)
        setFuels(fuelsData)
        setTransmissions(transmData)
        setSegments(segmentsData)
        setStates(statesData)
      } catch (error) {
        console.error("Error al cargar catálogos:", error)
      } finally {
        setLoadingBrands(false)
      }
    }
    fetchCatalogs()
  }, [])

  // Cargar modelos cuando cambia la marca (Cascada)
  useEffect(() => {
    const fetchModels = async () => {
      if (filters.brand) {
        setLoadingModels(true)
        try {
          const data = await parametersService.getModels(Number(filters.brand))
          setModels(data)
        } catch (error) {
          console.error("Error fetching models:", error)
        } finally {
          setLoadingModels(false)
        }
      } else {
        setModels([])
      }
    }
    fetchModels()
  }, [filters.brand])

  // Limpiar modelo si cambia la marca (y el modelo seleccionado no pertenece a la nueva lista - simplificado: limpiar siempre al cambiar marca si el modelo actual no es vacío)
  useEffect(() => {
    // Si cambiamos de marca, el modelo seleccionado probablemente ya no es válido.
    // Pero hay un caso borde: initial load con marca y modelo seteados desde URL.
    // Para simplificar: si el usuario cambia la marca manualmente, limpiamos el modelo.
    // (Esta lógica ya se maneja en el handleChange de brand, ver abajo)
  }, [filters.brand])

  useEffect(() => {
    if (!externalFilters) return

    const isDifferent = (Object.keys(externalFilters) as Array<keyof FilterState>).some(
      (key) => externalFilters[key] !== filters[key]
    )

    if (isDifferent) {
      setFilters(externalFilters)
    }
  }, [externalFilters, filters])

  const updateUrl = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())

    // Helper para setear/borrar params
    const setOrDelete = (key: string, value: string | number) => {
      if (value) params.set(key, value.toString())
      else params.delete(key)
    }

    setOrDelete("marca", newFilters.brand)
    setOrDelete("modelo", newFilters.model)
    setOrDelete("precio_max", newFilters.priceMax < 100000000 ? newFilters.priceMax : "")
    setOrDelete("anio_min", newFilters.year > 2000 ? newFilters.year : "")
    setOrDelete("km_max", newFilters.km < 200000 ? newFilters.km : "")
    setOrDelete("combustible", newFilters.fuel)
    setOrDelete("transmision", newFilters.transmission)
    setOrDelete("segmento", newFilters.segment)
    setOrDelete("estado", newFilters.state)

    if (newFilters.opportunity) params.set("opportunity", "true")
    else params.delete("opportunity")

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleChange = (key: keyof FilterState, value: any) => {
    let updated = { ...filters, [key]: value }
    
    // Si cambia la marca, limpiar modelo
    if (key === "brand") {
      updated.model = ""
    }

    setFilters(updated)
    if (onChange) {
      onChange(updated)
    } else {
      updateUrl(updated)
    }
  }

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS)
    if (onChange) {
      onChange(INITIAL_FILTERS)
    } else {
      updateUrl(INITIAL_FILTERS)
    }
  }

  const hasActiveFilters = useMemo(() => {
    return (
      filters.brand !== INITIAL_FILTERS.brand ||
      filters.model !== INITIAL_FILTERS.model ||
      filters.opportunity !== INITIAL_FILTERS.opportunity ||
      filters.priceMax !== INITIAL_FILTERS.priceMax ||
      filters.year !== INITIAL_FILTERS.year ||
      filters.km !== INITIAL_FILTERS.km ||
      filters.fuel !== INITIAL_FILTERS.fuel ||
      filters.transmission !== INITIAL_FILTERS.transmission ||
      filters.segment !== INITIAL_FILTERS.segment ||
      filters.state !== INITIAL_FILTERS.state
    )
  }, [filters])

  // Helpers para mostrar nombres
  const getBrandName = (id: string) => brands.find(b => b.id.toString() === id)?.nombre
  const getModelName = (id: string) => models.find(m => m.id.toString() === id)?.nombre

  return (
    <div className="space-y-4">
      {/* Mobile Toggle */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Filter size={20} /> Filtros
        </button>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-primary hover:underline text-sm font-semibold">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <div className={`${isOpen ? "block" : "hidden"} lg:block bg-card border border-border rounded-2xl p-6 space-y-6`}>
        <div className="flex items-center justify-between lg:justify-between mb-6">
          <h3 className="font-bold text-lg text-foreground">Filtros</h3>
          <button
            onClick={resetFilters}
            className="hidden lg:flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors"
          >
            <X size={16} /> Limpiar
          </button>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Marca</label>
          <Popover open={openBrand} onOpenChange={setOpenBrand}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBrand}
                className="w-full justify-between px-3 py-2 h-10 font-normal border-border bg-background hover:bg-background/90"
              >
                {loadingBrands ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                  </span>
                ) : filters.brand ? (
                  getBrandName(filters.brand) || "Marca seleccionada"
                ) : (
                  <span className="text-muted-foreground">Todas las marcas</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar marca..." />
                <CommandList>
                  <CommandEmpty>No se encontró la marca.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_brands_option"
                      onSelect={() => {
                        handleChange("brand", "")
                        setOpenBrand(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.brand === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Todas las marcas
                    </CommandItem>
                    {brands.map((brand) => (
                      <CommandItem
                        key={brand.id}
                        value={brand.nombre}
                        onSelect={() => {
                          handleChange("brand", brand.id.toString())
                          setOpenBrand(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.brand === brand.id.toString() ? "opacity-100" : "opacity-0"
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

        {/* Model (Dynamic & Cascading) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Modelo</label>
          <Popover open={openModel} onOpenChange={setOpenModel}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openModel}
                disabled={!filters.brand}
                className="w-full justify-between px-3 py-2 h-10 font-normal border-border bg-background hover:bg-background/90 disabled:opacity-50"
              >
                {loadingModels ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                  </span>
                ) : filters.model ? (
                  getModelName(filters.model) || "Modelo seleccionado"
                ) : (
                  <span className="text-muted-foreground">
                    {filters.brand ? "Todos los modelos" : "Selecciona marca primero"}
                  </span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar modelo..." />
                <CommandList>
                  <CommandEmpty>No se encontró el modelo.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_models_option"
                      onSelect={() => {
                        handleChange("model", "")
                        setOpenModel(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.model === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Todos los modelos
                    </CommandItem>
                    {models.map((model) => (
                      <CommandItem
                        key={model.id}
                        value={model.nombre}
                        onSelect={() => {
                          handleChange("model", model.id.toString())
                          setOpenModel(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.model === model.id.toString() ? "opacity-100" : "opacity-0"
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

        {/* Opportunity */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer font-semibold text-foreground">
            <input
              type="checkbox"
              checked={filters.opportunity}
              onChange={(e) => handleChange("opportunity", e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            Solo Oportunidades
          </label>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Precio</label>
            <span className="text-sm text-muted-foreground">${filters.priceMin.toLocaleString()} - ${filters.priceMax.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100000000"
            step="1000000"
            value={filters.priceMax}
            onChange={(e) => handleChange("priceMax", Number.parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Year */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Año</label>
            <span className="text-sm text-muted-foreground">{filters.year} - 2025</span>
          </div>
          <input
            type="range"
            min="2000"
            max="2025"
            step="1"
            value={filters.year}
            onChange={(e) => handleChange("year", Number.parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Kilometers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Kilómetros</label>
            <span className="text-sm text-muted-foreground">0 - {filters.km.toLocaleString("es-AR")} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={filters.km}
            onChange={(e) => handleChange("km", Number.parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Fuel (Dynamic Select) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Combustible</label>
          <Select
            value={filters.fuel}
            onValueChange={(val) => handleChange("fuel", val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cualquier combustible" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier combustible</SelectItem>
              {fuels.map((f) => (
                <SelectItem key={f.id} value={f.id.toString()}>
                  {f.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transmission (Dynamic Select) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Transmisión</label>
          <Select
            value={filters.transmission}
            onValueChange={(val) => handleChange("transmission", val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cualquier transmisión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier transmisión</SelectItem>
              {transmissions.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Segment (Dynamic Select) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Segmento</label>
          <Select
            value={filters.segment}
            onValueChange={(val) => handleChange("segment", val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cualquier segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier segmento</SelectItem>
              {segments.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State (Dynamic Select) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Estado</label>
          <Select
            value={filters.state}
            onValueChange={(val) => handleChange("state", val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cualquier estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier estado</SelectItem>
              {states.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
