"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { vehiclesService, type VehicleCard } from "@/services/vehicles"
import Image from "next/image"

interface LiveSearchProps {
  className?: string
  placeholder?: string
  onSearch?: () => void
}

export function LiveSearch({ className, placeholder = "Buscar...", onSearch }: LiveSearchProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<VehicleCard[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Cerrar al hacer clic fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Efecto de búsqueda
  React.useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        // Buscamos solo por texto, limitando a unos 5 resultados para el preview
        const data = await vehiclesService.getVehicles({ 
          search: debouncedQuery,
          limit: 5 
        })
        setResults(data)
        setIsOpen(true)
      } catch (error) {
        console.error("Error en live search:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/comprar?search=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      if (onSearch) onSearch()
    }
  }

  const handleSelectResult = (vehicleId: number) => {
    router.push(`/vehiculo/${vehicleId}`)
    setIsOpen(false)
    setQuery("") // Opcional: limpiar búsqueda al navegar
    if (onSearch) onSearch()
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-center w-full transition-all duration-200",
          className
        )}
        role="search"
      >
        <div className="pl-3 text-muted-foreground">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </div>
        <input
          type="search"
          placeholder={placeholder}
          aria-label="Buscar"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isOpen && e.target.value.trim()) setIsOpen(true)
          }}
          className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none w-full"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
            className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Resultados Dropdown */}
      {isOpen && (query.trim().length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/50 bg-white/95 backdrop-blur-xl shadow-xl ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {results.length > 0 ? (
              <>
                <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resultados sugeridos
                </div>
                {results.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleSelectResult(vehicle.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {vehicle.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{vehicle.year}</span>
                        <span>•</span>
                        <span>{vehicle.km.toLocaleString()} km</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary whitespace-nowrap">
                      ${vehicle.price.toLocaleString()}
                    </div>
                  </button>
                ))}
                <div className="border-t border-border/50 mt-2 pt-2 px-2">
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Search size={14} />
                    Ver todos los resultados para "{query}"
                  </button>
                </div>
              </>
            ) : (
              !isLoading && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No encontramos vehículos que coincidan con "{query}"
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}




