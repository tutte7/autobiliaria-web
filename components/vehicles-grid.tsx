"use client"

import { VehicleCard } from "@/components/vehicle-card"

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} variant="simple" {...vehicle} />
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
