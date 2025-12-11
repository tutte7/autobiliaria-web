import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Wrench,
  Headset,
  ArrowUpRight,
  ClipboardCheck,
} from "lucide-react"

const coverages = [
  {
    title: "Coberturas flexibles",
    description: "Elegí entre Terceros Completo o Todo Riesgo para autos 0km y usados, con sumas aseguradas actualizadas.",
    icon: ShieldCheck,
  },
  {
    title: "Gestión 100% online",
    description: "Administrá tu póliza desde la web o tu móvil, descargá certificados y controlá vencimientos en segundos.",
    icon: Smartphone,
  },
  {
    title: "Siniestros ágiles",
    description: "Realizá la denuncia de choque, robo o roturas con acompañamiento paso a paso y seguimiento en tiempo real.",
    icon: AlertTriangle,
  },
  {
    title: "Asistencia inmediata",
    description: "Solicitá auxilio mecánico, remolque o cambio de neumáticos ante cualquier eventualidad en ruta.",
    icon: Wrench,
  },
  {
    title: "Acompañamiento humano",
    description: "Contá con un representante asignado para resolver dudas y renegociar condiciones cuando lo necesites.",
    icon: Headset,
  },
]

export default function SeguroPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[140px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Seguro vehicular
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Protegé tu auto, estés donde estés</h1>
              <p className="text-base text-white/85 md:text-lg">
                Diseñamos un servicio integral para asegurar tu 0km o usado, con cobertura adecuada, asistencia inmediata y gestión digital para que nunca te quedes sin respaldo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-sm font-medium">
              <span className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-white">
                <ShieldCheck size={16} className="text-white/70" />
                Terceros completo · Todo riesgo
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-white">
                <Smartphone size={16} className="text-white/70" />
                Gestión digital 24/7
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 text-sm text-white/85">
              <p className="text-lg font-semibold text-white">¿Querés cotizar ahora?</p>
              <p>
                Compará planes, ajustá coberturas y recibí una propuesta personalizada en minutos con la guía de nuestro equipo especializado.
              </p>
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Hablar con un asesor
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 px-4 pb-20">
        <div className="mx-auto w-full max-w-[1200px] space-y-12">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Cobertura integral
            </p>
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Todo lo que necesitás para manejar tranquilo</h2>
            <p className="max-w-3xl text-base text-muted-foreground">
              Nuestra red de aseguradoras aliadas nos permite ofrecerte soluciones a medida, sin letra chica y con soporte humano disponible. Estas son las ventajas de elegir Autobiliaria para asegurar tu vehículo.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-12">
            {coverages.map((coverage, index) => {
              const Icon = coverage.icon
              const layout = [
                "md:col-span-7 md:row-span-2",
                "md:col-span-5 md:row-span-2",
                "md:col-span-4",
                "md:col-span-4",
                "md:col-span-4",
              ][index] || "md:col-span-6"
              const titleSize = index < 2 ? "text-xl md:text-2xl" : "text-lg"
              return (
                <div
                  key={coverage.title}
                  className={cn(
                    "relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-lg",
                    layout
                  )}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" aria-hidden="true" />

                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-primary ring-1 ring-primary/20">
                      <Icon size={20} />
                    </span>
                    <span className="text-xs font-semibold uppercase text-primary/80">Cobertura</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <h3 className={cn("font-semibold text-foreground", titleSize)}>{coverage.title}</h3>
                    <p className="text-sm text-muted-foreground">{coverage.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm md:p-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Proceso simple</p>
                <h3 className="text-2xl font-semibold text-foreground">Tus próximos pasos</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">1</span>
                    Compartí los datos del vehículo y tu historial de seguros.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">2</span>
                    Recibí alternativas de cobertura y ajustá franquicias según tu necesidad.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">3</span>
                    Activá la póliza y descargá la documentación desde tu teléfono.
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/30 bg-[linear-gradient(156deg,rgba(1,136,200,0.12)_0%,rgba(0,232,255,0.18)_100%)] p-6 shadow-sm md:p-10">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="space-y-4">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase text-primary">
                    Siempre acompañados
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Ante cualquier siniestro, seguimos tu caso hasta la resolución final.
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Denunciá vía web, app o con tu asesor dedicado. Registramos cada instancia en un panel compartido para que tengas visibilidad total del avance.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/30 p-4 text-sm text-primary">
                  <ClipboardCheck size={18} />
                  <span>Incluye seguimiento de talleres, gestiones con compañías y recordatorios de vencimientos.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OpportunitiesBanner />

      <Footer />
      <WhatsappCTA />
    </main>
  )
}


