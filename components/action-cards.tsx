"use client"

import Link from "next/link"
import { DollarSign, ShieldCheck, FileText, ArrowRight } from "lucide-react"

type ActionCard = {
  title: string
  description: string
  href: string
  image: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export default function ActionCards() {
  const cards: ActionCard[] = [
    {
      title: "Préstamos Prendarios",
      description: "Financiá tu próximo vehículo",
      href: "/prestamo-prendario",
      image: "/carrousel-1.jpg",
      icon: DollarSign,
    },
    {
      title: "Vendé tu Auto",
      description: "Tasación gratuita e inmediata",
      href: "/vender",
      image: "/carrousel-2.jpg",
      icon: ShieldCheck,
    },
    {
      title: "Consignación",
      description: "Dejanos vender tu vehículo",
      href: "/consignacion",
      image: "/carrousel-4.jpg",
      icon: FileText,
    },
  ]

  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Link
              key={idx}
              href={card.href}
              className="group relative block h-[320px] overflow-hidden rounded-3xl"
            >
              {/* Background image */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay: más opaco a la izquierda para legibilidad */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.4)_45%,rgba(0,0,0,0.2)_75%,transparent_100%)]" />

              {/* Content */}
              <div className="relative z-10 flex h-full items-center p-8">
                <div className="space-y-3 text-white">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white transition-colors group-hover:bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)]">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold drop-shadow-sm">{card.title}</h3>
                  <p className="text-sm text-white/90 drop-shadow-sm">{card.description}</p>

                  <div className="flex items-center gap-2 text-sm font-semibold text-[#00e8ff] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>Ver más</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}


