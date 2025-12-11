import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import { MapPin, Phone, Printer, ClipboardList, Gauge } from "lucide-react"

const registries = [
  { numero: "01", domicilio: "Av. Luro 2633 7°A", telefono: "493-9638", fax: "493-9633" },
  { numero: "02", domicilio: "Rawson 3039", telefono: "494-9003", fax: "496-0573" },
  { numero: "03", domicilio: "Hipólito Yrigoyen 2831", telefono: "493-4963", fax: "496-0013" },
  { numero: "04", domicilio: "Catamarca 2969", telefono: "473-2409", fax: "473-0540" },
  { numero: "05", domicilio: "Falucho 3165 P.B.", telefono: "491-8672", fax: "494-6595" },
  { numero: "06", domicilio: "Avellaneda 2815", telefono: "492-0474", fax: "496-0016" },
  { numero: "07", domicilio: "Hipólito Yrigoyen 3252", telefono: "494-4916", fax: "493-7563" },
  { numero: "08", domicilio: "Avellaneda 3063", telefono: "476-0571", fax: "476-0570" },
  { numero: "09", domicilio: "Garay 1569", telefono: "451-4063", fax: "451-3722" },
  { numero: "10", domicilio: "Corrientes 1847 - P1", telefono: "492-4583", fax: "496-4046" },
  { numero: "11", domicilio: "Alvarado 2857", telefono: "496-3132", fax: "496-3133" },
  { numero: "Motos", domicilio: "Rawson 2790", telefono: "493-0542", fax: "-" },
  { numero: "Prendario", domicilio: "Gascon 2962", telefono: "494-7607", fax: "-" },
  {
    numero: "Verificación",
    domicilio: "Tucumán esq. Laprida (8 a 12 Hs)",
    telefono: "-",
    fax: "-",
  },
  {
    numero: "V. De motos",
    domicilio: "Tucumán 2856. (Martes y Jueves - 9 a 12 Hs)",
    telefono: "-",
    fax: "-",
  },
]

const formatContactValue = (value: string) => (value === "-" ? "No disponible" : value)

export default function RegistroDelAutomotorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Registro del automotor
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Registro del Automotor</h1>
              <p className="text-base text-white/85 md:text-lg">
                Organizamos la información de los registros automotores para que encuentres rápidamente el domicilio y los datos de contacto que necesitás. Una experiencia clara, diseñada para consultas ágiles desde cualquier dispositivo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium">
                <ClipboardList size={16} className="text-white/70" />
                Datos actualizados
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium">
                <Gauge size={16} className="text-white/70" />
                Pensado para el automovilista
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 text-sm text-white/85">
              <h2 className="text-lg font-semibold text-white">Cómo aprovechar esta guía</h2>
              <p>
                Cada registro se presenta en formato tarjeta para que puedas identificar al instante su número, dirección y vías de contacto.
              </p>
              <p>
                Guardá la información en tu dispositivo o compartila con tu equipo con un solo toque, sin tener que navegar tablas interminables.
              </p>
              <Link
                href="/gestoria"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Ir a Gestoría
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto w-full max-w-[1200px] space-y-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Registros por jurisdicción</h2>
              <p className="max-w-3xl text-base text-muted-foreground">
                Encontrá el registro más cercano y contactate en segundos. Ideal para trámites de transferencias, patentamientos y verificaciones.
              </p>
            </div>
            <div className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Cobertura completa
            </div>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {registries.map((registry) => (
              <li
                key={registry.numero}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-sm transition hover:border-primary/60 hover:shadow-lg"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Registro {registry.numero}
                    </span>
                    <MapPin size={18} className="text-primary/70" />
                  </div>
                  <p className="text-base font-semibold text-foreground md:text-lg">{registry.domicilio}</p>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-primary" />
                    {registry.telefono !== "-" ? (
                      <a href={`tel:+54${registry.telefono.replace(/[^0-9]/g, "")}`} className="font-medium text-foreground/90 transition hover:text-primary">
                        {registry.telefono}
                      </a>
                    ) : (
                      <span className="font-medium text-muted-foreground/80">{formatContactValue(registry.telefono)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Printer size={16} className="text-primary" />
                    {registry.fax !== "-" ? (
                      <span className="font-medium text-foreground/90">{registry.fax}</span>
                    ) : (
                      <span className="font-medium text-muted-foreground/80">{formatContactValue(registry.fax)}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OpportunitiesBanner />

      <Footer />
      <WhatsappCTA />
    </main>
  )
}


