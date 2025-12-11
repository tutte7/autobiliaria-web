"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"

export default function OpportunitiesBanner() {
  return (
    <section className="bg-background px-4 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="relative overflow-hidden rounded-3xl h-auto min-h-[260px] md:min-h-[320px]">
          {/* Background image */}
          <img
            src="/carrousel-3.jpg"
            alt="Oportunidades"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Left-to-right overlay (100% -> 0%) con color azul */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0188c8_0%,rgba(1,136,200,0.92)_55%,rgba(1,136,200,0)_85%)]" />

          <div className="relative z-10 flex h-full flex-col items-start justify-center gap-6 p-6 md:p-12">
            <div className="max-w-2xl space-y-4 text-left text-white">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-3xl font-bold md:text-4xl">Oportunidades Imperdibles</h3>
              <p className="max-w-xl text-white/90">
                Vehículos con descuentos especiales. Aprovechá estas ofertas exclusivas antes de que se terminen.
              </p>
            </div>

            <Link
              href="/comprar?opportunity=true"
              className="rounded-full border border-[#0188c8] bg-white px-6 py-3 text-sm font-semibold text-[#0188c8] transition-all hover:border-[#0188c8] hover:bg-[#0188c8] hover:text-white"
            >
              Ver Oportunidades
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


