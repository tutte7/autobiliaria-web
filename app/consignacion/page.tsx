import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import { cn } from "@/lib/utils"
import {
  Handshake,
  Store,
  Megaphone,
  ClipboardCheck,
  FileCheck2,
  BadgeDollarSign,
  RefreshCcw,
  ArrowUpRight,
} from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Otra alternativa para vender",
    description: "Consigná tu auto con un proceso seguro y sin riesgos, respaldado por Autobiliaria.com.",
    icon: Handshake,
  },
  {
    number: "02",
    title: "Sin costo y a tu ritmo",
    description: "Dejá tu unidad el tiempo que necesites; no cobramos por exhibirla ni por custodiarla.",
    icon: Store,
  },
  {
    number: "03",
    title: "Exhibición estratégica",
    description: "Mostramos tu vehículo en nuestro salón de Playa Grande con fotografías y puesta en escena profesional.",
    icon: Megaphone,
  },
  {
    number: "04",
    title: "Nos encargamos de todo",
    description: "Publicamos, atendemos consultas y gestionamos la venta de tu unidad con una experiencia premium para cada comprador.",
    icon: ClipboardCheck,
  },
  {
    number: "05",
    title: "Trámites integrales",
    description: "Llevamos adelante la documentación necesaria para la entrega y la transferencia del dominio, sin excepciones.",
    icon: FileCheck2,
  },
  {
    number: "06",
    title: "Cobro inmediato",
    description: "Cuando entregamos la unidad, recibís el monto pactado en efectivo en el mismo acto, con total transparencia.",
    icon: BadgeDollarSign,
  },
  {
    number: "07",
    title: "Financiación y permutas",
    description: "Ofrecemos financiación bancaria o propia, y tomamos unidades en parte de pago para acelerar la operación.",
    icon: RefreshCcw,
  },
]

export default function ConsignacionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[140px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Consignación
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Traé tu unidad, nosotros hacemos el resto</h1>
              <p className="text-base text-white/85 md:text-lg">
                Consignar tu auto en Autobiliaria.com es sinónimo de seguridad, exposición profesional y resultados garantizados. Vos decidís cuándo dejarlo; nosotros nos ocupamos de venderlo al mejor valor.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-sm font-medium">
              <span className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-white">
                <Store size={16} className="text-white/70" />
                Salón Playa Grande
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-white">
                <BadgeDollarSign size={16} className="text-white/70" />
                Cobro inmediato
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 text-sm text-white/85">
              <p className="text-lg font-semibold text-white">¿Listo para consignar?</p>
              <p>
                Coordinamos una inspección inicial, definimos el precio objetivo y firmamos el acuerdo de consignación. Sin costos ocultos, sin complicaciones.
              </p>
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Reservar visita
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 px-4 pb-20">
        <div className="mx-auto w-full max-w-[1200px] space-y-12">
          <div className="space-y-4 text-center">
            <p className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Paso a paso
            </p>
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Consignación pensada para tu tranquilidad</h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground">
              Acompañamos cada etapa del proceso para que te concentres en lo importante. Transparencia, seguimiento y comunicación constante.
            </p>
          </div>

          <div className="relative mt-12 space-y-6">
            <span className="hidden md:block absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-primary/20" aria-hidden="true" />
            {steps.map((step, index) => {
              const Icon = step.icon
              const alignLeft = index % 2 === 0
              return (
                <div
                  key={step.number}
                  className={cn(
                    "relative rounded-3xl border border-border bg-card/80 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-lg",
                    "md:w-[calc(50%-28px)]",
                    alignLeft ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"
                  )}
                >
                  <div
                    className={cn(
                      "hidden md:flex md:h-0 md:w-0 md:items-center md:justify-center",
                      alignLeft ? "md:absolute md:-right-[34px] md:top-1/2 md:-translate-y-1/2" : "md:absolute md:-left-[34px] md:top-1/2 md:-translate-y-1/2"
                    )}
                    aria-hidden="true"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold aspect-square">
                      {step.number}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 md:hidden">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold aspect-square">
                      {step.number}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Paso {step.number}</p>
                  </div>

                  <div className={cn("mt-4 flex items-center gap-3", "md:mt-0")}> 
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={20} />
                    </span>
                    <p className="hidden text-xs font-semibold uppercase tracking-[0.35em] text-primary/70 md:block">Paso {step.number}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-primary/30 bg-[linear-gradient(156deg,rgba(1,136,200,0.15)_0%,rgba(0,232,255,0.22)_100%)] p-10 text-center shadow-sm md:mt-16 md:p-14">
            <div className="space-y-6 text-foreground">
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-5 py-2 text-xs font-semibold uppercase text-primary">
                Traé tu unidad a Autobiliaria
              </span>
              <h3 className="text-3xl font-semibold md:text-[40px]">Nos encargamos de todo y vos te despreocupás</h3>
              <p className="text-base text-muted-foreground">
                Autobiliaria consignación, la manera más segura para vender tu auto.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-primary">
                <span>100% garantizado</span>
                <span className="h-1 w-1 rounded-full bg-primary/50" aria-hidden="true" />
                <span>Autobiliaria vende</span>
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


