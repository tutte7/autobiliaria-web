import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import {
  BadgeCheck,
  BookOpenCheck,
  Car,
  CopyCheck,
  FileClock,
  FileSearch,
  FileText,
  Gavel,
  MapPin,
  Repeat2,
  TrafficCone,
  Clock3,
  FileCheck2,
} from "lucide-react"

const services = [
  { label: "Patentamiento de 0 Kms.", icon: Car },
  { label: "Transferencias (vehículos inscriptos en cualquier punto del país).", icon: Repeat2 },
  { label: "Denuncias de ventas ante Registro Automotor.", icon: Gavel },
  { label: "Prendas (inscripciones y cancelaciones).", icon: BadgeCheck },
  { label: "Informes de Dominio.", icon: FileText },
  { label: "Informes Históricos de Dominio.", icon: BookOpenCheck },
  { label: "Informes de deuda de patentes Arba, Municipalizados, etc.", icon: FileClock },
  { label: "Duplicados de Título de Propiedad, Cédula Verde, Cédula de Autorizado (azul), etc.", icon: CopyCheck },
  { label: "Bajas y Altas por cambio de Radicación ante Registro y Arba.", icon: MapPin },
  { label: "Informes de Infracciones de Tránsito.", icon: TrafficCone },
]

export default function GestoriaPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-28 pb-16 md:pt-32 md:pb-24 text-white">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-5 md:space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Gestión vehicular integral
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Gestoría</h1>
              <p className="text-base text-white/85 md:text-lg">
                Realizamos todo tipo de gestiones y asesoramiento relacionados con la documentación para su automóvil, ser atendido por personal capacitado y actualizado con las normativas vigentes. Nuestro objetivo es dar el mejor servicio, ahorrarle tiempo, problemas y dinero, evitando desplazamientos innecesarios.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-medium md:px-4 md:py-2 md:text-sm">
                <Clock3 size={16} className="text-white/70" />
                Respuesta ágil
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-medium md:px-4 md:py-2 md:text-sm">
                <FileCheck2 size={16} className="text-white/70" />
                Trámites verificados
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 text-sm text-white/85">
              <h2 className="text-lg font-semibold text-white">Acompañamiento personalizado</h2>
              <p>
                Centralizamos cada paso de tu trámite y te mantenemos al tanto del estado de tu documentación con comunicación clara y transparente.
              </p>
              <p>
                Coordinamos turnos, verificamos requisitos y resolvemos gestiones urgentes para que solo te ocupes de disfrutar tu vehículo.
              </p>
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Hablar con un asesor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto w-full max-w-[1200px] space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Servicios brindados por gestoría de autobiliaria:
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground">
              Te acompañamos en cada gestión con procesos claros, seguimiento continuo y el respaldo de un equipo especializado en normativa automotriz vigente en todo el país.
            </p>
          </div>

          <ul className="grid gap-3 md:gap-4 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon
              const responsiveText =
                service.label.length > 85
                  ? "text-xs md:text-sm"
                  : service.label.length > 70
                    ? "text-sm md:text-[0.95rem]"
                    : "text-sm md:text-base"

              return (
                <li
                  key={service.label}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3 shadow-sm transition hover:border-primary/60 hover:shadow-lg md:px-5 md:py-4"
                >
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <p
                    className={`${responsiveText} font-medium text-foreground/90 whitespace-normal md:whitespace-nowrap md:overflow-hidden md:text-ellipsis`}
                  >
                    {service.label}
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="rounded-3xl border border-border bg-muted/40 px-6 py-10 text-center shadow-sm md:px-12">
            <p className="text-lg font-medium text-foreground">
              Ante cualquier duda lo esperamos por nuestras oficinas donde lo asesoraremos.
            </p>
          </div>
        </div>
      </section>

      <OpportunitiesBanner />

      <Footer />
      <WhatsappCTA />
    </main>
  )
}


