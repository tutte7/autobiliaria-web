"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import VehiclesGrid from "@/components/vehicles-grid"
import { Filter, PiggyBank, Percent, Sparkles } from "lucide-react"
import AdvancedSearch from "@/components/advanced-search"
import { VehicleCard } from "@/services/vehicles"

interface Vehicle {
  id: number
  name: string
  price: number
  year: number
  km: number
  fuel: string
  transmission: string
  segment: string
  brand: string
  image: string
  featured: boolean
  category: "auto" | "camioneta" | "moto"
}

type PriceRange = "" | "<20000000" | "20000000-35000000" | ">35000000"

type QuickFilter = {
  id: string
  label: string
  type?: Vehicle["category"]
  segment?: string
  priceRange?: PriceRange
}

const QUICK_FILTERS: QuickFilter[] = [
  { id: "suv", label: "SUV", segment: "SUV" },
  { id: "pickup", label: "Pickups", segment: "Pickup" },
  { id: "price-20", label: "Hasta $20M", priceRange: "<20000000" },
  { id: "camionetas", label: "Camionetas", type: "camioneta" },
]

// Inferir categoría desde el segmento
function getCategory(segment: string): "auto" | "camioneta" | "moto" {
  const s = segment.toLowerCase()
  if (s.includes("moto") || s.includes("scooter")) return "moto"
  if (s.includes("pickup") || s.includes("camion") || s.includes("utilitario")) return "camioneta"
  return "auto"
}

interface OportunidadesClientProps {
  vehicles: VehicleCard[]
  totalVehicles: number
}

export default function OportunidadesClient({ vehicles, totalVehicles }: OportunidadesClientProps) {
  const [type, setType] = useState<"" | Vehicle["category"]>("")
  const [priceRange, setPriceRange] = useState<PriceRange>("")
  const [segment, setSegment] = useState("")
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)

  // Mapear VehicleCard a Vehicle para el grid
  const opportunityVehicles = useMemo(() => {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      price: vehicle.price,
      year: vehicle.year,
      km: vehicle.km,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      segment: vehicle.segment,
      brand: vehicle.brand.toLowerCase(),
      image: vehicle.image,
      featured: true,
      category: getCategory(vehicle.segment),
    }))
  }, [vehicles])

  const filteredVehicles = useMemo(() => {
    return opportunityVehicles.filter((vehicle) => {
      if (type && vehicle.category !== type) return false
      if (segment && vehicle.segment !== segment) return false
      if (priceRange) {
        if (priceRange === "<20000000" && vehicle.price >= 20000000) return false
        if (priceRange === "20000000-35000000" && (vehicle.price < 20000000 || vehicle.price > 35000000)) return false
        if (priceRange === ">35000000" && vehicle.price <= 35000000) return false
      }
      return true
    })
  }, [opportunityVehicles, type, priceRange, segment])

  const totalCount = filteredVehicles.length
  const totalLabel = totalCount === 1 ? "oportunidad" : "oportunidades"

  const handleQuickFilter = (filter: QuickFilter) => {
    setActiveQuickFilter((prev) => (prev === filter.id ? null : filter.id))

    if (activeQuickFilter === filter.id) {
      setSegment("")
      setType("")
      setPriceRange("")
      return
    }

    if (filter.segment) {
      setSegment(filter.segment)
    } else {
      setSegment("")
    }

    if (filter.type) {
      setType(filter.type)
    } else {
      setType("")
    }

    if (filter.priceRange) {
      setPriceRange(filter.priceRange)
    } else {
      setPriceRange("")
    }
  }

  const resetFilters = () => {
    setType("")
    setPriceRange("")
    setSegment("")
    setActiveQuickFilter(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-[1100px] px-4">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide">
              <Sparkles size={16} /> Selección exclusiva
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold md:text-5xl">Oportunidades Únicas</h1>
              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/80">
                Vehículos seleccionados con descuentos especiales. ¡No dejes pasar estas ofertas limitadas!
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 px-6 py-5 text-left backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white/90">
                  <Sparkles size={20} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Oportunidades</span>
                </div>
                <div className="mt-3 text-3xl font-bold">{opportunityVehicles.length}</div>
              </div>
              <div className="rounded-3xl bg-white/10 px-6 py-5 text-left backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white/90">
                  <Percent size={20} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Hasta</span>
                </div>
                <div className="mt-3 text-3xl font-bold">15% OFF</div>
                <p className="text-xs text-white/70">En vehículos seleccionados</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-6 py-5 text-left backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white/90">
                  <PiggyBank size={20} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Ahorro total</span>
                </div>
                <div className="mt-3 text-3xl font-bold">$9.000.000</div>
                <p className="text-xs text-white/70">Promedio estimado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Card */}
      <section className="relative z-10 mt-0 md:-mt-8 lg:-mt-12 xl:-mt-16 px-4 pb-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="rounded-[32px] border border-border/50 bg-card shadow-xl shadow-primary/5 px-6 py-6 md:px-10 md:py-8">
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-border/60 flex-wrap">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">Encontrá tu oportunidad</h2>
                <p className="text-sm text-muted-foreground">Buscá en todo el catálogo o filtrá estas oportunidades.</p>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                <Filter size={16} /> Limpiar filtros
              </button>
            </div>

            <div className="pt-6">
              <AdvancedSearch />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {QUICK_FILTERS.map((quickFilter) => {
                const isActive = activeQuickFilter === quickFilter.id
                return (
                  <button
                    key={quickFilter.id}
                    onClick={() => handleQuickFilter(quickFilter)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "border-transparent bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] text-white shadow-lg"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {quickFilter.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Opportunities */}
      <section className="px-4 pb-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="rounded-[28px] border border-emerald-300/40 bg-emerald-500/10 px-6 py-6 md:px-10 md:py-8">
            <h3 className="text-lg font-semibold text-emerald-900">¿Por qué son oportunidades?</h3>
            <p className="mt-3 text-sm text-emerald-900/90">
              Estos vehículos tienen descuentos especiales por diferentes motivos: renovación de stock, unidades de gerencia o simplemente queremos que encuentres el mejor precio del mercado. Todos los vehículos están en excelente estado y con garantía.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[1100px] space-y-10">
          <VehiclesGrid vehicles={filteredVehicles} />

          <div className="rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-foreground mb-2">¿No encontraste lo que buscabas?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Explorá nuestro catálogo completo con más de {totalVehicles} vehículos disponibles.
            </p>
            <Link
              href="/comprar"
              className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Ver todos los vehículos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}
