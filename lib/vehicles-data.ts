export interface Vehicle {
  id: number
  name: string
  price: number
  year: number
  km: number
  fuel: string
  transmission: string
  color?: string
  city?: string
  brand: string
  model: string
  segment: string
  engine?: string
  description: string
  images: string[]
  features: string[]
  category?: "auto" | "camion" | "moto"
  featured?: boolean
  opportunity?: boolean
  prevPrice?: number
  discount?: number
  badge?: string
  seller: {
    name: string
    phone: string
    email: string
    location: string
  }
}

export const ALL_VEHICLES: Vehicle[] = [
  {
    id: 1,
    name: "BMW X3 2024",
    price: 45000000,
    year: 2024,
    km: 5000,
    fuel: "Nafta",
    transmission: "Automática",
    color: "Blanco",
    city: "Buenos Aires",
    brand: "BMW",
    model: "X3",
    segment: "SUV",
    engine: "2.0L Turbo",
    description:
      "BMW X3 2024 en excelente estado, con todas las comodidades y tecnología de última generación. Kilometraje bajo y mantenimiento al día en concesionaria oficial. Perfecto para quienes buscan lujo y performance.",
    images: [
      "/bmw-x3-blanco.jpg",
      "/carrousel-1.jpg",
      "/carrousel-2.jpg",
      "/carrousel-3.jpg",
    ],
    features: [
      "Cuero premium",
      "Techo panorámico",
      "Sistema de navegación",
      "Cámara 360°",
      "Control de crucero adaptativo",
      "Asientos con memoria",
      "Sistema de audio premium",
      "Freno de emergencia automático",
    ],
    category: "auto",
    badge: "Nuevo",
    opportunity: true,
    seller: {
      name: "Autobiliaria Premium",
      phone: "+54 9 11 2345-6789",
      email: "ventas@autobiliaria.com",
      location: "Av. del Libertador 5678, CABA",
    },
  },
  {
    id: 2,
    name: "Mercedes-Benz C200 2024",
    price: 48000000,
    year: 2024,
    km: 8000,
    fuel: "Nafta",
    transmission: "Automática",
    color: "Plata",
    city: "Buenos Aires",
    brand: "Mercedes-Benz",
    model: "C200",
    segment: "Sedán",
    engine: "2.0L Turbo",
    description:
      "Mercedes-Benz C200 2024 con elegancia y tecnología alemana. Vehículo seminuevo con garantía de fábrica vigente. Ideal para ejecutivos que buscan confort y prestigio.",
    images: [
      "/mercedes-benz-c200-plata.jpg",
      "/carrousel-2.jpg",
      "/carrousel-3.jpg",
      "/carrousel-4.jpg",
    ],
    features: [
      "Sistema MBUX",
      "Climatización dual",
      "Asientos eléctricos",
      "Luz ambiental",
      "Sensores de parking",
      "Apple CarPlay",
      "Airbags laterales",
      "Control de estabilidad",
    ],
    category: "auto",
    badge: "Nuevo",
    opportunity: true,
    seller: {
      name: "Autobiliaria Premium",
      phone: "+54 9 11 2345-6789",
      email: "ventas@autobiliaria.com",
      location: "Av. del Libertador 5678, CABA",
    },
  },
  {
    id: 3,
    name: "Audi A4 2024",
    price: 38000000,
    year: 2024,
    km: 12000,
    fuel: "Diésel",
    transmission: "Automática",
    color: "Gris",
    city: "Buenos Aires",
    brand: "Audi",
    model: "A4",
    segment: "Sedán",
    engine: "2.0L TDI",
    description:
      "Audi A4 2024 con motor diésel eficiente. Diseño deportivo con tecnología quattro. Mantenimiento completo y documentación al día.",
    images: [
      "/audi-a4-gris.jpg",
      "/carrousel-3.jpg",
      "/carrousel-4.jpg",
      "/carrousel-1.jpg",
    ],
    features: [
      "Virtual Cockpit",
      "Matrix LED",
      "Asientos deportivos",
      "Paddle shifters",
      "Sistema de sonido B&O",
      "Techo corredizo",
      "Control de tracción",
      "Volante multifunción",
    ],
    category: "auto",
    badge: "Nuevo",
    seller: {
      name: "Autobiliaria Premium",
      phone: "+54 9 11 2345-6789",
      email: "ventas@autobiliaria.com",
      location: "Av. del Libertador 5678, CABA",
    },
  },
  {
    id: 4,
    name: "Honda Civic 2023",
    price: 18500000,
    year: 2023,
    km: 15000,
    fuel: "Nafta",
    transmission: "Manual",
    color: "Gris",
    city: "Buenos Aires",
    brand: "Honda",
    model: "Civic",
    segment: "Sedán",
    engine: "1.8L",
    description:
      "Honda Civic 2023 con excelente rendimiento de combustible. Transmisión manual para los que disfrutan de conducir. Estado impecable.",
    images: [
      "/honda-civic-gris.jpg",
      "/carrousel-4.jpg",
      "/carrousel-1.jpg",
      "/carrousel-2.jpg",
    ],
    features: [
      "Sistema multimedia",
      "Bluetooth",
      "Control de crucero",
      "Cierre centralizado",
      "Dirección asistida",
      "Faros LED",
      "Sistema ABS",
      "Airbags duales",
    ],
    category: "auto",
    seller: {
      name: "Autobiliaria Centro",
      phone: "+54 9 11 3456-7890",
      email: "contacto@autobiliaria.com",
      location: "Av. Corrientes 2345, CABA",
    },
  },
  {
    id: 5,
    name: "Ford Focus 2021",
    price: 12000000,
    year: 2021,
    km: 25000,
    fuel: "Diésel",
    transmission: "Automática",
    color: "Blanco",
    city: "Buenos Aires",
    brand: "Ford",
    model: "Focus",
    segment: "Hatchback",
    engine: "2.0L TDCi",
    description:
      "Ford Focus 2021 diésel, económico y confiable. Perfecto para uso diario con gran espacio interior. Mantenimiento regular en concesionaria.",
    images: [
      "/ford-focus-blanco.jpg",
      "/carrousel-1.jpg",
      "/carrousel-2.jpg",
      "/carrousel-3.jpg",
    ],
    features: [
      "SYNC 3",
      "Cámara trasera",
      "Sensor de lluvia",
      "Climatizador automático",
      "Volante de cuero",
      "Luces automáticas",
      "Control de estabilidad",
      "Frenos ABS",
    ],
    category: "auto",
    seller: {
      name: "Autobiliaria Centro",
      phone: "+54 9 11 3456-7890",
      email: "contacto@autobiliaria.com",
      location: "Av. Corrientes 2345, CABA",
    },
  },
  {
    id: 6,
    name: "Toyota Corolla 2023",
    price: 28500000,
    prevPrice: 32000000,
    discount: 11,
    year: 2023,
    km: 15000,
    fuel: "Nafta",
    transmission: "Automática",
    color: "Azul",
    city: "Buenos Aires",
    brand: "Toyota",
    model: "Corolla",
    segment: "Sedán",
    engine: "2.0L",
    description:
      "Toyota Corolla 2023 en excelente estado. Seminuevo con mantenimiento completo. Documentación al día. Perfecto para uso diario. ¡Gran oportunidad con descuento!",
    images: [
      "/toyota-corolla-azul.jpg",
      "/white-toyota-corolla-2023-front.jpg",
      "/white-toyota-corolla-2023-side.jpg",
      "/white-toyota-corolla-2023-interior.jpg",
    ],
    features: [
      "Climatización automática",
      "Sistema multimedia táctil",
      "Cámara trasera",
      "Sensores de estacionamiento",
      "Control de crucero",
      "Bluetooth integrado",
      "Airbags frontales",
      "Sistema ABS",
    ],
    category: "auto",
    badge: "Oportunidad",
    opportunity: true,
    seller: {
      name: "Autobiliaria Centro",
      phone: "+54 9 11 3456-7890",
      email: "contacto@autobiliaria.com",
      location: "Av. Corrientes 2345, CABA",
    },
  },
  {
    id: 104,
    name: "Ford Ranger 2020",
    price: 22000000,
    year: 2020,
    km: 40000,
    fuel: "Diésel",
    transmission: "Manual",
    color: "Rojo",
    city: "Buenos Aires",
    brand: "Ford",
    model: "Ranger",
    segment: "Pickup",
    engine: "3.2L TDCi",
    description:
      "Ford Ranger 2020 4x4, ideal para trabajo y aventura. Motor diésel potente y confiable. Excelente estado general.",
    images: [
      "/ford-ranger-roja.jpg",
      "/carrousel-3.jpg",
      "/carrousel-4.jpg",
      "/carrousel-1.jpg",
    ],
    features: [
      "Tracción 4x4",
      "Barra antivuelco",
      "Lona marítima",
      "Sistema multimedia",
      "Control de tracción",
      "Aire acondicionado",
      "Dirección hidráulica",
      "ABS + EBD",
    ],
    category: "camion",
    opportunity: true,
    seller: {
      name: "Autobiliaria Trucks",
      phone: "+54 9 11 4567-8901",
      email: "trucks@autobiliaria.com",
      location: "Ruta 8 Km 45, Pilar",
    },
  },
  {
    id: 105,
    name: "Honda CB500X 2022",
    price: 9500000,
    year: 2022,
    km: 8000,
    fuel: "Nafta",
    transmission: "Manual",
    color: "Negro/Rojo",
    city: "Buenos Aires",
    brand: "Honda",
    model: "CB500X",
    segment: "Moto",
    engine: "471cc",
    description:
      "Honda CB500X 2022, perfecta para touring y uso diario. Bajo kilometraje y excelente estado. Incluye maletas laterales.",
    images: [
      "/placeholder.jpg",
      "/carrousel-1.jpg",
      "/carrousel-2.jpg",
      "/carrousel-3.jpg",
    ],
    features: [
      "ABS",
      "Parabrisas regulable",
      "Maletas laterales",
      "Protectores de motor",
      "Faros LED",
      "Panel digital",
      "Asiento confort",
      "Caballete central",
    ],
    category: "moto",
    seller: {
      name: "Autobiliaria Motos",
      phone: "+54 9 11 5678-9012",
      email: "motos@autobiliaria.com",
      location: "Av. San Martín 890, Vicente López",
    },
  },
]

export function getVehicleById(id: number): Vehicle | undefined {
  return ALL_VEHICLES.find((vehicle) => vehicle.id === id)
}

export function getFeaturedVehicles(): Vehicle[] {
  return ALL_VEHICLES.filter((vehicle) => vehicle.featured)
}

export function getOpportunityVehicles(): Vehicle[] {
  return ALL_VEHICLES.filter((vehicle) => vehicle.opportunity)
}

