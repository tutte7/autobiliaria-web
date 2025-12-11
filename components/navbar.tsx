"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Menu, X, ShoppingBag, DollarSign, Mail, Home, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set("search", searchQuery.trim().toLowerCase())
      router.push(`/comprar?${params.toString()}`)
      setSearchQuery("")
    }
  }

  const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (mobileSearchQuery.trim()) {
      const params = new URLSearchParams()
      params.set("search", mobileSearchQuery.trim().toLowerCase())
      router.push(`/comprar?${params.toString()}`)
      setMobileSearchQuery("")
      setIsOpen(false)
    }
  }

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
        <Link href="/" className="flex items-center gap-[10px]">
          <Image
            src="/logo-autobiliaria-2.0.svg"
            alt="Autobiliaria"
            width={140}
            height={35}
            className="h-9 w-auto"
            priority
          />
          <span className="font-square-721 text-[#2d2a2a] text-[28px] leading-[28px]">autobiliaria</span>
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

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className={cn(
            "hidden md:flex items-center gap-2 h-9 w-[220px] lg:w-[280px] rounded-full border transition-all duration-200",
            "bg-white/70 border-border/50 backdrop-blur-xl shadow-sm hover:shadow-md",
            "focus-within:ring-2 focus-within:ring-primary/30"
          )}
          role="search"
        >
          <div className="pl-3 text-muted-foreground">
            <Search size={16} />
          </div>
          <input
            type="search"
            placeholder="Buscar vehículo, marca, modelo…"
            aria-label="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
          />
        </form>

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
                
                {/* Search First */}
                <div className="pb-3 border-b border-border/30">
                  <form onSubmit={handleMobileSearch} className="flex items-center gap-3 bg-muted/50 rounded-2xl border border-border/40 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Search size={20} className="text-primary flex-shrink-0" />
                    <input
                      type="search"
                      placeholder="Buscar vehículo, marca..."
                      aria-label="Buscar"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground/70 text-foreground font-medium"
                    />
                  </form>
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
