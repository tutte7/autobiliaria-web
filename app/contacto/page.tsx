"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"

interface ContactFormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const INITIAL_FORM: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

export default function ContactoPage() {
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleChange = (key: keyof ContactFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFeedback("¡Gracias! Tu mensaje fue enviado correctamente.")
      setFormState(INITIAL_FORM)
      setTimeout(() => setFeedback(null), 4000)
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-[1100px] px-4 text-center space-y-4">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold tracking-wide uppercase">
            Estamos para ayudarte
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">Contactanos</h1>
          <p className="mx-auto max-w-3xl text-base md:text-lg text-white/80">
            Comunicate con nosotros para cualquier consulta sobre vehículos, financiación o servicios. Nuestro equipo de especialistas está listo para responderte.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-14">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 lg:flex-row">
          {/* Form */}
          <div className="flex-1 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Envíanos un mensaje</h2>
              <p className="text-sm text-muted-foreground">Te responderemos a la brevedad.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nombre Completo *</label>
                  <input
                    required
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email *</label>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="juan@ejemplo.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Teléfono *</label>
                  <input
                    required
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+54 11 1234 5678"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Asunto *</label>
                  <input
                    required
                    type="text"
                    value={formState.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="Consulta sobre financiación"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mensaje *</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Escribí tu consulta aquí..."
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
              >
                <Send size={16} />
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </button>

              {feedback && <p className="text-center text-sm font-semibold text-primary">{feedback}</p>}
            </form>
          </div>

          {/* Sidebar Cards */}
          <div className="flex w-full flex-col gap-6 lg:w-[360px]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Contacto Rápido</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Teléfono</p>
                    <a href="tel:+542234861413" className="text-primary hover:underline">(0223) 486-1413</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a href="mailto:info@autobiliaria.com" className="text-primary hover:underline">info@autobiliaria.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Dirección</p>
                    <span>Falucho 1323, B7600 Mar del Plata, Provincia de Buenos Aires</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Horarios</p>
                    <span>Lunes a Viernes 09:00 a 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/30 bg-[linear-gradient(156deg,rgba(1,136,200,0.12)_0%,rgba(0,232,255,0.18)_100%)] p-6 shadow-sm">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">¿Necesitás ayuda inmediata?</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestro equipo está disponible para atenderte por WhatsApp de manera instantánea.
                </p>
                <Link
                  href="https://wa.me/5492236857040"
                  target="_blank"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1ebe57]"
                >
                  <MessageCircle size={18} /> Chatear por WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-[1100px] space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Nuestras Sucursales</h2>
            <p className="text-muted-foreground">Visitanos en cualquiera de nuestras ubicaciones principales.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Sucursal Falucho 1323</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="text-lg font-semibold text-foreground">Falucho 1323, B7600 Mar del Plata, Provincia de Buenos Aires</p>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <div className="flex flex-col">
                      <a href="tel:+542234861413" className="text-primary hover:underline">(0223) 486-1413</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} />
                    <span className="text-primary">
                      (223) 685-7040 · (223) 697-1299
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <a href="mailto:info@autobiliaria.com" className="text-primary hover:underline">info@autobiliaria.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Lunes a Viernes 09:00 a 18:00</span>
                  </div>
                </div>
                <Link
                  href="https://maps.app.goo.gl/AUfoAgCiDuofJArc8"
                  target="_blank"
                  className="inline-flex w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Ver en mapa
                </Link>
              </div>
              <div className="h-64 w-full">
                <iframe
                  title="Mapa Sucursal Falucho 1323"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.1234567890!2d-57.5555555!3d-38.0000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDAwJzAwLjAiUyA1N8KwMzMnMjAuMCJX!5e0!3m2!1ses-419!2sar!4v1730832843005!5m2!1ses-419!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Sucursal Playa Grande</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="text-lg font-semibold text-foreground">Paseo Victoria Ocampo s/n (Salida Tunel Playa Grande), C7600 Mar del Plata, Provincia de Buenos Aires</p>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <div className="flex flex-col">
                      <a href="tel:+542236857040" className="text-primary hover:underline">(0223) 685-7040</a>
                      <a href="tel:+542236971299" className="text-primary hover:underline">(0223) 697-1299</a>
                      <a href="tel:+542236836324" className="text-primary hover:underline">(0223) 683-6324</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} />
                    <span className="text-primary">(223) 685-7040 · (223) 697-1299</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <a href="mailto:info@autobiliaria.com" className="text-primary hover:underline">info@autobiliaria.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Lunes a Viernes 09:00 a 19:00 / Sábados 09:00 a 13:00</span>
                  </div>
                </div>
                <Link
                  href="https://maps.app.goo.gl/CUigXRyYAoywmWTk7"
                  target="_blank"
                  className="inline-flex w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Ver en mapa
                </Link>
              </div>
              <div className="h-64 w-full">
                <iframe
                  title="Mapa Sucursal Playa Grande"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.7599840821645!2d-57.53367000000001!3d-38.0293746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dd3612a1c8a5%3A0x890e08f1ad3618a0!2sAutobiliaria%20Playa%20Grande!5e0!3m2!1ses-419!2sar!4v1765458380087!5m2!1ses-419!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}
