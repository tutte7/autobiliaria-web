"use client"

import { ArrowRight, Zap, DollarSign, FileText } from "lucide-react"

export default function BannerSection() {
  const banners = [
    {
      title: "Oportunidades",
      description: "Encuentra ofertas increíbles con descuentos especiales",
      icon: Zap,
      color: "from-yellow-400 to-yellow-600",
      link: "/comprar?opportunity=true",
    },
    {
      title: "Préstamo Prendario",
      description: "Financiación rápida y accesible para tu vehículo",
      icon: DollarSign,
      color: "from-green-400 to-green-600",
      link: "/prestamo-prendario",
    },
    {
      title: "Consignación",
      description: "Vende tu auto sin preocupaciones con nosotros",
      icon: FileText,
      color: "from-purple-400 to-purple-600",
      link: "/consignacion",
    },
  ]

  return (
    <section className="py-12 px-4 space-y-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {banners.map((banner, idx) => {
          const Icon = banner.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-r ${banner.color} rounded-2xl p-8 md:p-12 text-white flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className="flex items-center gap-6">
                <Icon size={48} className="group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">{banner.title}</h3>
                  <p className="text-white/80 text-sm md:text-base mt-1">{banner.description}</p>
                </div>
              </div>
              <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform hidden md:block" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
