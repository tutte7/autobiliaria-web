"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import { 
  MapPin, Phone, Mail, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, 
  Calendar, Gauge, Fuel, Cog, Car, CarFront, Wrench, MessageCircle, ChevronDown as ChevronDownIcon 
} from "lucide-react"
import type { ApiVehicleDetail } from "@/services/vehicles"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"

interface VehicleClientProps {
  vehicle: ApiVehicleDetail
}

export default function VehicleDetailClient({ vehicle }: VehicleClientProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "", type: "consulta" })
  const [submitted, setSubmitted] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  // Mapeo de datos para la UI
  const images = vehicle.imagenes.length > 0 
    ? vehicle.imagenes.sort((a, b) => a.orden - b.orden).map(img => img.imagen_url)
    : ["/placeholder.svg"];

  const detailedSpecs = [
    { label: "Modelo", value: vehicle.modelo_detail.nombre },
    { label: "Año", value: vehicle.anio },
    { label: "Combustible", value: vehicle.combustible_detail.nombre },
    { label: "Segmento", value: vehicle.segmento1_detail?.nombre || "-" },
    { label: "Transmisión", value: vehicle.caja_detail.nombre },
    { label: "Versión", value: vehicle.version },
    { label: "Kilómetros", value: `${vehicle.km.toLocaleString()} km` },
  ]

  const specIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Modelo: Car,
    Año: Calendar,
    Combustible: Fuel,
    Segmento: CarFront,
    Transmisión: Cog,
    Versión: Wrench,
    Kilómetros: Gauge,
  }

  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length)

  const thumbsRef = useRef<HTMLDivElement | null>(null)
  const scrollThumbs = (dir: "up" | "down") => {
    thumbsRef.current?.scrollBy({ top: dir === "up" ? -220 : 220, behavior: "smooth" })
  }

  const [thumbsAtTop, setThumbsAtTop] = useState(true)
  const [thumbsAtBottom, setThumbsAtBottom] = useState(false)
  
  const updateThumbsScroll = () => {
    const el = thumbsRef.current
    if (!el) return
    const atTop = el.scrollTop <= 0
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
    setThumbsAtTop(atTop)
    setThumbsAtBottom(atBottom)
  }

  useEffect(() => {
    updateThumbsScroll()
    const el = thumbsRef.current
    if (!el) return
    el.addEventListener("scroll", updateThumbsScroll)
    return () => el.removeEventListener("scroll", updateThumbsScroll)
  }, [])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario de contacto:", contactForm)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setContactForm({ name: "", email: "", message: "", type: "consulta" })
      setIsContactOpen(false)
    }, 3000)
  }

  // Características destacadas
  const features = [
    vehicle.condicion_detail.nombre,
    `Color ${vehicle.color}`,
    vehicle.vtv ? "VTV Vigente" : null,
    vehicle.cant_duenos === 1 ? "Primer Dueño" : `${vehicle.cant_duenos} Dueños`,
    vehicle.oportunidad ? "Oportunidad" : null,
  ].filter(Boolean) as string[];

  const priceFormatted = parseFloat(vehicle.precio).toLocaleString("es-AR", { minimumFractionDigits: 0 });
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || "5491100000000"; // Fallback
  const whatsappMessage = `Hola, me interesa el ${vehicle.titulo} que vi en la web.`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-muted/10">
      <Navbar />

      <div className="max-w-[1200px] mx-auto pt-28 pb-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Info Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Mobile (Solo visible en movil para jerarquía visual) */}
            <div className="lg:hidden space-y-2">
              <h1 className="text-2xl font-bold">{vehicle.titulo}</h1>
               <Badge variant={vehicle.disponible ? "default" : "destructive"}>
                  {vehicle.disponible ? "Disponible" : (vehicle.vendido ? "Vendido" : "Reservado")}
                </Badge>
            </div>

            {/* Galería */}
            <div className="grid gap-4 md:grid-cols-[100px_1fr] h-[400px] md:h-[500px]">
               {/* Thumbs Desktop (Vertical) */}
              <div className="hidden md:flex md:flex-col relative h-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => scrollThumbs("up")}
                  className={`absolute top-0 left-1/2 z-10 -translate-x-1/2 w-full h-8 flex items-center justify-center bg-gradient-to-b from-background/80 to-transparent ${
                    thumbsAtTop ? "opacity-0 pointer-events-none" : ""
                  }`}
                >
                  <ChevronUp size={16} />
                </button>
                <div ref={thumbsRef} onScroll={updateThumbsScroll} className="flex h-full flex-col gap-2 overflow-y-auto pr-1 scrollbar-hide py-2">
                {images.map((img, idx) => (
                  <button
                    key={`vertical-thumb-${idx}`}
                    type="button"
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all h-20 w-full flex-shrink-0 ${
                      idx === currentImageIdx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
                </div>
                <button
                  type="button"
                  onClick={() => scrollThumbs("down")}
                   className={`absolute bottom-0 left-1/2 z-10 -translate-x-1/2 w-full h-8 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent ${
                    thumbsAtBottom ? "opacity-0 pointer-events-none" : ""
                  }`}
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Main Image */}
              <div className="relative h-full w-full overflow-hidden rounded-xl border bg-background">
                <img
                  src={images[currentImageIdx]}
                  alt={vehicle.titulo}
                  className="h-full w-full object-cover"
                />
                 {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
             {/* Thumbs Mobile (Horizontal) */}
             <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
              {images.map((img, idx) => (
                <button
                  key={`mobile-thumb-${idx}`}
                  type="button"
                  onClick={() => setCurrentImageIdx(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all h-16 w-24 flex-shrink-0 ${
                    idx === currentImageIdx ? "border-primary" : "border-transparent opacity-70"
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>


            {/* Info Principal Desktop */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl font-bold tracking-tight">{vehicle.titulo}</h1>
                <Badge variant={vehicle.disponible ? "default" : "destructive"} className="text-sm px-3 py-1">
                  {vehicle.disponible ? "Disponible" : (vehicle.vendido ? "Vendido" : "Reservado")}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Ficha Técnica Grid */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Ficha Técnica</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {detailedSpecs.map((spec) => {
                  const Icon = specIcons[spec.label] || Wrench
                  return (
                    <div key={spec.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                      <Icon className="h-6 w-6 text-primary mb-2" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{spec.label}</span>
                      <span className="font-semibold text-sm md:text-base mt-1">{spec.value}</span>
                    </div>
                  )
                })}
              </div>
            </section>

             {/* Descripción */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                 <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {vehicle.comentario_carga || "Sin descripción disponible."}
                </p>
              </div>
            </section>

            {/* Características */}
            <section>
               <h2 className="text-xl font-semibold mb-4">Características</h2>
               <div className="flex flex-wrap gap-2">
                 {features.map((feature, idx) => (
                   <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm font-normal">
                     {feature}
                   </Badge>
                 ))}
               </div>
            </section>

          </div>

          {/* Columna Derecha: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              <Card className="shadow-lg border-primary/10 overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Precio Contado</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{vehicle.moneda_nombre}</span>
                    <span className="text-5xl font-extrabold tracking-tight">{priceFormatted}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <Button className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Consultar por WhatsApp
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-12 text-base">
                    Reservar Vehículo
                  </Button>

                  <div className="pt-4">
                     <Collapsible
                      open={isContactOpen}
                      onOpenChange={setIsContactOpen}
                      className="w-full space-y-2"
                    >
                      <div className="flex items-center justify-center">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                            ¿Prefieres enviarnos un email?
                            <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform duration-200 ${isContactOpen ? "rotate-180" : ""}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="space-y-4 pt-2">
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                           <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                            <input 
                              id="name" name="name" 
                              value={contactForm.name} onChange={handleFormChange}
                              required
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Tu nombre"
                            />
                           </div>
                           <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input 
                              id="email" name="email" type="email"
                              value={contactForm.email} onChange={handleFormChange}
                              required
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="tu@email.com"
                            />
                           </div>
                           <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                            <textarea 
                              id="message" name="message" 
                              value={contactForm.message} onChange={handleFormChange}
                              rows={3}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                              placeholder="¿En qué podemos ayudarte?"
                            />
                           </div>
                           <Button type="submit" className="w-full">Enviar Consulta</Button>
                        </form>
                         {submitted && (
                          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md text-center font-medium border border-green-200">
                            ¡Enviado! Te responderemos pronto.
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                </CardContent>
              </Card>

              {/* Info Vendedor Mini */}
              <div className="rounded-xl border bg-background/50 p-4 text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{vehicle.vendedor_detail.location || "Ubicación a confirmar"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{vehicle.vendedor_detail.celular}</span>
                </div>
                 <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{vehicle.vendedor_detail.email}</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
      <Footer />
      <WhatsappCTA />
    </main>
  )
}
