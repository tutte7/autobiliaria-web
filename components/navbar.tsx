"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, DollarSign, Mail, Home, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { LiveSearch } from "@/components/live-search"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 w-full transition-all duration-300">
      <div className="relative z-50 mx-auto w-full max-w-[1200px] px-4 md:px-0 pointer-events-auto">
        <div
          className={cn(
            "flex items-center justify-between gap-3 md:gap-6 rounded-full border shadow-lg ring-1 ring-black/5 px-3 py-2 md:py-2.5 transition-all duration-300",
            isScrolled
              ? "bg-white/85 border-border/60 backdrop-blur-xl"
              : "bg-white/70 border-border/40 backdrop-blur-xl"
          )}
        >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-ab.png"
            alt="Autobiliaria"
            width={140}
            height={32}
            className="h-6 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={cn(
              "transition-colors font-medium text-foreground hover:text-primary"
            )}
          >
            Inicio
          </Link>
          <Link
            href="/comprar"
            className={cn(
              "transition-colors font-medium text-foreground hover:text-primary"
            )}
          >
            Comprar
          </Link>
          <Link
            href="/vender"
            className={cn(
              "transition-colors font-medium text-foreground hover:text-primary"
            )}
          >
            Vender
          </Link>
          <Link
            href="/contacto"
            className={cn(
              "transition-colors font-medium text-foreground hover:text-primary"
            )}
          >
            Contacto
          </Link>
        </div>

        {/* Search Bar Desktop */}
        <div className="hidden md:block w-[220px] lg:w-[280px]">
          <LiveSearch 
            placeholder="Buscar vehículo, marca, modelo…"
            className={cn(
              "h-9 rounded-full border transition-all duration-200",
              "bg-white/70 border-border/50 backdrop-blur-xl shadow-sm hover:shadow-md",
              "focus-within:ring-2 focus-within:ring-primary/30"
            )}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "md:hidden rounded-full p-2 transition-colors",
            "text-foreground hover:bg-muted"
          )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="md:hidden animate-fade-in-up relative z-50">
            <div className="max-w-[1200px] mx-auto px-4 mt-3">
              <div className="rounded-[28px] md:rounded-[30px] border border-border/50 bg-white/98 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 p-5 space-y-3">
                
                {/* Search First Mobile */}
                <div className="pb-3 border-b border-border/30">
                  <LiveSearch 
                    placeholder="Buscar vehículo, marca..."
                    onSearch={() => setIsOpen(false)}
                    className="bg-muted/50 rounded-2xl border border-border/40 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                  />
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 pt-1">
                  <Link 
                    href="/" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all font-semibold px-4 py-3.5 rounded-2xl group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                      <Home size={20} />
                    </div>
                    <span className="text-[15px]">Inicio</span>
                  </Link>

                  <Link 
                    href="/comprar" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all font-semibold px-4 py-3.5 rounded-2xl group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/15 transition-colors">
                      <ShoppingBag size={20} />
                    </div>
                    <span className="text-[15px]">Comprar</span>
                  </Link>

                  <Link 
                    href="/comprar?opportunity=true" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all font-semibold px-4 py-3.5 rounded-2xl group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/15 transition-colors">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-[15px]">Oportunidades</span>
                  </Link>

                  <Link 
                    href="/vender" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all font-semibold px-4 py-3.5 rounded-2xl group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/15 transition-colors">
                      <DollarSign size={20} />
                    </div>
                    <span className="text-[15px]">Vender</span>
                  </Link>

                  <Link 
                    href="/contacto" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all font-semibold px-4 py-3.5 rounded-2xl group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/15 transition-colors">
                      <Mail size={20} />
                    </div>
                    <span className="text-[15px]">Contacto</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
