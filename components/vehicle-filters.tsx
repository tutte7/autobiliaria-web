"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { parametersService, Parameter } from "@/services/parameters"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  opportunity: boolean
  priceMin: number
  priceMax: number
  year: number
  km: number
  fuel: string
  transmission: string
  segment: string
  currency: 'USD' | 'ARS'
}

interface VehicleFiltersProps {
  onChange?: (filters: FilterState) => void
  externalFilters?: FilterState
  dolarBlue?: number
}

const INITIAL_FILTERS: FilterState = {
  brand: "",
  opportunity: false,
  priceMin: 0,
  priceMax: 100000,
  year: 2000,
  km: 200000,
  fuel: "",
  transmission: "",
  segment: "",
  currency: 'USD',
}

export default function VehicleFilters({ onChange, externalFilters, dolarBlue }: VehicleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => externalFilters ?? INITIAL_FILTERS)
  const [isOpen, setIsOpen] = useState(false)
  const [localPriceMin, setLocalPriceMin] = useState<number>(() => (externalFilters?.priceMin ?? INITIAL_FILTERS.priceMin))
  const [localPriceMax, setLocalPriceMax] = useState<number>(() => (externalFilters?.priceMax ?? INITIAL_FILTERS.priceMax))
  const debouncedPriceMin = useDebounce(localPriceMin, 250)
  const debouncedPriceMax = useDebounce(localPriceMax, 250)

  // Catálogos
  const [brands, setBrands] = useState<Parameter[]>([])
  const [fuels, setFuels] = useState<Parameter[]>([])
  const [transmissions, setTransmissions] = useState<Parameter[]>([])
  const [segments, setSegments] = useState<Parameter[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingCatalogs, setLoadingCatalogs] = useState(true)
  const [openBrand, setOpenBrand] = useState(false)

  // Límites dinámicos según moneda
  const maxPrice = filters.currency === 'USD' ? 100000 : 100000000
  const stepPrice = filters.currency === 'USD' ? 1000 : 500000

  // Cargar catálogos al inicio (IDs reales)
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [brandsData, fuelsData, transmissionsData, segmentsData] = await Promise.all([
          parametersService.getBrands(),
          parametersService.getFuels(),
          parametersService.getTransmissions(),
          parametersService.getSegments(),
        ])
        setBrands(brandsData)
        setFuels(fuelsData)
        setTransmissions(transmissionsData)
        setSegments(segmentsData)
      } catch (error) {
        console.error("Error al cargar catálogos:", error)
      } finally {
        setLoadingBrands(false)
        setLoadingCatalogs(false)
      }
    }
    fetchCatalogs()
  }, [])

  useEffect(() => {
    if (!externalFilters) return
    setFilters(externalFilters)
  }, [externalFilters])

  // Mantener controles locales sincronizados cuando cambia el estado (por URL/externalFilters)
  useEffect(() => {
    setLocalPriceMin(filters.priceMin)
  }, [filters.priceMin])

  useEffect(() => {
    setLocalPriceMax(filters.priceMax)
  }, [filters.priceMax])

  const updateUrl = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())

    // Marca
    if (newFilters.brand) params.set("marca", newFilters.brand)
    else params.delete("marca")

    // Oportunidad
    if (newFilters.opportunity) params.set("opportunity", "true")
    else params.delete("opportunity")

    // Moneda
    if (newFilters.currency !== 'USD') params.set("currency", newFilters.currency)
    else params.delete("currency")

    // Precio Min
    if (newFilters.priceMin > 0) params.set("precio_min", newFilters.priceMin.toString())
    else params.delete("precio_min")

    // Precio Max
    // Usamos el maxPrice dinámico para saber si es el valor por defecto
    const currentMaxDefault = newFilters.currency === 'USD' ? 100000 : 100000000
    if (newFilters.priceMax < currentMaxDefault) params.set("precio_max", newFilters.priceMax.toString())
    else params.delete("precio_max")

    // Año (anio_min)
    if (newFilters.year > 2000) params.set("anio_min", newFilters.year.toString())
    else params.delete("anio_min")

    // Km (km_max)
    if (newFilters.km < 200000) params.set("km_max", newFilters.km.toString())
    else params.delete("km_max")

    // Combustible
    if (newFilters.fuel) params.set("combustible", newFilters.fuel)
    else params.delete("combustible")

    // Caja (Transmisión) - la API filtra por `caja` (ver docs/vehiculos.md)
    if (newFilters.transmission) params.set("caja", newFilters.transmission)
    else params.delete("caja")

    // Segmento
    if (newFilters.segment) params.set("segmento", newFilters.segment)
    else params.delete("segmento")

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleChange = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    if (onChange) {
      onChange(updated)
    } else {
      updateUrl(updated)
    }
  }

  const handleCurrencyChange = (newCurrency: 'USD' | 'ARS') => {
    const rate = dolarBlue || 1200
    let newMin = filters.priceMin
    let newMax = filters.priceMax

    if (newCurrency === 'ARS' && filters.currency === 'USD') {
      // De USD a ARS
      newMin = Math.round(newMin * rate)
      newMax = Math.round(newMax * rate)
      // Ajustar si se pasa del máximo
      if (newMax > 100000000) newMax = 100000000
    } else if (newCurrency === 'USD' && filters.currency === 'ARS') {
      // De ARS a USD
      newMin = Math.round(newMin / rate)
      newMax = Math.round(newMax / rate)
      // Ajustar si se pasa del máximo
      if (newMax > 100000) newMax = 100000
    }
    
    // Si estaba en los máximos por defecto, resetear a los nuevos máximos
    if (filters.currency === 'USD' && filters.priceMax === 100000) newMax = 100000000
    if (filters.currency === 'ARS' && filters.priceMax === 100000000) newMax = 100000

    setFilters(prev => ({ ...prev, currency: newCurrency, priceMin: newMin, priceMax: newMax }))
    setLocalPriceMin(newMin)
    setLocalPriceMax(newMax)
    
    // Actualizar URL
    const updated = { ...filters, currency: newCurrency, priceMin: newMin, priceMax: newMax }
    if (onChange) {
      onChange(updated)
    } else {
      updateUrl(updated)
    }
  }

  // Aplicar filtros de precio de forma debounced (evita router.replace en cada movimiento del slider)
  useEffect(() => {
    if (debouncedPriceMin !== filters.priceMin) {
      handleChange("priceMin", debouncedPriceMin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPriceMin])

  useEffect(() => {
    if (debouncedPriceMax !== filters.priceMax) {
      handleChange("priceMax", debouncedPriceMax)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPriceMax])

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
      filters.opportunity !== INITIAL_FILTERS.opportunity ||
      filters.priceMax !== (filters.currency === 'USD' ? 100000 : 100000000) ||
      filters.year !== INITIAL_FILTERS.year ||
      filters.km !== INITIAL_FILTERS.km ||
      filters.fuel !== INITIAL_FILTERS.fuel ||
      filters.transmission !== INITIAL_FILTERS.transmission ||
      filters.segment !== INITIAL_FILTERS.segment
    )
  }, [filters])

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

        {/* Brand - Requerimiento 3: Combobox con ID */}
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
                  // Buscamos el nombre de la marca basándonos en el ID guardado (Requerimiento 3)
                  brands.find((b) => b.id.toString() === filters.brand)?.nombre || "Marca seleccionada"
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
                          // Guardamos el ID como string (Requerimiento 3)
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

        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Moneda</label>
          <Tabs value={filters.currency} onValueChange={(v) => handleCurrencyChange(v as 'USD' | 'ARS')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="USD">Dólares (USD)</TabsTrigger>
              <TabsTrigger value="ARS">Pesos (ARS)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Precio</label>
            <span className="text-sm text-muted-foreground">
              ${localPriceMin.toLocaleString()} - ${localPriceMax.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              step={stepPrice}
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(Number.parseInt(e.target.value || "0", 10))}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Mín"
            />
            <input
              type="number"
              min={0}
              step={stepPrice}
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(Number.parseInt(e.target.value || "0", 10))}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Máx"
            />
          </div>
          <input
            type="range"
            min="0"
            max={maxPrice.toString()}
            step={stepPrice.toString()}
            value={localPriceMax}
            onChange={(e) => setLocalPriceMax(Number.parseInt(e.target.value, 10))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>${filters.currency === 'USD' ? '100k' : '100M'}</span>
          </div>
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2000</span>
            <span>2025</span>
          </div>
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 km</span>
            <span>200.000 km</span>
          </div>
        </div>

        {/* Fuel */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Combustible</label>
          <select
            value={filters.fuel}
            onChange={(e) => handleChange("fuel", e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Cualquier combustible</option>
            {loadingCatalogs ? null : fuels.map((fuel) => (
              <option key={fuel.id} value={fuel.id.toString()}>
                {fuel.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Transmisión</label>
          <select
            value={filters.transmission}
            onChange={(e) => handleChange("transmission", e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Cualquier transmisión</option>
            {loadingCatalogs ? null : transmissions.map((t) => (
              <option key={t.id} value={t.id.toString()}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Segment */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Segmento</label>
          <select
            value={filters.segment}
            onChange={(e) => handleChange("segment", e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Cualquier segmento</option>
            {loadingCatalogs ? null : segments.map((s) => (
              <option key={s.id} value={s.id.toString()}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
