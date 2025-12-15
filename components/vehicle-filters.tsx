"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
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
}

interface VehicleFiltersProps {
  onChange?: (filters: FilterState) => void
  externalFilters?: FilterState
}

const INITIAL_FILTERS: FilterState = {
  brand: "",
  opportunity: false,
  priceMin: 0,
  priceMax: 100000000,
  year: 2000,
  km: 200000,
  fuel: "",
  transmission: "",
  segment: "",
}

export default function VehicleFilters({ onChange, externalFilters }: VehicleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [isOpen, setIsOpen] = useState(false)

  // Estado para marcas (Requerimiento 1 y 4)
  const [brands, setBrands] = useState<Parameter[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [openBrand, setOpenBrand] = useState(false)

  // Cargar marcas al inicio (Requerimiento 2)
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

    // Marca
    if (newFilters.brand) params.set("marca", newFilters.brand)
    else params.delete("marca")

    // Oportunidad
    if (newFilters.opportunity) params.set("opportunity", "true")
    else params.delete("opportunity")

    // Precio Max
    if (newFilters.priceMax < 100000000) params.set("precio_max", newFilters.priceMax.toString())
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

    // Transmisión
    if (newFilters.transmission) params.set("transmision", newFilters.transmission)
    else params.delete("transmision")

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
      filters.priceMax !== INITIAL_FILTERS.priceMax ||
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$100M</span>
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
            <option value="Nafta">Nafta</option>
            <option value="Diésel">Diésel</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Eléctrico">Eléctrico</option>
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
            <option value="Manual">Manual</option>
            <option value="Automática">Automática</option>
            <option value="CVT">CVT</option>
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
            <option value="Sedán">Sedán</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Pickup">Pickup</option>
            <option value="Moto">Moto</option>
          </select>
        </div>
      </div>
    </div>
  )
}
