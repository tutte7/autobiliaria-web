import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import VehicleFilters from "@/components/vehicle-filters"
import VehiclesGrid from "@/components/vehicles-grid"
import { vehiclesService } from "@/services/vehicles"

// En Next.js 15, searchParams es una Promise
interface ComprarPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ComprarPage(props: ComprarPageProps) {
  // Esperar a que se resuelvan los params
  const searchParams = await props.searchParams;

  // Parsear search params ya resueltos
  const marca = typeof searchParams.marca === 'string' ? searchParams.marca : undefined;
  const precioMin = typeof searchParams.precio_min === 'string' ? parseInt(searchParams.precio_min) : undefined;
  const precioMax = typeof searchParams.precio_max === 'string' ? parseInt(searchParams.precio_max) : undefined;
  const anioMin = typeof searchParams.anio_min === 'string' ? parseInt(searchParams.anio_min) : undefined;
  const kmMax = typeof searchParams.km_max === 'string' ? parseInt(searchParams.km_max) : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const ordering = typeof searchParams.ordering === 'string' ? searchParams.ordering : undefined;
  const opportunity = searchParams.opportunity === 'true';
  
  // Mapear otros filtros si existen en la URL
  const filters = {
    marca,
    precio_min: precioMin,
    precio_max: precioMax,
    anio_min: anioMin,
    km_max: kmMax,
    search,
    ordering,
    ...(opportunity ? { oportunidad: true } : {}),
  };

  // Fetch de datos en el servidor
  const vehicles = await vehiclesService.getVehicles(filters);
  const resultCount = vehicles.length;
  const resultLabel = resultCount === 1 ? "vehículo" : "vehículos";
  
  // Para el estado inicial de los filtros en la UI, pasamos los valores parseados.
  const initialFilters = {
    brand: marca || "",
    model: "",
    state: "",
    opportunity: opportunity,
    priceMin: precioMin || 0,
    priceMax: precioMax || 100000000,
    year: anioMin || 2000,
    km: kmMax || 200000,
    fuel: "",
    transmission: "",
    segment: "",
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />
        <div className="max-w-[1200px] mx-auto px-4 space-y-3 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Nuestro Inventario</h1>
          <p className="text-lg opacity-90">{resultCount} {resultLabel} disponibles</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <VehicleFilters externalFilters={initialFilters} />
            </div>

            {/* Vehicles Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl border border-border bg-card px-5 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
                <div className="text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{resultCount}</span> {resultLabel}
                </div>
              </div>

              <VehiclesGrid vehicles={vehicles} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}
