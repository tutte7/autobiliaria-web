import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import {
  Home,
  ShoppingBag,
  Tag,
  Sparkles,
  Car,
  Shuffle,
  FileCheck2,
  MapPin,
  Users,
  ShieldCheck,
  Map,
  Phone,
  HandCoins,
  ClipboardList,
  Shield,
} from "lucide-react"

interface SiteLink {
  label: string
  href: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  hint?: string
}

const siteMapSections: Array<{
  heading: string
  description: string
  links: SiteLink[]
}> = [
  {
    heading: "Navegación principal",
    description: "Los accesos esenciales para comenzar a explorar Autobiliaria.com",
    links: [
      {
        label: "Inicio",
        href: "/",
        description: "Visión general de destacados, oportunidades y novedades.",
        icon: Home,
      },
      {
        label: "Comprar",
        href: "/comprar",
        description: "Catálogo completo filtrado por marca, tipo y condiciones.",
        icon: ShoppingBag,
      },
      {
        label: "Vender",
        href: "/vender",
        description: "Proceso guiado para publicar tu vehículo con asesoramiento.",
        icon: Tag,
      },
      {
        label: "Oportunidades",
        href: "/comprar?opportunity=true",
        description: "Selección de ofertas especiales y precios destacados.",
        icon: Sparkles,
      },
    ],
  },
  {
    heading: "Catálogo y operaciones",
    description: "Rutas pensadas para avanzar en operaciones específicas.",
    links: [
      {
        label: "Vehículo",
        href: "/comprar",
        description: "Ingresá a cualquier ficha individual para ver detalles completos.",
        icon: Car,
        hint: "Ruta dinámica: /vehiculo/[id]",
      },
      {
        label: "Comprar / Vender",
        href: "/comprar-vender",
        description: "Compará beneficios de ambas operaciones en un mismo espacio.",
        icon: Shuffle,
      },
      {
        label: "Gestoría",
        href: "/gestoria",
        description: "Servicios documentales y asesoramiento personalizado.",
        icon: FileCheck2,
      },
      {
        label: "Registro del Automotor",
        href: "/registro-del-automotor",
        description: "Directorio actualizado de registros con domicilios y contactos.",
        icon: MapPin,
      },
    ],
  },
  {
    heading: "Información institucional",
    description: "Conocé nuestra historia, políticas y vías de contacto.",
    links: [
      {
        label: "Quienes Somos",
        href: "/quienes-somos",
        description: "Origen, valores y evolución de Autobiliaria.com.",
        icon: Users,
      },
      {
        label: "Política de privacidad",
        href: "/politica-de-privacidad",
        description: "Términos legales, confidencialidad y uso del servicio.",
        icon: ShieldCheck,
      },
      {
        label: "Mapa del sitio",
        href: "/mapa-del-sitio",
        description: "Visión general de las secciones disponibles en la web.",
        icon: Map,
      },
      {
        label: "Contacto",
        href: "/contacto",
        description: "Formularios, teléfonos y direcciones de atención.",
        icon: Phone,
      },
    ],
  },
  {
    heading: "Soluciones financieras y seguros",
    description: "Servicios complementarios para acompañarte en la operación.",
    links: [
      {
        label: "Préstamo prendario",
        href: "/prestamo-prendario",
        description: "Opciones de financiación respaldadas por especialistas.",
        icon: HandCoins,
      },
      {
        label: "Consignación",
        href: "/consignacion",
        description: "Gestionamos la venta de tu vehículo con respaldo integral.",
        icon: ClipboardList,
      },
      {
        label: "Seguro",
        href: "/seguro",
        description: "Coberturas y asesoramiento para proteger tu inversión.",
        icon: Shield,
      },
    ],
  },
]

export default function MapaDelSitioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[140px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Mapa del sitio
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Todo el universo Autobiliaria, en un vistazo</h1>
              <p className="text-base text-white/85 md:text-lg">
                Navegá rápidamente por cada sección disponible y encontrá la información que necesitás con una estructura clara y fácil de escanear.
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 text-sm text-white/85">
              <p className="font-semibold text-white">¿Cómo usar este mapa?</p>
              <p>
                Cada tarjeta resume la función de la sección y te dirige directamente al destino. Ideal para guardar como referencia rápida o compartir con tu equipo.
              </p>
              <p className="text-xs text-white/70">
                Consejo: añadí esta página a tus favoritos para volver siempre a los accesos clave.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 px-4 pb-20">
        <div className="mx-auto w-full max-w-[1200px] space-y-12">
          {siteMapSections.map((section) => (
            <div key={section.heading} className="space-y-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{section.heading}</h2>
                  <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{section.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.links.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex h-full flex-col justify-between gap-4 rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                          <Icon size={22} />
                        </span>
                        <div>
                          <p className="text-lg font-semibold text-foreground">{link.label}</p>
                          {link.hint && <p className="text-xs text-muted-foreground">{link.hint}</p>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                      <span className="inline-flex items-center gap-1 self-start rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
                        Acceder
                        <svg
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.5 8h9m0 0L9.75 4.5M12.5 8l-2.75 3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <OpportunitiesBanner />

      <Footer />
      <WhatsappCTA />
    </main>
  )
}


