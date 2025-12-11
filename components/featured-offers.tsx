"use client"

import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings } from "lucide-react"

interface VehicleCard {
  id: number
  name: string
  price: number
  year: number
  km: number
  image: string
  brand: string
  segment: string
  fuel: string
  transmission: string
  prevPrice?: number
  discount?: number
  badge?: string
}

export default function FeaturedOffers() {
  const vehicles: VehicleCard[] = [
    {
      id: 1,
      name: "Toyota Corolla XEi",
      price: 28500000,
      prevPrice: 32000000,
      discount: 11,
      year: 2023,
      km: 15000,
      fuel: "Nafta",
      transmission: "Automática",
      brand: "Toyota",
      segment: "Sedán",
      image: "/toyota-corolla-azul.jpg",
      badge: "Oportunidad",
    },
    {
      id: 2,
      name: "Ford Ranger XLT 4x4",
      price: 42000000,
      year: 2022,
      km: 28000,
      fuel: "Diésel",
      transmission: "Manual",
      brand: "Ford",
      segment: "Pickup",
      image: "/ford-ranger-roja.jpg",
      badge: "Destacado",
    },
    {
      id: 3,
      name: "Chevrolet Onix Premier",
      price: 22000000,
      year: 2024,
      km: 0,
      fuel: "Nafta",
      transmission: "Automática",
      brand: "Chevrolet",
      segment: "Hatchback",
      image: "/chevrolet-cruze-negro.jpg",
      badge: "0 KM",
    },
  ]

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-16">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold text-foreground">Ofertas Destacadas</h2>
          <p className="text-lg text-muted-foreground">Los mejores precios en autos seleccionados</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/vehiculo/${vehicle.id}`}>
              <div className="group relative cursor-pointer rounded-[28px] bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] p-[2px] shadow-[0_18px_40px_-20px_rgba(1,136,200,0.45)] transition-transform duration-300 hover:-translate-y-3">
                <div className="relative rounded-[26px] bg-white">
                  <div className="relative h-56 overflow-hidden rounded-t-[26px]">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      {vehicle.badge && (
                        <span className="rounded-full bg-[rgba(0,176,155,0.9)] px-4 py-[6px] text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
                          {vehicle.badge}
                        </span>
                      )}

                      {vehicle.discount && (
                        <span className="rounded-full bg-[rgba(249,77,77,0.95)] px-3 py-[5px] text-xs font-semibold text-white shadow-md">
                          -{vehicle.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 px-6 pb-6 pt-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.brand} • {vehicle.segment}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{vehicle.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge size={16} className="text-primary" />
                        <span>{vehicle.km.toLocaleString("es-AR")} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel size={16} className="text-primary" />
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings size={16} className="text-primary" />
                        <span>{vehicle.transmission}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-primary">
                        ${vehicle.price.toLocaleString("es-AR")}
                      </div>
                      {vehicle.prevPrice && (
                        <div className="text-sm font-semibold text-muted-foreground/70 line-through">
                          ${vehicle.prevPrice.toLocaleString("es-AR")}
                        </div>
                      )}
                    </div>

                    <div className="w-full rounded-full bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] text-center">
                      Ver más
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/comprar"
            className="rounded-full border border-[#0188c8] bg-white px-8 py-3 text-sm font-semibold text-[#0188c8] transition-all hover:border-[#0188c8] hover:bg-[#0188c8] hover:text-white"
          >
            Ver Todas las Ofertas
          </Link>
        </div>
      </div>
    </section>
  )
}
