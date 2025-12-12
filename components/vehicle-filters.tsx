"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { parametersService, Parameter, ModelParameter } from "@/services/parameters"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
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
  const [openFuel, setOpenFuel] = useState(false)
  const [openTransmission, setOpenTransmission] = useState(false)
  const [openSegment, setOpenSegment] = useState(false)
  const [openState, setOpenState] = useState(false)

  // Estados locales para sliders (UX inmediata)
  const [localPriceMax, setLocalPriceMax] = useState(INITIAL_FILTERS.priceMax)
  const [localYear, setLocalYear] = useState(INITIAL_FILTERS.year)
  const [localKm, setLocalKm] = useState(INITIAL_FILTERS.km)

  // Ref para trackear si los filtros externos cambiaron realmente
  const prevExternalFilters = useRef(externalFilters)

  // Sincronizar estados locales cuando cambian los filtros externos
  useEffect(() => {
    setLocalPriceMax(filters.priceMax)
  }, [filters.priceMax])

  useEffect(() => {
    setLocalYear(filters.year)
  }, [filters.year])

  useEffect(() => {
    setLocalKm(filters.km)
  }, [filters.km])

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

    // Verificar si externalFilters cambió respecto a la última vez que lo vimos
    // (no comparado con el estado actual 'filters', sino consigo mismo en el pasado)
    const isExternalChanged = JSON.stringify(externalFilters) !== JSON.stringify(prevExternalFilters.current)

    if (isExternalChanged) {
      setFilters(externalFilters)
      prevExternalFilters.current = externalFilters
    }
  }, [externalFilters])

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
  const getFuelName = (id: string) => fuels.find(f => f.id.toString() === id)?.nombre
  const getTransmissionName = (id: string) => transmissions.find(t => t.id.toString() === id)?.nombre
  const getSegmentName = (id: string) => segments.find(s => s.id.toString() === id)?.nombre
  const getStateName = (id: string) => states.find(s => s.id.toString() === id)?.nombre

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
                className="w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2.5 h-11 text-sm font-normal shadow-sm hover:bg-accent/50 transition-all"
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
            <PopoverContent className="w-[280px] p-1 rounded-xl border-none shadow-xl bg-popover" align="start">
              <Command className="rounded-lg">
                <CommandInput placeholder="Buscar marca..." className="h-9" />
                <CommandList className="max-h-[280px] p-1">
                  <CommandEmpty>No se encontró la marca.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_brands_option"
                      onSelect={() => {
                        handleChange("brand", "")
                        setOpenBrand(false)
                      }}
                      className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
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
                        className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
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
                className="w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2.5 h-11 text-sm font-normal shadow-sm hover:bg-accent/50 transition-all disabled:opacity-50"
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
            <PopoverContent className="w-[280px] p-1 rounded-xl border-none shadow-xl bg-popover" align="start">
              <Command className="rounded-lg">
                <CommandInput placeholder="Buscar modelo..." className="h-9" />
                <CommandList className="max-h-[280px] p-1">
                  <CommandEmpty>No se encontró el modelo.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_models_option"
                      onSelect={() => {
                        handleChange("model", "")
                        setOpenModel(false)
                      }}
                      className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
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
                        className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Precio</label>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              Hasta ${localPriceMax.toLocaleString()}
            </span>
          </div>
          <Slider
            min={0}
            max={100000000}
            step={1000000}
            value={[localPriceMax]}
            onValueChange={([val]) => setLocalPriceMax(val)}
            onValueCommit={([val]) => handleChange("priceMax", val)}
            className="py-2"
          />
        </div>

        {/* Year */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Año mínimo</label>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              Desde {localYear}
            </span>
          </div>
          <Slider
            min={2000}
            max={2025}
            step={1}
            value={[localYear]}
            onValueChange={([val]) => setLocalYear(val)}
            onValueCommit={([val]) => handleChange("year", val)}
            className="py-2"
          />
        </div>

        {/* Kilometers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Kilómetros</label>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              Hasta {localKm.toLocaleString("es-AR")} km
            </span>
          </div>
          <Slider
            min={0}
            max={200000}
            step={5000}
            value={[localKm]}
            onValueChange={([val]) => setLocalKm(val)}
            onValueCommit={([val]) => handleChange("km", val)}
            className="py-2"
          />
        </div>

        {/* Fuel (Popover + Command) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Combustible</label>
          <Popover open={openFuel} onOpenChange={setOpenFuel}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFuel}
                className="w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2.5 h-11 text-sm font-normal shadow-sm hover:bg-accent/50 transition-all"
              >
                {filters.fuel ? (
                  getFuelName(filters.fuel) || "Combustible seleccionado"
                ) : (
                  <span className="text-muted-foreground">Cualquier combustible</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-1 rounded-xl border-none shadow-xl bg-popover" align="start">
              <Command className="rounded-lg">
                <CommandInput placeholder="Buscar combustible..." className="h-9" />
                <CommandList className="max-h-[280px] p-1">
                  <CommandEmpty>No se encontró el combustible.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_fuels_option"
                      onSelect={() => {
                        handleChange("fuel", "")
                        setOpenFuel(false)
                      }}
                      className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.fuel === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Cualquier combustible
                    </CommandItem>
                    {fuels.map((fuel) => (
                      <CommandItem
                        key={fuel.id}
                        value={fuel.nombre}
                        onSelect={() => {
                          handleChange("fuel", fuel.id.toString())
                          setOpenFuel(false)
                        }}
                        className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.fuel === fuel.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {fuel.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Transmission (Popover + Command) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Transmisión</label>
          <Popover open={openTransmission} onOpenChange={setOpenTransmission}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTransmission}
                className="w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2.5 h-11 text-sm font-normal shadow-sm hover:bg-accent/50 transition-all"
              >
                {filters.transmission ? (
                  getTransmissionName(filters.transmission) || "Transmisión seleccionada"
                ) : (
                  <span className="text-muted-foreground">Cualquier transmisión</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-1 rounded-xl border-none shadow-xl bg-popover" align="start">
              <Command className="rounded-lg">
                <CommandInput placeholder="Buscar transmisión..." className="h-9" />
                <CommandList className="max-h-[280px] p-1">
                  <CommandEmpty>No se encontró la transmisión.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_transmissions_option"
                      onSelect={() => {
                        handleChange("transmission", "")
                        setOpenTransmission(false)
                      }}
                      className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.transmission === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Cualquier transmisión
                    </CommandItem>
                    {transmissions.map((transmission) => (
                      <CommandItem
                        key={transmission.id}
                        value={transmission.nombre}
                        onSelect={() => {
                          handleChange("transmission", transmission.id.toString())
                          setOpenTransmission(false)
                        }}
                        className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.transmission === transmission.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {transmission.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Segment (Popover + Command) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Segmento</label>
          <Popover open={openSegment} onOpenChange={setOpenSegment}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSegment}
                className="w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2.5 h-11 text-sm font-normal shadow-sm hover:bg-accent/50 transition-all"
              >
                {filters.segment ? (
                  getSegmentName(filters.segment) || "Segmento seleccionado"
                ) : (
                  <span className="text-muted-foreground">Cualquier segmento</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-1 rounded-xl border-none shadow-xl bg-popover" align="start">
              <Command className="rounded-lg">
                <CommandInput placeholder="Buscar segmento..." className="h-9" />
                <CommandList className="max-h-[280px] p-1">
                  <CommandEmpty>No se encontró el segmento.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_segments_option"
                      onSelect={() => {
                        handleChange("segment", "")
                        setOpenSegment(false)
                      }}
                      className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.segment === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Cualquier segmento
                    </CommandItem>
                    {segments.map((segment) => (
                      <CommandItem
                        key={segment.id}
                        value={segment.nombre}
                        onSelect={() => {
                          handleChange("segment", segment.id.toString())
                          setOpenSegment(false)
                        }}
                        className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.segment === segment.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {segment.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* State (Popover + Command) */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Estado</label>
          <Popover open={openState} onOpenChange={setOpenState}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openState}
                className="w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2.5 h-11 text-sm font-normal shadow-sm hover:bg-accent/50 transition-all"
              >
                {filters.state ? (
                  getStateName(filters.state) || "Estado seleccionado"
                ) : (
                  <span className="text-muted-foreground">Cualquier estado</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-1 rounded-xl border-none shadow-xl bg-popover" align="start">
              <Command className="rounded-lg">
                <CommandInput placeholder="Buscar estado..." className="h-9" />
                <CommandList className="max-h-[280px] p-1">
                  <CommandEmpty>No se encontró el estado.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all_states_option"
                      onSelect={() => {
                        handleChange("state", "")
                        setOpenState(false)
                      }}
                      className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.state === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Cualquier estado
                    </CommandItem>
                    {states.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={state.nombre}
                        onSelect={() => {
                          handleChange("state", state.id.toString())
                          setOpenState(false)
                        }}
                        className="rounded-lg cursor-pointer aria-selected:bg-secondary aria-selected:text-secondary-foreground transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.state === state.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {state.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
