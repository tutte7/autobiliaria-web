"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function InsuranceBanner() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="relative overflow-hidden rounded-3xl bg-[#0b182a]">
          {/* Background overlay */}
          <div className="absolute inset-0">
            <img
              src="/insurance-banner.jpg"
              alt="Asegurá tu vehículo"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b182a] via-[#10223a]/95 to-[#0b182a]/30" />
          </div>

          <div className="relative z-10 flex flex-col gap-8 p-8 text-white md:flex-row md:items-center md:justify-between md:p-12">
            <div className="space-y-5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)]">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-bold md:text-4xl">Asegurá tu Vehículo</h3>
                <p className="max-w-2xl text-white/85">
                  Trabajamos con las mejores compañías de seguros del mercado. Protegé tu inversión con coberturas completas y asesoramiento personalizado.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#00e8ff]">
                <span>• Cotización inmediata</span>
                <span>• Mejores precios</span>
                <span>• Asesoramiento 24/7</span>
              </div>
            </div>

            <div>
              <Link
                href="/seguro"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
              >
                Cotizar Seguro
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


