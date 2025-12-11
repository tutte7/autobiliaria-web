"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bike, Car, ChevronLeft, ChevronRight, ChevronDown, Search, Sparkles, Truck, type LucideIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { parametersService, Parameter } from "@/services/parameters"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type QuickSearchOption = {
  label: string
  description: string
  value: string
  icon: LucideIcon
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [advancedSearch, setAdvancedSearch] = useState({
    marca: "",
    modelo: "",
    caracteristicas: "",
    precioMin: "",
    precioMax: "",
  })
  const [mobileAdvancedOpen, setMobileAdvancedOpen] = useState(false)
  
  // Estado para marcas
  const [brands, setBrands] = useState<Parameter[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [openBrand, setOpenBrand] = useState(false)
  const [openMobileBrand, setOpenMobileBrand] = useState(false)

  const router = useRouter()

  const backgroundSlides = [
    { image: "/carrousel-1.jpg" },
    { image: "/carrousel-2.jpg" },
    { image: "/carrousel-3.jpg" },
    { image: "/carrousel-4.jpg" },
  ]

  const quickSearchOptions: QuickSearchOption[] = [
    {
      label: "Autos",
      description: "Sedanes y hatchbacks",
      value: "auto",
      icon: Car,
    },
    {
      label: "Camionetas",
      description: "Pickups y SUVs",
      value: "camioneta",
      icon: Truck,
    },
    {
      label: "Motos",
      description: "Urbanas y sport",
      value: "moto",
      icon: Bike,
    },
    {
      label: "Oportunidades",
      description: "Unidades destacadas",
      value: "oportunidad",
      icon: Sparkles,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length)
    }, 5000)
    
    // Cargar marcas
    const fetchBrands = async () => {
      try {
        const data = await parametersService.getBrands()
        setBrands(data)
      } catch (error) {
        console.error("Error al cargar marcas en Hero:", error)
      } finally {
        setLoadingBrands(false)
      }
    }
    fetchBrands()

    return () => clearInterval(timer)
  }, [backgroundSlides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + backgroundSlides.length) % backgroundSlides.length)

  const handleQuickSearch = (tipo: string) => {
    if (tipo === "oportunidad") {
      router.push("/comprar?opportunity=true")
    } else {
      router.push(`/comprar?tipo=${tipo}`)
    }
  }

  const handleAdvancedSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()

    const marca = advancedSearch.marca.trim().toLowerCase()
    const modelo = advancedSearch.modelo.trim().toLowerCase()
    const caracteristicas = advancedSearch.caracteristicas.trim().toLowerCase()
    const precioMin = advancedSearch.precioMin.trim()
    const precioMax = advancedSearch.precioMax.trim()

    if (marca) params.set("marca", marca)
    if (modelo) params.set("modelo", modelo)
    if (caracteristicas) params.set("caracteristicas", caracteristicas)
    if (precioMin) params.set("precioMin", precioMin)
    if (precioMax) params.set("precioMax", precioMax)

    const query = params.toString()
    router.push(`/comprar${query ? `?${query}` : ""}`)
  }

  const handleInputChange = (key: keyof typeof advancedSearch, value: string) => {
    setAdvancedSearch((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        {backgroundSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center px-4 z-10 pt-20 pb-10">
        <div className="w-full max-w-[1000px] mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header de la Tarjeta */}
          <div className="bg-gray-50/80 p-6 md:p-8 text-center border-b border-border/40">
            <h1 className="text-3xl md:text-5xl font-bold font-sans text-primary mb-3 leading-tight">
              Encuentra tu Auto Perfecto
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
              Simplicidad y confianza en cada paso.
            </p>
          </div>

          <div className="p-5 md:p-8 space-y-6 max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
            <div className="grid gap-8 md:grid-cols-[1fr,1.2fr]">
              {/* Columna Izquierda: Selección Rápida */}
              <div className="space-y-4">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>
                    ¿Qué estás buscando?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Selecciona una categoría para ver todo.
                  </p>
                </div>
                
                {/* Mobile: grid 2x2 */}
                <div className="grid grid-cols-2 gap-3 md:hidden">
                  {quickSearchOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleQuickSearch(option.value)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-transparent bg-gray-50 px-3 py-4 text-center text-sm font-semibold text-foreground shadow-sm active:scale-[0.98] transition hover:border-primary/20 hover:bg-white"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-primary">
                          <Icon size={20} />
                        </div>
                        <span className="leading-tight">{option.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Desktop: Grid 4 columnas para ser minimalista */}
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {quickSearchOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleQuickSearch(option.value)}
                        className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-white p-3 transition-all hover:border-primary hover:shadow-md hover:bg-primary/5 hover:-translate-y-0.5"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-primary transition-colors group-hover:bg-white group-hover:shadow-sm">
                          <Icon size={20} />
                        </div>
                        <span className="font-semibold text-foreground text-xs">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Columna Derecha: Búsqueda Específica */}
              <div className="space-y-4">
                <div className="space-y-2 text-center md:text-left">
                   <h3 className="text-lg font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>
                    ¿Tenés algo específico en mente?
                  </h3>
                  <p className="text-sm text-muted-foreground hidden md:block">
                    Usa nuestros filtros para encontrar exactamente lo que querés.
                  </p>
                   <p className="text-sm text-muted-foreground md:hidden">
                    Filtra por marca, modelo y precio.
                  </p>
                </div>

                {/* Desktop form */}
                <form onSubmit={handleAdvancedSearch} className="hidden md:block space-y-3 bg-gray-50/50 p-3 rounded-2xl border border-border/30">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                        Marca
                      </label>
                      <Popover open={openBrand} onOpenChange={setOpenBrand}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBrand}
                            className="w-full justify-between rounded-xl border-border/60 bg-white px-3 py-2.5 h-[42px] text-sm font-normal text-muted-foreground hover:bg-white hover:text-foreground"
                          >
                            {loadingBrands ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" /> Cargando...
                              </span>
                            ) : advancedSearch.marca ? (
                              brands.find((b) => b.id.toString() === advancedSearch.marca)?.nombre || "Marca"
                            ) : (
                              "Todas las marcas"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar..." />
                            <CommandList>
                              <CommandEmpty>No encontrada.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="all_brands_option"
                                  onSelect={() => {
                                    handleInputChange("marca", "")
                                    setOpenBrand(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      advancedSearch.marca === "" ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  Todas las marcas
                                </CommandItem>
                                {brands.map((brand) => (
                                  <CommandItem
                                    key={brand.id}
                                    value={brand.nombre}
                                    onSelect={() => {
                                      handleInputChange("marca", brand.id.toString())
                                      setOpenBrand(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        advancedSearch.marca === brand.id.toString() ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {brand.nombre}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                        Modelo
                      </label>
                      <input
                        type="text"
                        value={advancedSearch.modelo}
                        onChange={(event) => handleInputChange("modelo", event.target.value)}
                        placeholder="Ej: Corolla"
                        className="w-full rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                        Características
                      </label>
                      <input
                        type="text"
                        value={advancedSearch.caracteristicas}
                        onChange={(event) => handleInputChange("caracteristicas", event.target.value)}
                        placeholder="Ej: automático, cuero"
                        className="w-full rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr,auto] gap-3 items-end">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                            Precio mín.
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={advancedSearch.precioMin}
                            onChange={(event) => handleInputChange("precioMin", event.target.value)}
                            placeholder="USD 0"
                            className="w-full rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        </div>
                        <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                            Precio máx.
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={advancedSearch.precioMax}
                            onChange={(event) => handleInputChange("precioMax", event.target.value)}
                            placeholder="USD Sin límite"
                            className="w-full rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        </div>
                    </div>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 h-[42px]"
                    >
                      <Search size={18} />
                      BUSCAR
                    </button>
                  </div>
                </form>

                {/* Mobile: acordeón simplificado */}
                <div className="md:hidden space-y-3">
                  <button
                    type="button"
                    onClick={() => setMobileAdvancedOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-primary/10 bg-primary/5 px-4 py-3 text-sm font-bold text-primary active:scale-[0.99] transition"
                  >
                    <span>O filtrá por detalles (Marca, precio...)</span>
                    <ChevronDown
                      size={20}
                      className={cn(
                        "transition-transform",
                        mobileAdvancedOpen ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>

                  {mobileAdvancedOpen && (
                    <div className="rounded-2xl border border-border/60 bg-gray-50 p-4 shadow-inner space-y-3 animate-in slide-in-from-top-2">
                      <form onSubmit={handleAdvancedSearch} className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase text-muted-foreground">Marca</label>
                            <Popover open={openMobileBrand} onOpenChange={setOpenMobileBrand}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openMobileBrand}
                                  className="w-full justify-between rounded-lg border-gray-200 py-2.5 h-auto text-sm font-normal bg-white"
                                >
                                  {loadingBrands ? (
                                    <span className="flex items-center gap-2">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    </span>
                                  ) : advancedSearch.marca ? (
                                    brands.find((b) => b.id.toString() === advancedSearch.marca)?.nombre || "Marca"
                                  ) : (
                                    "Todas"
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[280px] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Buscar marca..." />
                                  <CommandList>
                                    <CommandEmpty>No encontrada.</CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        value="all_brands_mobile"
                                        onSelect={() => {
                                          handleInputChange("marca", "")
                                          setOpenMobileBrand(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            advancedSearch.marca === "" ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        Todas
                                      </CommandItem>
                                      {brands.map((brand) => (
                                        <CommandItem
                                          key={brand.id}
                                          value={brand.nombre}
                                          onSelect={() => {
                                            handleInputChange("marca", brand.id.toString())
                                            setOpenMobileBrand(false)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              advancedSearch.marca === brand.id.toString() ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {brand.nombre}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          {/* Inputs simplificados para mobile */}
                          <input
                             type="text"
                             value={advancedSearch.modelo}
                             onChange={(event) => handleInputChange("modelo", event.target.value)}
                             placeholder="Modelo (ej: Corolla)"
                             className="w-full rounded-lg border-gray-200 py-2.5 text-sm"
                          />
                        </div>

                         <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={advancedSearch.precioMin}
                            onChange={(event) => handleInputChange("precioMin", event.target.value)}
                            placeholder="Min USD"
                            className="w-full rounded-lg border-gray-200 py-2.5 text-sm"
                          />
                           <input
                            type="number"
                            value={advancedSearch.precioMax}
                            onChange={(event) => handleInputChange("precioMax", event.target.value)}
                            placeholder="Max USD"
                            className="w-full rounded-lg border-gray-200 py-2.5 text-sm"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-md"
                        >
                          Ver Resultados
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm hidden md:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {backgroundSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentSlide ? "bg-white w-8" : "bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  )
}
