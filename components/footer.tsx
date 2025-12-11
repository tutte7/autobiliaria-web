"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, MapPin, Phone, Clock, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="text-background mt-20 bg-[linear-gradient(180deg,#0a1118,#0a121c),radial-gradient(120%_100%_at_100%_0%,rgba(0,232,255,0.12),rgba(0,232,255,0)_60%),radial-gradient(120%_100%_at_0%_100%,rgba(1,136,200,0.14),rgba(1,136,200,0)_60%)]">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-background/20">
          {/* Brand Information */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-[10px] rounded-full px-0 py-2 ring-1 ring-black/5">
              <Image
                src="/logo-autobiliaria-2.0.svg"
                alt="Autobiliaria"
                width={140}
                height={35}
                className="h-9 w-auto"
              />
              <span className="font-square-721 text-[#ffffff] text-[28px] leading-[28px]">autobiliaria</span>
            </Link>
            <p className="text-sm text-white/80">
              Tu concesionaria de confianza. Más de 20 años brindando las mejores opciones en vehículos.
            </p>
          </div>

          {/* Navegación */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-[linear-gradient(156deg,#00e8ff_0%,#0188c8_100%)]">Navegación</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/comprar" className="hover:text-primary transition-colors">
                  Comprar Vehículo
                </Link>
              </li>
              <li>
                <Link href="/vender" className="hover:text-primary transition-colors">
                  Vender Vehículo
                </Link>
              </li>
              <li>
                <Link href="/comprar?opportunity=true" className="hover:text-primary transition-colors">
                  Oportunidades
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-[linear-gradient(156deg,#00e8ff_0%,#0188c8_100%)]">Servicios</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/prestamo-prendario" className="hover:text-primary transition-colors">
                  Préstamo Prendario
                </Link>
              </li>
              <li>
                <Link href="/consignacion" className="hover:text-primary transition-colors">
                  Consignación
                </Link>
              </li>
              <li>
                <Link href="/gestoria" className="hover:text-primary transition-colors">
                  Gestoría
                </Link>
              </li>
              <li>
                <Link href="/seguro" className="hover:text-primary transition-colors">
                  Seguro
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-[linear-gradient(156deg,#00e8ff_0%,#0188c8_100%)]">Información</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/politica-de-privacidad" className="hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/comprar-vender" className="hover:text-primary transition-colors">
                  Comprar / Vender
                </Link>
              </li>
              <li>
                <Link href="/quienes-somos" className="hover:text-primary transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/mapa-del-sitio" className="hover:text-primary transition-colors">
                  Mapa del Sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Section - Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-background/20">
          {/* Sucursal Falucho 1323 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg bg-clip-text text-transparent bg-[linear-gradient(156deg,#00e8ff_0%,#0188c8_100%)]">Sucursal Falucho 1323</h4>
            <div className="space-y-3 text-sm text-white">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <span>Falucho 1323, B7600 Mar del Plata, Provincia de Buenos Aires</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Tel: (0223) 486-1413</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Whatsapp: (223) 685-7040</span>
                  <span>Whatsapp: (223) 697-1299</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Lun - Vie: 09:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sucursal Playa Grande */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg bg-clip-text text-transparent bg-[linear-gradient(156deg,#00e8ff_0%,#0188c8_100%)]">Sucursal Playa Grande</h4>
            <div className="space-y-3 text-sm text-white">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <span>Paseo Victoria Ocampo s/n (Salida Tunel Playa Grande), C7600 Mar del Plata, Provincia de Buenos Aires</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Tel: (0223) 685-7040</span>
                  <span>Tel: (0223) 697-1299</span>
                  <span>Tel: (0223) 683-6324</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Whatsapp: (223) 685-7040</span>
                  <span>Whatsapp: (223) 697-1299</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Lun - Vie: 09:00 - 19:00</span>
                  <span>Sáb: 09:00 - 13:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white">© 2025 autobiliaria. Todos los derechos reservados.</p>
          <div className="flex gap-3">
            <a
              href="https://api.whatsapp.com/send/?phone=5492236971299"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M19.05 4.95C17.1 3 14.65 2 12 2 6.48 2 2 6.48 2 12c0 2.1.55 3.95 1.7 5.7L2 22l4.4-1.15C8.1 21.45 10 22 12 22c5.52 0 10-4.48 10-10 0-2.65-1-5.1-2.95-7.05Zm-7.05 15c-1.9 0-3.6-.5-5.1-1.45l-.35-.2-2.6.7.7-2.55-.25-.4C3.35 14.1 2.9 13.05 2.9 12c0-5.05 4.05-9.1 9.1-9.1 2.45 0 4.75.95 6.5 2.7 1.75 1.75 2.7 4.05 2.7 6.5 0 5.05-4.05 9.1-9.1 9.1Zm5.1-6.85c-.3-.15-1.75-.85-2.02-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.95 1.15-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.5-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5-.17-.02-.38-.02-.58-.02-.2 0-.52.07-.8.38-.27.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/autobiliariacom"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Facebook"
              title="Facebook"
            >
              <Facebook size={18} className="text-white" />
            </a>
            <a
              href="https://www.instagram.com/autobiliaria/"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Instagram"
              title="Instagram"
            >
              <Instagram size={18} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
