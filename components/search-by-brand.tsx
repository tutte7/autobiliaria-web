"use client"

import { useState, useEffect } from "react"
import { Search, Car } from "lucide-react"
import { useRouter } from "next/navigation"
import { parametersService, type Parameter } from "@/services/parameters"

// Mapa de logos estático para asociar nombres de API con archivos locales
// Las claves están en minúsculas para facilitar el matching
const BRAND_LOGOS: Record<string, string> = {
  toyota: "/logos-autos/Toyota_logo_(Red).svg 1.svg",
  honda: "/logos-autos/Honda.svg 1.svg",
  ford: "/logos-autos/ford-logo-flat.svg",
  chevrolet: "/logos-autos/chevrolet-logo.png",
  audi: "/logos-autos/Audi_logo_detail.svg 1.svg",
  volkswagen: "/logos-autos/Volkswagen_logo_2019.svg.png",
  fiat: "/logos-autos/Fiat_Automobiles_logo.svg.png",
  peugeot: "/logos-autos/peugot-logo.svg",
  renault: "/logos-autos/renault-logo.svg",
  citroen: "/logos-autos/Citroen-logo-2009 1.svg",
  citroën: "/logos-autos/Citroen-logo-2009 1.svg", // Por si viene con tilde
  jeep: "/logos-autos/jeep-7.svg",
  bmw: "/logos-autos/BMW.svg.png",
}

// Colores de marca opcionales (fallback a un color por defecto si no existe)
const BRAND_COLORS: Record<string, string> = {
  toyota: "#EB0A1E",
  honda: "#E40521",
  ford: "#003478",
  chevrolet: "#FFB500",
  audi: "#BB0A30",
  volkswagen: "#1B1464",
  fiat: "#8B0000",
  peugeot: "#004E9F",
  renault: "#FFCC00",
  citroen: "#1E1E1E",
  citroën: "#1E1E1E",
  jeep: "#1E1E1E",
  bmw: "#1C69D4",
}

// Lista de marcas principales que se mostrarán por defecto
const MAIN_BRANDS = [
  'BMW', 'CITROEN', 'FIAT', 'FORD', 'HONDA', 
  'JEEP', 'PEUGEOT', 'RENAULT', 'TOYOTA', 
  'VOLKSWAGEN', 'CHEVROLET', 'AUDI'
];

export default function SearchByBrand() {
  const router = useRouter()
  const [brands, setBrands] = useState<Parameter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchBrand, setSearchBrand] = useState("")
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const data = await parametersService.getBrands()
        setBrands(data)
      } catch (error) {
        console.error("Error cargando marcas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const filteredBrands = brands.filter((brand) => {
    // Si hay texto en el buscador, buscar en TODAS las marcas
    if (searchBrand.trim()) {
      return brand.nombre.toLowerCase().includes(searchBrand.toLowerCase())
    }
    
    // Si no hay búsqueda, mostrar solo las marcas principales
    // Se normaliza a mayúsculas para asegurar coincidencia insensible a mayúsculas/minúsculas
    return MAIN_BRANDS.includes(brand.nombre.toUpperCase())
  })

  const handleBrandClick = (brandId: number) => {
    router.push(`/comprar?marca=${brandId}`)
  }

  const getBrandLogo = (brandName: string) => {
    const key = brandName.toLowerCase()
    return BRAND_LOGOS[key] || null
  }

  const getBrandColor = (brandName: string) => {
    const key = brandName.toLowerCase()
    return BRAND_COLORS[key] || "inherit"
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-foreground">
            Buscá por <span className="text-primary">Marca</span>
          </h2>
          <p className="text-muted-foreground">Encontrá el vehículo perfecto de tu marca favorita</p>
        </div>

        {/* Search Input */}
        <div className="flex bg-muted rounded-full p-2 max-w-md mx-auto">
          <Search size={20} className="text-muted-foreground ml-4" />
          <input
            type="text"
            placeholder="Buscar marca..."
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
            className="flex-1 px-4 outline-none bg-transparent text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Brand Grid */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Cargando marcas...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {filteredBrands.map((brand) => {
              const logoUrl = getBrandLogo(brand.nombre)
              const brandColor = getBrandColor(brand.nombre)
              const isHovered = hoveredBrand === brand.id

              return (
                <div
                  key={brand.id}
                  onClick={() => handleBrandClick(brand.id)}
                  className="group cursor-pointer rounded-2xl border border-border bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:shadow-lg"
                  onMouseEnter={() => setHoveredBrand(brand.id)}
                  onMouseLeave={() => setHoveredBrand(null)}
                >
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoUrl}
                        alt={brand.nombre}
                        className="h-12 w-12 object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    ) : (
                      <Car className="h-10 w-10 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                    )}
                  </div>
                  <div
                    className="text-sm font-semibold transition-colors duration-300"
                    style={{
                      color: isHovered && brandColor !== "inherit" ? brandColor : "inherit",
                    }}
                  >
                    {brand.nombre}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {!loading && filteredBrands.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No se encontraron marcas con ese nombre.
          </div>
        )}
      </div>
    </section>
  )
}
