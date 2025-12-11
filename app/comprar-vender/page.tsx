"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightCircle,
  CalendarDays,
  CheckCircle2,
  FileText,
  Gauge,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
  MessageCircle,
} from "lucide-react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const steps = [
  {
    title: "Publicá tu vehículo",
    description:
      "Te asesoramos para fijar el precio ideal según el mercado y publicamos fotos profesionales en minutos.",
    icon: FileText,
  },
  {
    title: "Coordinamos las visitas",
    description:
      "Agendamos citas seguras en nuestras oficinas, resguardando los datos de todas las partes involucradas.",
    icon: CalendarDays,
  },
  {
    title: "Cerramos la operación",
    description:
      "Acompañamos la negociación, gestionamos la documentación y aseguramos una entrega transparente.",
    icon: ShieldCheck,
  },
]

const sellerBenefits = [
  "Orientación experta en pricing y documentación",
  "Publicación destacada sin costo inicial",
  "Gestión integral de turnos y visitas",
  "Operaciones seguras y transparentes en sede",
]

const buyerBenefits = [
  "Acceso rápido a un inventario curado",
  "Revisión presencial con asesor especializado",
  "Neutralidad y seguridad durante la negociación",
  "Acompañamiento en trámites y transferencia",
]

const locations = [
  {
    name: "Sucursal Falucho 1323",
    address: "Falucho 1323, B7600 Mar del Plata, Provincia de Buenos Aires",
    city: "",
    phone: "(0223) 486-1413",
    whatsapp: "(223) 685-7040",
    altWhatsapp: "(223) 697-1299",
    hours: "Lunes a Viernes 09:00 a 18:00",
    mapLink: "https://maps.app.goo.gl/AUfoAgCiDuofJArc8",
  },
  {
    name: "Sucursal Playa Grande",
    address: "Paseo Victoria Ocampo s/n (Salida Tunel Playa Grande), C7600 Mar del Plata, Provincia de Buenos Aires",
    city: "",
    phone: "(0223) 685-7040",
    additionalPhones: ["(0223) 697-1299", "(0223) 683-6324"],
    whatsapp: "(223) 685-7040",
    altWhatsapp: "(223) 697-1299",
    hours: "Lunes a Viernes 09:00 a 19:00 · Sábados 09:00 a 13:00",
    mapLink: "https://maps.app.goo.gl/CUigXRyYAoywmWTk7",
  },
]

