"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bike,
  Car,
  ChevronRight,
  Search,
  Sparkles,
  Truck,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { parametersService, type ModelParameter, type Parameter } from "@/services/parameters"
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

type Category = "auto" | "camioneta" | "moto" | "oportunidad" | null

type CategoryOption = {
  value: Category
  label: string
  helper: string
  Icon: typeof Car
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<Category>(null)

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    caracteristicas: "",
    precioMin: "",
    precioMax: "",
  })

  // Datos dinámicos (marca / modelo)
  const [brands, setBrands] = useState<Parameter[]>([])
  const [models, setModels] = useState<ModelParameter[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  
  // Popover states
  const [openBrand, setOpenBrand] = useState(false)
  const [openModel, setOpenModel] = useState(false)

  const router = useRouter()

  const backgroundSlides = useMemo(
    () => ["/carrousel-1.jpg", "/carrousel-2.jpg", "/carrousel-3.jpg", "/carrousel-4.jpg"],
    [],
  )

  const categoryOptions: CategoryOption[] = useMemo(
    () => [
    {
      label: "Autos",
      helper: "Sedanes/Hatch",
      value: "auto",
      Icon: Car,
    },
    {
      label: "Camionetas",
      helper: "Pickups/SUVs",
      value: "camioneta",
      Icon: Truck,
    },
    {
      label: "Motos",
      helper: "Urbanas/Sport",
      value: "moto",
      Icon: Bike,
    },
    {
      label: "Oportunidades",
      helper: "Destacados",
      value: "oportunidad",
      Icon: Sparkles,
    },
  ],
    [],
  )

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

    let timer: number | undefined
    if (!reduceMotion) {
      timer = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length)
      }, 10000) // Cambio a 10 segundos (más lento)
    }

    // Cargar marcas (una vez)
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

    return () => {
      if (timer) window.clearInterval(timer)
    }
  }, [backgroundSlides.length])

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    const fetchModels = async () => {
      if (!form.marca) {
        setModels([])
        return
      }

      setLoadingModels(true)
      try {
        const data = await parametersService.getModels(Number(form.marca))
        setModels(data)
      } catch (error) {
        console.error("Error al cargar modelos en Hero:", error)
        setModels([])
      } finally {
        setLoadingModels(false)
      }
    }

    // Al cambiar marca, invalidamos el modelo seleccionado
    setForm((prev) => ({ ...prev, modelo: "" }))
    fetchModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.marca])

  const handleAdvancedSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()

    const marca = form.marca.trim()
    const modelo = form.modelo.trim()
    const caracteristicas = form.caracteristicas.trim().toLowerCase()
    const precioMin = form.precioMin.trim()
    const precioMax = form.precioMax.trim()

    if (selectedCategory === "oportunidad") {
      params.set("opportunity", "true")
    } else if (selectedCategory) {
      params.set("tipo", selectedCategory)
    }

    if (marca) params.set("marca", marca)
    if (modelo) params.set("modelo", modelo)
    if (caracteristicas) params.set("search", caracteristicas)
    if (precioMin) params.set("precio_min", precioMin)
    if (precioMax) params.set("precio_max", precioMax)

    const query = params.toString()
    router.push(`/comprar${query ? `?${query}` : ""}`)
  }

  const handleInputChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {backgroundSlides.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Overlay oscuro mejorado para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-[100svh] flex items-center pt-24 pb-12">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            
            {/* Texto Hero (Izquierda) */}
            <div className="lg:col-span-5 text-white space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-md">
                  Encuentra tu <br />
                  <span className="text-primary-foreground text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Auto Perfecto
                  </span>
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium drop-shadow-sm">
                  Simplicidad, confianza y la mejor financiación en cada paso del camino.
                </p>
              </div>

              <div className="hidden lg:flex flex-col gap-3 pt-2 items-start">
                {[
                  "Filtros claros, resultados rápidos",
                  "Controles grandes y fáciles de usar",
                  "Diseño pensado para vos"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 shrink-0">
                      <Sparkles size={12} className="fill-current" />
                    </div>
                    <span className="text-base font-medium text-left">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta de Búsqueda (Derecha) */}
            <div className="lg:col-span-7 w-full">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-white/10 via-white/5 to-primary/5 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 animate-fade-in-up">

                {/* Header Tarjeta */}
                <div className="px-5 py-3 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                  <h2 className="text-base font-semibold text-white/90 flex items-center gap-2">
                    <Search className="text-primary w-4 h-4" />
                    Búsqueda Inteligente
                  </h2>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  
                  {/* Categorías */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                      Categoría
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {categoryOptions.map(({ value, label, Icon }) => {
                        const isSelected = selectedCategory === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedCategory(value)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 px-1 transition-all duration-200 border backdrop-blur-sm",
                              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-transparent",
                              isSelected
                                ? "border-primary/50 bg-primary/20 text-white shadow-lg shadow-primary/20"
                                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-primary/30 hover:text-white/80"
                            )}
                          >
                            <Icon size={20} className={cn(isSelected ? "text-primary" : "text-white/50")} />
                            <span className="font-medium text-xs leading-tight">{label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleAdvancedSearch} className="space-y-4">

                    {/* Fila 1: Marca y Modelo */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 ml-1">Marca</label>
                        <Popover open={openBrand} onOpenChange={setOpenBrand}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBrand}
                              disabled={loadingBrands}
                              className="w-full justify-between h-10 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 text-sm font-normal text-white hover:bg-white/15 hover:border-white/25 transition-all disabled:opacity-50"
                            >
                              {loadingBrands ? (
                                <span className="text-white/40">Cargando...</span>
                              ) : form.marca ? (
                                <span className="truncate text-white">{brands.find((b) => b.id.toString() === form.marca)?.nombre || "Marca"}</span>
                              ) : (
                                <span className="text-white/40">Todas</span>
                              )}
                              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 text-white/40" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1 rounded-xl border border-white/20 shadow-2xl bg-gray-900/95 backdrop-blur-xl" align="start">
                            <Command className="rounded-lg bg-transparent">
                              <CommandInput placeholder="Buscar marca..." className="h-9 text-sm border-none focus:ring-0 text-white placeholder:text-white/40" />
                              <CommandList className="max-h-[240px] p-1">
                                <CommandEmpty className="py-3 text-sm text-white/50">No se encontró.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value="all_brands_option"
                                    onSelect={() => {
                                      handleInputChange("marca", "")
                                      setOpenBrand(false)
                                    }}
                                    className="rounded-lg px-2 py-2 text-sm cursor-pointer text-white/80 hover:bg-white/10 aria-selected:bg-white/15"
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", form.marca === "" ? "text-primary opacity-100" : "opacity-0")} />
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
                                      className="rounded-lg px-2 py-2 text-sm cursor-pointer text-white/80 hover:bg-white/10 aria-selected:bg-white/15"
                                    >
                                      <Check className={cn("mr-2 h-4 w-4", form.marca === brand.id.toString() ? "text-primary opacity-100" : "opacity-0")} />
                                      {brand.nombre}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 ml-1">Modelo</label>
                        <Popover open={openModel} onOpenChange={setOpenModel}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openModel}
                              disabled={!form.marca || loadingModels}
                              className="w-full justify-between h-10 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 text-sm font-normal text-white hover:bg-white/15 hover:border-white/25 transition-all disabled:opacity-50"
                            >
                              {loadingModels ? (
                                <span className="text-white/40">Cargando...</span>
                              ) : form.modelo ? (
                                <span className="truncate text-white">{models.find((m) => m.id.toString() === form.modelo)?.nombre || "Modelo"}</span>
                              ) : (
                                <span className="text-white/40">{!form.marca ? "Elegí marca" : "Todos"}</span>
                              )}
                              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 text-white/40" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1 rounded-xl border border-white/20 shadow-2xl bg-gray-900/95 backdrop-blur-xl" align="start">
                            <Command className="rounded-lg bg-transparent">
                              <CommandInput placeholder="Buscar modelo..." className="h-9 text-sm border-none focus:ring-0 text-white placeholder:text-white/40" />
                              <CommandList className="max-h-[240px] p-1">
                                <CommandEmpty className="py-3 text-sm text-white/50">No se encontró.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value="all_models_option"
                                    onSelect={() => {
                                      handleInputChange("modelo", "")
                                      setOpenModel(false)
                                    }}
                                    className="rounded-lg px-2 py-2 text-sm cursor-pointer text-white/80 hover:bg-white/10 aria-selected:bg-white/15"
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", form.modelo === "" ? "text-primary opacity-100" : "opacity-0")} />
                                    Todos los modelos
                                  </CommandItem>
                                  {models.map((model) => (
                                    <CommandItem
                                      key={model.id}
                                      value={model.nombre}
                                      onSelect={() => {
                                        handleInputChange("modelo", model.id.toString())
                                        setOpenModel(false)
                                      }}
                                      className="rounded-lg px-2 py-2 text-sm cursor-pointer text-white/80 hover:bg-white/10 aria-selected:bg-white/15"
                                    >
                                      <Check className={cn("mr-2 h-4 w-4", form.modelo === model.id.toString() ? "text-primary opacity-100" : "opacity-0")} />
                                      {model.nombre}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Fila 2: Precios y Características */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 ml-1">Precio Mín.</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-medium">USD</span>
                          <input
                            type="number"
                            placeholder="0"
                            min={0}
                            value={form.precioMin}
                            onChange={(e) => handleInputChange("precioMin", e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm pl-11 pr-3 text-sm text-white transition-colors focus:border-white/30 focus:bg-white/15 focus:outline-none placeholder:text-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 ml-1">Precio Máx.</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-medium">USD</span>
                          <input
                            type="number"
                            placeholder="Sin límite"
                            min={0}
                            value={form.precioMax}
                            onChange={(e) => handleInputChange("precioMax", e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm pl-11 pr-3 text-sm text-white transition-colors focus:border-white/30 focus:bg-white/15 focus:outline-none placeholder:text-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-medium text-white/50 ml-1">Búsqueda</label>
                        <input
                          type="text"
                          value={form.caracteristicas}
                          onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                          placeholder="automático, cuero..."
                          className="h-10 w-full rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 text-sm text-white transition-colors focus:border-white/30 focus:bg-white/15 focus:outline-none placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* Botón CTA */}
                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Search size={18} strokeWidth={2.5} />
                      VER VEHÍCULOS
                    </button>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
