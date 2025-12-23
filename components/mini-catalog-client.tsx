"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Car, Bike, Truck, Tag } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { VehicleCard } from "@/services/vehicles"

type Category = "oportunidad" | "auto" | "camion" | "moto"

// Inferir categoría desde el segmento del vehículo
function getCategory(vehicle: VehicleCard): "auto" | "camion" | "moto" {
  const segment = vehicle.segment.toLowerCase()
  if (segment.includes("moto") || segment.includes("scooter")) return "moto"
  if (segment.includes("pickup") || segment.includes("camion") || segment.includes("utilitario")) return "camion"
  return "auto"
}

// Verificar si es oportunidad usando el badge
function isOpportunity(vehicle: VehicleCard): boolean {
  return vehicle.badge === "Oportunidad"
}

interface MiniCatalogClientProps {
  vehicles: VehicleCard[]
}

export default function MiniCatalogClient({ vehicles }: MiniCatalogClientProps) {
  const [tab, setTab] = useState<Category>("oportunidad")

  const filtered = useMemo(() => {
    if (tab === "oportunidad") return vehicles.filter(isOpportunity)
    return vehicles.filter((v) => getCategory(v) === tab)
  }, [tab, vehicles])

  const counts = useMemo(
    () => ({
      oportunidad: vehicles.filter(isOpportunity).length,
      auto: vehicles.filter((v) => getCategory(v) === "auto").length,
      camion: vehicles.filter((v) => getCategory(v) === "camion").length,
      moto: vehicles.filter((v) => getCategory(v) === "moto").length,
    }),
    [vehicles],
  )

  const ctaLabel = useMemo(() => {
    switch (tab) {
      case "oportunidad":
        return "Ver todas las oportunidades"
      case "auto":
        return "Ver todos los autos"
      case "camion":
        return "Ver todas las camionetas"
      case "moto":
        return "Ver todas las motos"
      default:
        return "Ver todos los vehículos"
    }
  }, [tab])

  const ctaHref = useMemo(() => {
    switch (tab) {
      case "oportunidad":
        return "/comprar?oportunidad=true"
      case "auto":
        return "/comprar?tipo=auto"
      case "camion":
        return "/comprar?tipo=camioneta"
      case "moto":
        return "/comprar?tipo=moto"
      default:
        return "/comprar"
    }
  }, [tab])

  if (vehicles.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-foreground">Explorá por <span className="text-primary">Categoría</span></h2>
          <p className="text-muted-foreground">Encontrá exactamente lo que estás buscando</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-4">
          {([
            {
              key: "oportunidad" as const,
              label: "Oportunidades",
              icon: Tag,
              count: counts.oportunidad,
            },
            { key: "auto" as const, label: "Autos", icon: Car, count: counts.auto },
            { key: "camion" as const, label: "Camionetas", icon: Truck, count: counts.camion },
            { key: "moto" as const, label: "Motos", icon: Bike, count: counts.moto },
          ]).map(({ key, label, icon: IconComp, count }) => {
            const active = tab === key
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 rounded-2xl border-2 px-6 py-3 text-sm font-semibold transition-all duration-300 md:rounded-full ${
                  active
                    ? "border-transparent bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] text-white shadow-[0_8px_24px_-8px_rgba(1,136,200,0.35)]"
                    : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <IconComp size={18} className={active ? "text-white" : "text-muted-foreground"} />
                <span>{label}</span>
                <span className={active ? "opacity-90" : "opacity-70"}>({count})</span>
              </button>
            )
          })}
        </div>

        {/* Carousel */}
        <div className="relative">
          {filtered.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {filtered.map((v) => (
                  <CarouselItem key={v.id} className="pl-2 md:basis-1/2 lg:basis-1/3 md:pl-4">
                    <Link href={`/vehiculo/${v.id}`}>
                      <div className="group relative overflow-hidden rounded-[26px] border border-border/60 bg-card shadow-[0_18px_32px_-24px_rgba(15,54,89,0.25)] transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                        <div className="relative h-48 overflow-hidden md:h-56">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.image} alt={v.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="space-y-5 px-6 pb-6 pt-5">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-foreground">{v.name}</h3>
                            <p className="text-sm text-muted-foreground">{v.brand} • {v.segment}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div>{v.year}</div>
                            <div>{v.km.toLocaleString("es-AR")} km</div>
                            <div>{v.fuel}</div>
                            <div>{v.transmission}</div>
                          </div>
                          <div className="text-2xl font-bold text-primary">${v.price.toLocaleString("es-AR")}</div>
                          <div className="w-full rounded-full bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] px-6 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] text-center">
                            Ver más
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12 hidden md:flex" />
              <CarouselNext className="-right-12 hidden md:flex" />
            </Carousel>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay vehículos en esta categoría
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href={ctaHref}
            className="rounded-full border border-[#0188c8] bg-white px-8 py-3 text-sm font-semibold text-[#0188c8] transition-all hover:border-[#0188c8] hover:bg-[#0188c8] hover:text-white"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
