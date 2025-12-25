import Link from "next/link"
import { vehiclesService, VehicleCard as VehicleCardType } from "@/services/vehicles"
import { VehicleCard } from "@/components/vehicle-card"

// Client Component: Maneja la UI
function FeaturedOffersClient({ vehicles }: { vehicles: VehicleCardType[] }) {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-16">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold text-foreground">Ofertas Destacadas</h2>
          <p className="text-lg text-muted-foreground">Los mejores precios en autos seleccionados</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pb-8">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              variant="gradient"
              {...vehicle}
            />
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

// Server Component Wrapper: Se encarga del Data Fetching
export default async function FeaturedOffers() {
  const vehicles = await vehiclesService.getVehicles({ destacar_en_web: true, limit: 6 })

  if (!vehicles || vehicles.length === 0) {
    return null
  }

  return <FeaturedOffersClient vehicles={vehicles} />
}
