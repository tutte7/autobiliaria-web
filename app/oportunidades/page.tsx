import { vehiclesService } from "@/services/vehicles"
import OportunidadesClient from "./oportunidades-client"

export default async function OportunidadesPage() {
  // Obtener vehículos con oportunidad del API
  const opportunityVehicles = await vehiclesService.getVehicles({ oportunidad: true })

  // Obtener total de vehículos para mostrar en el mensaje
  const allVehicles = await vehiclesService.getVehicles({ limit: 1 })
  const totalVehicles = allVehicles.length > 0 ? 100 : 0 // Aproximado, idealmente vendría del API

  return (
    <OportunidadesClient
      vehicles={opportunityVehicles}
      totalVehicles={totalVehicles}
    />
  )
}
