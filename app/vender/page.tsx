import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import SellVehicleForm from "@/components/sell-vehicle-form"

export default function VenderPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-3xl px-4 space-y-3 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Publica tu Vehículo</h1>
          <p className="text-lg opacity-90">Vende tu auto de forma rápida y segura</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <SellVehicleForm />
        </div>
      </section>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}
