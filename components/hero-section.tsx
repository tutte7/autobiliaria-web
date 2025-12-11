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
} from "lucide-react"
import { parametersService, type ModelParameter, type Parameter } from "@/services/parameters"
import { cn } from "@/lib/utils"

type Category = "auto" | "camioneta" | "moto" | "oportunidad"

type CategoryOption = {
  value: Category
  label: string
  helper: string
  Icon: typeof Car
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<Category>("auto")

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
    } else {
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
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight drop-shadow-md">
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
              <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-white/10 animate-fade-in-up">
                
                {/* Header Tarjeta */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Search className="text-primary w-5 h-5" />
                    Búsqueda Inteligente
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Selecciona una categoría y personaliza tu búsqueda.
                  </p>
                </div>

                <div className="p-6 sm:p-8 space-y-8 bg-white">
                  
                  {/* Categorías */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-400">
                      Categoría
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {categoryOptions.map(({ value, label, helper, Icon }) => {
                        const isSelected = selectedCategory === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedCategory(value)}
                            className={cn(
                              "relative flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all duration-200 border-2",
                              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                              isSelected
                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                                : "border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-200"
                            )}
                          >
                            <Icon size={24} className={cn(isSelected ? "text-white" : "text-gray-400")} />
                            <div className="text-center">
                              <div className="font-bold text-sm leading-tight">{label}</div>
                              <div className={cn("text-[10px] font-medium mt-0.5", isSelected ? "text-blue-100" : "text-gray-400")}>
                                {helper}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 transform" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleAdvancedSearch} className="space-y-6">
                    
                    {/* Fila 1: Marca y Modelo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Marca</label>
                        <div className="relative">
                          <select
                            value={form.marca}
                            onChange={(e) => handleInputChange("marca", e.target.value)}
                            disabled={loadingBrands}
                            className="h-14 w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 text-base text-gray-900 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-0 disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <option value="">{loadingBrands ? "Cargando..." : "Todas las marcas"}</option>
                            {brands.map((b) => (
                              <option key={b.id} value={b.id.toString()}>{b.nombre}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <ChevronRight className="h-5 w-5 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Modelo</label>
                        <div className="relative">
                          <select
                            value={form.modelo}
                            onChange={(e) => handleInputChange("modelo", e.target.value)}
                            disabled={!form.marca || loadingModels}
                            className="h-14 w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 text-base text-gray-900 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-0 disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <option value="">
                              {!form.marca ? "Primero elige marca" : loadingModels ? "Cargando..." : "Todos los modelos"}
                            </option>
                            {models.map((m) => (
                              <option key={m.id} value={m.id.toString()}>{m.nombre}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <ChevronRight className="h-5 w-5 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fila 2: Precios */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Precio Mín.</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">USD</span>
                          <input
                            type="number"
                            placeholder="0"
                            min={0}
                            value={form.precioMin}
                            onChange={(e) => handleInputChange("precioMin", e.target.value)}
                            className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-14 pr-4 text-base text-gray-900 shadow-sm transition-colors focus:border-primary focus:outline-none placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Precio Máx.</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">USD</span>
                          <input
                            type="number"
                            placeholder="Sin límite"
                            min={0}
                            value={form.precioMax}
                            onChange={(e) => handleInputChange("precioMax", e.target.value)}
                            className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-14 pr-4 text-base text-gray-900 shadow-sm transition-colors focus:border-primary focus:outline-none placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fila 3: Características (Opcional) */}
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700 ml-1">
                          ¿Buscas algo específico? <span className="text-gray-400 font-normal">(Opcional)</span>
                       </label>
                       <input
                          type="text"
                          value={form.caracteristicas}
                          onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                          placeholder='Ej: "automático", "cuero", "techo solar"...'
                          className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base text-gray-900 shadow-sm transition-colors focus:border-primary focus:outline-none placeholder:text-gray-300"
                        />
                    </div>

                    {/* Botón CTA */}
                    <button
                      type="submit"
                      className="w-full h-16 rounded-xl bg-primary text-white text-lg font-bold tracking-wide shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-3"
                    >
                      <Search size={24} strokeWidth={2.5} />
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
