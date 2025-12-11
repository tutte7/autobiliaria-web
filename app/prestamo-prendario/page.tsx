import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import {
  BadgeDollarSign,
  HandCoins,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Users,
} from "lucide-react"

const featurePoints = [
  {
    title: "Financiación a tu ritmo",
    description: "Podés financiar la compra de tu auto a tasa fija y en pesos o UVAs.",
    icon: HandCoins,
  },
  {
    title: "Garantía prendaria",
    description: "El préstamo se otorga sobre el vehículo a adquirir, lo que agiliza la aprobación.",
    icon: ShieldCheck,
  },
  {
    title: "Para bancarizados y no bancarizados",
    description: "Nuestro equipo acompaña a cada perfil con los requisitos necesarios.",
    icon: Users,
  },
]

export default function PrestamoPrendarioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[140px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Préstamo prendario
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Financiá tu auto con respaldo seguro</h1>
              <p className="text-base text-white/85 md:text-lg">
                En Autobiliaria.com, el préstamo prendario es la forma más utilizada para financiar tu auto usado o 0KM de hasta 15 años de antigüedad, con mínimos requisitos y asesoramiento de punta a punta.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium">
                <HandCoins size={16} className="text-white/70" />
                Tasa fija o UVAs
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium">
                <ShieldCheck size={16} className="text-white/70" />
                Garantía del vehículo
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 text-sm text-white/85">
              <p className="text-lg font-semibold text-white">Asesoramiento personalizado</p>
              <p>
                Nuestro equipo analiza tu caso, evalúa el mejor plazo y coordina la presentación de la documentación con la entidad financiera.
              </p>
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Solicitar asesor
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 px-4 pb-20">
        <div className="mx-auto w-full max-w-[900px] space-y-10">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Cómo funciona
            </p>
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Elegí tu vehículo, nosotros gestionamos la financiación</h2>
            <p className="text-base text-muted-foreground">
              Reunimos los requisitos clave y te acompañamos en cada paso: desde la selección del plan hasta la presentación ante la entidad financiera.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featurePoints.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="flex h-full flex-col gap-3 rounded-3xl border border-border bg-card/80 p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-primary/30 bg-[linear-gradient(156deg,rgba(1,136,200,0.12)_0%,rgba(0,232,255,0.18)_100%)] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BadgeDollarSign className="h-9 w-9 text-primary" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Montos y cobertura</p>
                  <p className="mt-1 text-base font-medium text-foreground">Financiá hasta el 70% de tu 0KM</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                En autos usados ajustamos el porcentaje de acuerdo a la antigüedad del modelo para garantizar condiciones sostenibles.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-9 w-9 text-primary" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Plazos flexibles</p>
                  <p className="mt-1 text-base font-medium text-foreground">Hasta 72 cuotas con débito automático</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Elegí cuotas mensuales previsibles con tasa fija o UVA, y olvidate de gestionar pagos manuales.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">
                *El porcentaje y la aprobación están sujetos a las condiciones de la entidad que financie. Nuestro equipo te asesorará para presentar la documentación correcta y acelerar la aprobación.
              </p>
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


