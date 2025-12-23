"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import VehicleFilters from "@/components/vehicle-filters"
import VehiclesGrid from "@/components/vehicles-grid"
import { vehiclesService, VehicleCard } from "@/services/vehicles"
import { Loader2 } from "lucide-react"

export default function ComprarPage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<VehicleCard[]>([])
  const [loading, setLoading] = useState(true)
  const [dolarBlue, setDolarBlue] = useState<number | null>(null)

  // 1. Obtener Cotización Real (Dolar Blue)
  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue')
        if (res.ok) {
          const data = await res.json()
          setDolarBlue(data.venta) // Usamos precio de venta
        } else {
          setDolarBlue(1200) // Fallback si falla la API
        }
      } catch (error) {
        console.error("Error al obtener dolar blue:", error)
        setDolarBlue(1200) // Fallback por error de red
      }
    }
    fetchDolar()
  }, [])

  // 2. Cargar vehículos (sin filtrar por precio en la API)
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      
      // Construimos filtros desde la URL, pero EXCLUIMOS precio para filtrarlo localmente
      const apiFilters: any = {
        marca: searchParams.get('marca') || undefined,
        combustible: searchParams.get('combustible') || undefined,
        caja: searchParams.get('caja') || searchParams.get('transmision') || undefined,
        segmento: searchParams.get('segmento') || undefined,
        anio_min: searchParams.get('anio_min') ? parseInt(searchParams.get('anio_min')!) : undefined,
        km_max: searchParams.get('km_max') ? parseInt(searchParams.get('km_max')!) : undefined,
        search: searchParams.get('search') || undefined,
        ordering: searchParams.get('ordering') || undefined,
        oportunidad: searchParams.get('opportunity') === 'true' || undefined,
        tipo_vehiculo: searchParams.get('tipo') || undefined,
        // NOTA: No enviamos precio_min ni precio_max a la API
      }

      const data = await vehiclesService.getVehicles(apiFilters)
      setVehicles(data)
      setLoading(false)
    }

    fetchVehicles()
  }, [searchParams])

  // 3. Normalizar Precios y Filtrar Localmente
  const filteredVehicles = useMemo(() => {
    // Obtener moneda del filtro (por URL o default USD)
    const currentCurrency = (searchParams.get('currency') as 'USD' | 'ARS') || 'USD'
    
    // Default max dinámico según moneda
    const defaultMax = currentCurrency === 'USD' ? 100000 : 100000000
    
    const precioMin = searchParams.get('precio_min') ? parseInt(searchParams.get('precio_min')!) : 0
    const precioMax = searchParams.get('precio_max') ? parseInt(searchParams.get('precio_max')!) : defaultMax
    
    // Si no tenemos cotización aún, no filtramos agresivamente o usamos fallback
    const cotizacion = dolarBlue || 1200 

    return vehicles.filter(vehicle => {
      let precioNormalizado = vehicle.price

      // Normalizar precio del vehículo a la moneda seleccionada para el filtro
      if (currentCurrency === 'ARS') {
        // El usuario busca en PESOS.
        // Si el vehículo está en DÓLARES, lo convertimos a PESOS.
        if (vehicle.currency === 'USD') {
            precioNormalizado = vehicle.price * cotizacion
        }
        // Si el vehículo está en PESOS, se deja igual.
      } else {
        // El usuario busca en DÓLARES.
        // Si el vehículo está en PESOS, lo convertimos a DÓLARES.
        if (vehicle.currency === 'ARS') {
            precioNormalizado = vehicle.price / cotizacion
        }
        // Si el vehículo está en DÓLARES, se deja igual.
      }

      // Comparación en la moneda seleccionada
      return precioNormalizado >= precioMin && precioNormalizado <= precioMax
    })
  }, [vehicles, searchParams, dolarBlue])

  const resultCount = filteredVehicles.length
  const resultLabel = resultCount === 1 ? "vehículo" : "vehículos"

  // Valores para los filtros de la UI
  // Aseguramos que los valores iniciales respeten la moneda actual
  const currentCurrency = (searchParams.get('currency') as 'USD' | 'ARS') || 'USD'
  const defaultMax = currentCurrency === 'USD' ? 100000 : 100000000

  const initialFilters = {
    brand: searchParams.get('marca') || "",
    opportunity: searchParams.get('opportunity') === 'true',
    currency: currentCurrency,
    priceMin: searchParams.get('precio_min') ? parseInt(searchParams.get('precio_min')!) : 0,
    priceMax: searchParams.get('precio_max') ? parseInt(searchParams.get('precio_max')!) : defaultMax,
    year: searchParams.get('anio_min') ? parseInt(searchParams.get('anio_min')!) : 2000,
    km: searchParams.get('km_max') ? parseInt(searchParams.get('km_max')!) : 200000,
    fuel: searchParams.get('combustible') || "",
    transmission: searchParams.get('caja') || searchParams.get('transmision') || "",
    segment: searchParams.get('segmento') || "",
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />
        <div className="max-w-[1200px] mx-auto px-4 space-y-3 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Nuestro Inventario</h1>
          <p className="text-lg opacity-90">
            {loading ? "Cargando..." : `${resultCount} ${resultLabel} disponibles`}
          </p>
          {dolarBlue && (
            <p className="text-xs opacity-75 mt-2">
              Cotización referencia: U$D 1 = ${dolarBlue.toLocaleString('es-AR')}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <VehicleFilters externalFilters={initialFilters} dolarBlue={dolarBlue || 1200} />
            </div>

            {/* Vehicles Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl border border-border bg-card px-5 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
                <div className="text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{resultCount}</span> {resultLabel}
                </div>
              </div>

              {loading ? (
                 <div className="flex justify-center py-20">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : (
                <VehiclesGrid vehicles={filteredVehicles} />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}
