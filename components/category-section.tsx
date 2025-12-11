"use client"

import { Truck, Car, Bike } from "lucide-react"

export default function CategorySection() {
  const categories = [
    {
      name: "Autos",
      count: 342,
      icon: Car,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Camiones",
      count: 58,
      icon: Truck,
      color: "from-green-500 to-green-600",
    },
    {
      name: "Motos",
      count: 127,
      icon: Bike,
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <section className="py-12 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8">Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => {
            const Icon = category.icon
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.count} vehículos</p>
                  </div>
                  <Icon size={32} className="group-hover:scale-110 transition-transform" />
                </div>
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors backdrop-blur-sm mt-auto">
                  Explorar →
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
