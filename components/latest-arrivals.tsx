import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { vehiclesService, VehicleCard } from "@/services/vehicles"

// 1. Componente de Cliente: Maneja la UI interactiva (Carousel)
// Recibe los datos ya cargados como props.
function LatestArrivalsClient({ vehicles }: { vehicles: VehicleCard[] }) {
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background px-4 py-16">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold text-foreground">Últimos Ingresos</h2>
          <p className="text-lg text-muted-foreground">Descubrí los vehículos más recientes en nuestro inventario</p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {vehicles.map((vehicle) => (
                <CarouselItem key={vehicle.id} className="pl-2 md:basis-1/2 lg:basis-1/3 md:pl-4">
                  <Link href={`/vehiculo/${vehicle.id}`}>
                    <div className="group relative overflow-hidden rounded-[26px] border border-border/60 bg-card shadow-[0_18px_32px_-24px_rgba(15,54,89,0.25)] transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                      <div className="relative h-56 overflow-hidden">
                        {/* Usamos img estándar para soportar URLs externas de la API sin configurar domains en next.config */}
                        <img
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 hidden md:flex" />
            <CarouselNext className="-right-12 hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

// 2. Server Component Wrapper: Se encarga SOLO del Data Fetching
// Este es el componente que se exporta por defecto y se usa en la page.tsx
export default async function LatestArrivals() {
  // Llamada al servicio (Server-side fetch)
  const vehicles = await vehiclesService.getLatestArrivals();

  if (!vehicles || vehicles.length === 0) {
    return null; // O podrías retornar un esqueleto o mensaje vacío
  }

  // Pasa los datos al Client Component
  return <LatestArrivalsClient vehicles={vehicles} />;
}
