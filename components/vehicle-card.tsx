"use client"

import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VehicleCardProps {
  id: number
  name: string
  price: number
  currency?: string
  year: number
  km: number
  fuel: string
  transmission: string
  image: string
  brand?: string
  segment?: string
  badge?: string
  discount?: number
  prevPrice?: number
  featured?: boolean
  variant?: "default" | "gradient" | "simple"
}

export function VehicleCard({
  id,
  name,
  price,
  currency = "USD",
  year,
  km,
  fuel,
  transmission,
  image,
  brand,
  segment,
  badge,
  discount,
  prevPrice,
  featured,
  variant = "default",
}: VehicleCardProps) {
  const cardContent = (
    <>
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-[rgba(0,176,155,0.9)] px-4 py-[6px] text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
              {badge}
            </span>
          )}
          {featured && !badge && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Destacado
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-[rgba(249,77,77,0.95)] px-3 py-[5px] text-xs font-semibold text-white shadow-md">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 px-6 pb-6 pt-6">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{name}</h3>
          {brand && segment && (
            <p className="text-sm text-muted-foreground">
              {brand} • {segment}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-primary" />
            <span>{km.toLocaleString("es-AR")} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={16} className="text-primary" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-primary" />
            <span>{transmission}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-primary">
            {currency === "USD" ? "USD" : "$"} {price.toLocaleString("es-AR")}
          </div>
          {prevPrice && (
            <div className="text-sm font-semibold text-muted-foreground/70 line-through">
              {currency === "USD" ? "USD" : "$"} {prevPrice.toLocaleString("es-AR")}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="w-full rounded-full bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] text-center">
          {variant === "simple" ? "Detalles" : "Ver más"}
        </div>
      </div>
    </>
  )

  // Wrapper según variante
  if (variant === "gradient") {
    return (
      <Link href={`/vehiculo/${id}`}>
        <div className="group relative cursor-pointer rounded-[28px] bg-[linear-gradient(156deg,rgba(0,232,255,1)_0%,rgba(1,136,200,1)_100%)] p-[2px] shadow-[0_18px_40px_-20px_rgba(1,136,200,0.45)] transition-transform duration-300 hover:-translate-y-3">
          <div className="relative rounded-[26px] bg-white overflow-hidden">
            {cardContent}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/vehiculo/${id}`}>
      <div className={cn(
        "group relative overflow-hidden bg-card shadow-md transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col",
        variant === "simple"
          ? "rounded-2xl hover:shadow-xl"
          : "rounded-[26px] border border-border/60 shadow-[0_18px_32px_-24px_rgba(15,54,89,0.25)]"
      )}>
        {cardContent}
      </div>
    </Link>
  )
}
