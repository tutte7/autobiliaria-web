import { vehiclesService } from "@/services/vehicles"
import MiniCatalogClient from "./mini-catalog-client"

// Server Component Wrapper: Se encarga del Data Fetching
export default async function MiniCatalog() {
  const vehicles = await vehiclesService.getVehicles({ limit: 30 })

  if (!vehicles || vehicles.length === 0) {
    return null
  }

  return <MiniCatalogClient vehicles={vehicles} />
}
