"use client"

import { DollarSign, Calendar, Gauge, Fuel, Cog } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: number
  name: string
  price: number
  year: number
  km: number
  fuel: string
  transmission: string
  image: string
  featured?: boolean
}

export default function VehiclesGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Link key={vehicle.id} href={`/vehiculo/${vehicle.id}`}>
            <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col">
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-muted group">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {vehicle.featured && (
                  <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Destacado
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{vehicle.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge size={14} />
                      <span>{vehicle.km.toLocaleString("es-AR")} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel size={14} />
                      <span>{vehicle.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cog size={14} />
                      <span>{vehicle.transmission}</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <span className="text-primary font-bold text-xl flex items-center">
                    <DollarSign size={20} />
                    {vehicle.price.toLocaleString("es-AR")}
                  </span>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No se encontraron vehículos con los filtros seleccionados</p>
        </div>
      )}
    </div>
  )
}
