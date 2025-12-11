import { notFound } from "next/navigation";
import { vehiclesService } from "@/services/vehicles";
import VehicleDetailClient from "./vehicle-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailPage({ params }: PageProps) {
  // Next.js 15: params es una Promesa
  const { id } = await params;

  try {
    const vehicle = await vehiclesService.getVehicleById(id);
    
    // Si la API devuelve algo que no es el vehículo (aunque getVehicleById debería fallar si es 404),
    // podemos validar aquí también.
    if (!vehicle) {
      notFound();
    }

    return <VehicleDetailClient vehicle={vehicle} />;
  } catch (error) {
    console.error("Error cargando vehículo:", error);
    notFound();
  }
}