export default function ComprarVenderPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <div>
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-24 pb-16 text-white md:pt-28 md:pb-24">
          <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />

          <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                  Experiencia ágil y confiable
                </span>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold leading-tight md:text-5xl">Compra / Venta</h1>
                  <p className="text-base text-white/85 md:text-lg">
                    Publicá o encontrá tu próximo vehículo con un proceso transparente, acompañamiento experto y la seguridad de operar en nuestras oficinas.
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-white px-8 py-3 text-base font-semibold text-primary shadow-sm transition hover:bg-primary hover:text-white"
                  >
                    <Link href="/vender">
                      Publicar vehículo
                      <ArrowRightCircle className="size-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto rounded-full border border-white/30 bg-transparent px-8 py-3 text-base text-white hover:bg-white/10"
                  >
                    <Link href="/comprar">Ver vehículos disponibles</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <div className="space-y-4 text-sm text-white/85">
                <h2 className="text-lg font-semibold text-white">Acompañamiento personalizado</h2>
                <p>
                  Nos ocupamos de valorar tu vehículo, coordinar visitas seguras y gestionar la documentación para que la operación sea ágil y sin sobresaltos.
                </p>
                <p>
                  Mantenemos comunicación constante durante todo el proceso y resguardamos los datos de compradores y vendedores en cada instancia.
                </p>
                <div className="space-y-3">
                  {["Publicación destacada", "Turnos coordinados", "Trámites supervisados"].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                      <CheckCircle2 className="size-4 text-white/70" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Content */}
        <section className="bg-background">
          <div className="mx-auto max-w-[1100px] space-y-8 px-4 py-16 md:space-y-12 md:py-20">
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
                <p>
                  Publicar en la Web Autobiliaria.com no tiene costo alguno, el precio del vehículo es fijado por el vendedor.
                  En caso de que el mismo no tenga conocimiento de los valores del mercado es asesorado por nuestro personal especializado.
                </p>
                <p>
                  Se concretan las citas en el horario de agrado de los clientes y el comprador podrá ver las fotos del vehículo a través de la web, antes de ver personalmente el vehículo.
                  Al mostrarse los vehículos en nuestras oficinas se brinda seguridad a los clientes, ya que se mantienen en el anonimato los datos personales de los intervinientes y se brinda neutralidad en la operación.
                  Contamos con una importante base de datos de compradores potenciales y brindamos asesoramiento en la entrega de la documentación.
                </p>
                <p>
                  Autobiliaria.com está a la vanguardia en materia de venta de autos poniendo a su disposición muchas ofertas de variadas marcas en forma continua.
                  Autobiliaria.com cobra un porcentaje del 3% a cada una de las partes intervinientes al momento de la operación.
                </p>
                <p>
                  Consúltenos, encontraremos la respuesta a su requerimiento, buscaremos el vehículo que a Ud. le interesa.
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-primary/10 md:rounded-3xl">
                <Image
                  src="/carrousel-4.jpg"
                  alt="Sucursal Autobiliaria"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 440px, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-background">
          <div className="mx-auto max-w-[1100px] px-4 py-16 md:py-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl space-y-4">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                  Cómo funciona
                </span>
                <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                  Tres pasos para comprar o vender tu vehículo con confianza
                </h2>
                <p className="text-base text-muted-foreground">
                  Cada instancia fue diseñada para darte visibilidad total del proceso, soporte humano permanente y la agilidad que necesitás para concretar la operación.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:mt-12 md:gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <Card
                  key={step.title}
                  className="group relative h-full border border-border bg-card/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg md:p-8"
                >
                  <div className="absolute -right-16 top-6 size-28 rounded-full bg-secondary/20 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
                  <CardHeader className="p-0">
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <step.icon className="size-6" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-0 md:space-y-4">
                    <CardTitle className="text-lg text-foreground md:text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground md:text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-muted/40">
          <div className="mx-auto max-w-[1100px] space-y-12 px-4 py-14 md:py-20">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <Card className="border border-border bg-card/60 p-6 shadow-sm md:p-8">
                <CardHeader className="space-y-2 p-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1 text-sm font-semibold text-primary">
                    <Users className="size-4" /> Ventajas para vendedores
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 md:text-2xl">Vende mejor, sin complicaciones</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-5 md:pt-6">
                  <ul className="space-y-3 text-sm text-muted-foreground md:space-y-4 md:text-base">
                    {sellerBenefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 size-5 text-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/60 p-6 shadow-sm md:p-8">
                <CardHeader className="space-y-2 p-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1 text-sm font-semibold text-secondary">
                    <Gauge className="size-4" /> Ventajas para compradores
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 md:text-2xl">Encontrá tu próximo auto con confianza</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-5 md:pt-6">
                  <ul className="space-y-3 text-sm text-muted-foreground md:space-y-4 md:text-base">
                    {buyerBenefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 size-5 text-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-r from-secondary/15 via-white to-primary/10 px-4 py-9 shadow-sm md:px-12 md:py-12">
              <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                <div className="space-y-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                    Oportunidades en tiempo real
                  </span>
                  <h3 className="text-2xl font-semibold text-slate-900 md:text-4xl">
                    ¿Estás buscando más oportunidades?
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-lg">
                    Actualizamos el inventario a diario con autos, camionetas y motos seleccionados por nuestros especialistas.
                    Recibí alertas y encontrá antes que nadie la opción ideal para vos.
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                  <Button
                    asChild
                    className="w-full rounded-full bg-secondary px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-secondary/20 hover:bg-secondary/90 md:w-auto md:px-8"
                  >
                    <Link href="/comprar?opportunity=true">Ver oportunidades disponibles</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full rounded-full border border-primary/20 px-6 py-3 text-base text-foreground hover:bg-primary/10 md:w-auto md:px-8"
                  >
                    <Link href="#formulario">Recibir asesoramiento personalizado</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-background">
            <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-20">
            <div className="mb-12 flex flex-col gap-4 text-center">
              <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1 text-sm font-semibold text-primary">
                <Phone className="size-4" /> Atención directa
              </span>
              <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Conectá con nuestro equipo</h2>
              <p className="text-base text-muted-foreground md:text-lg">
                Coordina una visita en cualquiera de nuestras sucursales o escribinos por WhatsApp para recibir asistencia inmediata.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {locations.map((location) => {
                const sanitizedPhone = location.phone.replace(/[^0-9+]/g, "")
                const phoneDisplay = [location.phone, ...(location.additionalPhones ?? [])].join(" · ")
                return (
                  <Card key={location.name} className="border border-border bg-card/60 p-6 shadow-sm md:p-8">
                    <CardHeader className="space-y-3 p-0">
                      <CardTitle className="text-2xl font-semibold text-slate-900">{location.name}</CardTitle>
                      <CardDescription className="space-y-2 text-muted-foreground">
                        <p className="flex items-start gap-2 text-sm md:text-base">
                          <MapPin className="mt-0.5 size-5 text-primary" />
                          <span>{location.address}</span>
                        </p>
                        <p className="flex items-start gap-2 text-sm md:text-base">
                          <Phone className="mt-0.5 size-5 text-primary" />
                          <span>{phoneDisplay}</span>
                        </p>
                        <p className="flex items-start gap-2 text-sm md:text-base">
                          <MessageCircle className="mt-0.5 size-5 text-primary" />
                          <span>
                            {location.whatsapp}
                            {location.altWhatsapp ? ` · ${location.altWhatsapp}` : ""}
                          </span>
                        </p>
                        <p className="flex items-start gap-2 text-sm md:text-base">
                          <Gauge className="mt-0.5 size-5 text-primary" />
                          <span>{location.hours}</span>
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3 p-0 pt-5 md:pt-6">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-secondary/90"
                      >
                        <Link href={`tel:${sanitizedPhone}`}>
                          <Phone className="size-4" /> Llamar
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-full border border-primary/20 bg-transparent px-5 py-2 text-sm text-foreground hover:bg-primary/10"
                      >
                        <Link href={location.mapLink} target="_blank" rel="noopener noreferrer">
                          <MapPin className="size-4" /> Ver mapa
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="formulario" className="bg-muted/40">
          <div className="mx-auto max-w-[900px] px-4 py-14 md:py-20">
            <Card className="border border-border bg-card/60 p-6 shadow-sm md:p-12">
              <CardHeader className="space-y-4 p-0 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1 text-sm font-semibold text-primary">
                  <FileText className="size-4" /> Formulario de consulta
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900 md:text-4xl">
                  Contanos qué necesitás y te contactamos a la brevedad
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 md:text-base">
                  Dejanos tus datos para recibir asesoramiento personalizado sobre compra, venta o consignación de vehículos.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-6">
                <form className="grid gap-5 md:grid-cols-2 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="nombre">
                      Nombre y apellido
                    </label>
                    <Input id="nombre" placeholder="Juan Pérez" className="h-12 rounded-xl border-primary/20 bg-white text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@example.com"
                      className="h-12 rounded-xl border-primary/20 bg-white text-slate-900"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="telefono">
                      Teléfono / WhatsApp
                    </label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="(223) 456-7890"
                      className="h-12 rounded-xl border-primary/20 bg-white text-slate-900"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="interes">
                      ¿Qué servicio te interesa?
                    </label>
                    <Input
                      id="interes"
                      placeholder="Compra, venta, consignación, etc."
                      className="h-12 rounded-xl border-primary/20 bg-white text-slate-900"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="mensaje">
                      Comentarios
                    </label>
                    <Textarea
                      id="mensaje"
                      placeholder="Contanos cómo podemos ayudarte..."
                      className="min-h-[140px] rounded-xl border-primary/20 bg-white text-slate-900"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-slate-600 md:text-sm">
                      Nuestro equipo responderá dentro de las próximas 24 hs hábiles.
                    </p>
                    <Button size="lg" className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25">
                      Enviar consulta
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}

