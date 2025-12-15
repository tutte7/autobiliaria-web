"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import { 
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, 
  Calendar, Gauge, Fuel, CarFront, Cog, Wrench, Car
} from "lucide-react"
import type { ApiVehicleDetail } from "@/services/vehicles"

import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VehicleContactForm } from "@/components/vehicle-contact-form"

interface VehicleClientProps {
  vehicle: ApiVehicleDetail
}

export default function VehicleDetailClient({ vehicle }: VehicleClientProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

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

  // Características destacadas
  const features = [
    vehicle.condicion_detail.nombre,
    `Color ${vehicle.color}`,
    vehicle.vtv ? "VTV Vigente" : null,
    vehicle.cant_duenos === 1 ? "Primer Dueño" : `${vehicle.cant_duenos} Dueños`,
    vehicle.oportunidad ? "Oportunidad" : null,
  ].filter(Boolean) as string[];

  const priceFormatted = parseFloat(vehicle.precio).toLocaleString("es-AR", { minimumFractionDigits: 0 });
  const currencyName = vehicle.moneda_detail?.nombre || vehicle.moneda_nombre || "$";

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
              
              <Card className="shadow-lg border-primary/10 overflow-hidden py-0">
                <div className="h-2 bg-primary w-full" />
                <CardHeader className="pb-4">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Precio Contado</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{currencyName}</span>
                    <span className="text-5xl font-extrabold tracking-tight">{priceFormatted}</span>
                  </div>
                </CardHeader>
                
                {/* Formulario de Contacto (Tabs) */}
                <div className="px-1 pb-1">
                  <VehicleContactForm vehicleTitle={vehicle.titulo} />
                </div>
              </Card>

              {/* Se eliminó la card de ubicación y contacto como se solicitó */}

            </div>
          </div>
          
        </div>
      </div>
      <Footer />
      <WhatsappCTA />
    </main>
  )
}
