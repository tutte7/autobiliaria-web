import Link from "next/link"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpportunitiesBanner from "@/components/opportunities-banner"
import WhatsappCTA from "@/components/whatsapp-cta"
import {
  ArrowUpRight,
  Building2,
  Camera,
  Globe2,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react"

const pillars = [
  {
    icon: ShieldCheck,
    title: "Transparencia como bandera",
    description:
      "Creamos un espacio neutral donde comprador y vendedor se sienten respaldados, con procesos claros y garantías reales para ambas partes.",
  },
  {
    icon: Handshake,
    title: "Experiencias diseñadas",
    description:
      "Coordinamos cada encuentro, cuidamos la información personal y acompañamos cada gestión para que la operación sea simple y segura.",
  },
  {
    icon: Lightbulb,
    title: "Innovación constante",
    description:
      "Integramos nuevos mercados, plataformas y herramientas digitales para mantenernos a la vanguardia del comercio automotor.",
  },
]

const highlights = [
  {
    title: "2006",
    subtitle: "Nuestro punto de partida",
    description:
      "Detectamos la necesidad de brindar seguridad en las operaciones entre particulares y llevamos la lógica de una inmobiliaria al mundo automotor.",
  },
  {
    title: "+18 años",
    subtitle: "Construyendo confianza",
    description:
      "Miles de clientes asistidos, asesoramiento documentado y una comunidad que vuelve a elegirnos por nuestra dedicación.",
  },
  {
    title: "Multimarca",
    subtitle: "Oferta sin límites",
    description:
      "Autos, motos, náutica y maquinarias agrícolas: ampliamos horizontes para responder a nuevas necesidades y oportunidades.",
  },
]

export default function QuienesSomosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-28 text-white">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-10 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Quiénes somos
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Historias que inspiran confianza</h1>
              <p className="text-base text-white/85 md:text-lg">
                Desde 2006 redefinimos la compra y venta de vehículos entre particulares. Creamos una experiencia transparente, segura y humana que acerca a las personas al vehículo que desean.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium">
                <ShieldCheck size={16} className="text-white/70" />
                Seguridad garantizada
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium">
                <Users size={16} className="text-white/70" />
                Equipo especializado
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-6 text-sm text-white/85">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Nuestra voz en cifras</h2>
                <p>
                  Oficinas en <strong>Falucho 1323, B7600 Mar del Plata</strong> y <strong>Paseo Victoria Ocampo s/n (Salida Tunel Playa Grande), C7600 Mar del Plata</strong>. Dos espacios pensados para recibirte como te merecés.
                </p>
              </div>
              <div className="grid gap-4 divide-y divide-white/15 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-white">Citas gestionadas</p>
                  <p className="text-white/75">Coordinamos horarios a medida para compradores y vendedores.</p>
                </div>
                <div className="pt-3 space-y-1">
                  <p className="font-semibold text-white">En medios líderes</p>
                  <p className="text-white/75">Publicaciones sin costo en los principales canales de difusión local.</p>
                </div>
              </div>
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Hablemos ahora
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-16">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-foreground">Cómo comenzó todo</h2>
              <p className="text-base text-muted-foreground">
                Autobiliaria.com nace en diciembre del 2006 cuando los directivos de la empresa detectan que existe una inseguridad marcada a la hora de comprar un vehículo entre particulares. Es por esto que surge la idea de operar como una inmobiliaria (pero de autos), ofreciendo un sistema de comercialización transparente e innovador con todas las garantías necesarias y brindando un lugar neutral para que las partes puedan mostrar y observar los vehículos.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Dos espacios, una experiencia</h3>
              <p className="text-base text-muted-foreground">
                Autobiliaria.com tiene sus oficinas en Falucho 1323, B7600 Mar del Plata, Provincia de Buenos Aires y en Paseo Victoria Ocampo s/n (Salida Tunel Playa Grande), C7600 Mar del Plata, Provincia de Buenos Aires, donde podrás ser atendido y asesorado por personal especializado. Los vehículos son publicados en la web y, sin costo alguno, en los más importantes medios de difusión local.
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm">
                <MapPin className="mb-4 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.3em]">Falucho 1323</p>
                <p className="mt-2 text-base font-medium text-foreground">B7600 Mar del Plata, Provincia de Buenos Aires</p>
                <p className="mt-3 text-sm text-muted-foreground">Atención personalizada y asesoramiento integral.</p>
              </div>
              <div className="rounded-3xl border border-primary/30 bg-[linear-gradient(156deg,rgba(1,136,200,0.12)_0%,rgba(0,232,255,0.18)_100%)] p-6 shadow-sm">
                <Building2 className="mb-4 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.3em]">Paseo Victoria Ocampo s/n</p>
                <p className="mt-2 text-base font-medium text-foreground">Salida Tunel Playa Grande, C7600 Mar del Plata, Provincia de Buenos Aires</p>
                <p className="mt-3 text-sm text-primary/80">Espacio moderno con exhibición y coordinación de entregas.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">Difusión inteligente</p>
              <p className="mt-3 text-base text-muted-foreground">
                Se conciertan las citas en el horario de elección de los clientes y el potencial comprador podrá observar las fotos del vehículo antes de verlo de manera personal en nuestras oficinas. Esto último brinda seguridad a las personas intervinientes, ya que mantienen en el anonimato los datos personales y a su vez se proporciona neutralidad en la operación.
              </p>
              <p className="mt-3 text-base text-muted-foreground">
                Contamos con una importante base de datos de potenciales compradores y ofrecemos asesoramiento en la entrega de la documentación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-muted/40 px-4 py-16">
        <div className="mx-auto w-full max-w-[1200px] space-y-10">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-semibold text-foreground">Miramos hacia adelante</h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground">
              Autobiliaria.com se encuentra a la vanguardia en materia de venta de autos poniendo a disposición múltiples ofertas de variadas marcas en forma continua. Incorporamos nuevos mercados y servicios para seguir creciendo con vos.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-lg"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/90">{item.subtitle}</p>
                <h3 className="mt-3 text-3xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photography + CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto w-full max-w-[1200px] rounded-[32px] border border-primary/20 bg-[linear-gradient(156deg,rgba(1,136,200,0.08)_0%,rgba(0,232,255,0.16)_100%)] p-8 shadow-sm md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Incansables promotores de la excelencia
              </p>
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Siempre un paso más cerca de lo que buscás</h2>
              <p className="text-base text-muted-foreground">
                Incorpora nuestra experiencia y red de contactos para descubrir vehículos únicos, asesoramiento a medida y procesos ágiles. Consultanos, daremos respuesta a tu requerimiento y juntos encontraremos el vehículo que a vos te interesa.
              </p>
            </div>

            <div className="grid w-full max-w-sm gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-white/90 p-5 text-center shadow-sm">
                <Camera className="mx-auto mb-3 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">Fotos profesionales</p>
                <p className="mt-2 text-xs text-muted-foreground">Mostrá tu vehículo en nuestra plataforma con material cuidado.</p>
              </div>
              <div className="rounded-3xl border border-border bg-white/90 p-5 text-center shadow-sm">
                <Globe2 className="mx-auto mb-3 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">Difusión global</p>
                <p className="mt-2 text-xs text-muted-foreground">Exponemos tu publicación en medios líderes sin costo adicional.</p>
              </div>
              <div className="rounded-3xl border border-border bg-white/90 p-5 text-center shadow-sm sm:col-span-2">
                <HeartHandshake className="mx-auto mb-3 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">Acompañamiento humano</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Sabemos que cada operación es única. Escuchamos, proponemos y resolvemos.
                </p>
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


