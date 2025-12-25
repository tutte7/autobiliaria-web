import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { vehiclesService, VehicleCard as VehicleCardType } from "@/services/vehicles"
import { VehicleCard } from "@/components/vehicle-card"

// 1. Componente de Cliente: Maneja la UI interactiva (Carousel)
// Recibe los datos ya cargados como props.
function LatestArrivalsClient({ vehicles }: { vehicles: VehicleCardType[] }) {
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background px-4 py-16">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold text-foreground">Últimos Ingresos</h2>
          <p className="text-lg text-muted-foreground">Descubrí los vehículos más recientes en nuestro inventario</p>
        </div>

        <div className="relative pb-8">
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
                  <VehicleCard variant="default" {...vehicle} />
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
