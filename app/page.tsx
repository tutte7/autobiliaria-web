import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import HeroSection from "@/components/hero-section"
import FeaturedOffers from "@/components/featured-offers"
import OpportunitiesBanner from "@/components/opportunities-banner"
import LatestArrivals from "@/components/latest-arrivals"
import ActionCards from "@/components/action-cards"
import MiniCatalog from "@/components/mini-catalog"
import SearchByBrand from "@/components/search-by-brand"
import InsuranceBanner from "@/components/insurance-banner"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <div className="space-y-0">
        <HeroSection />
        <FeaturedOffers />
        <OpportunitiesBanner />
        {/* <LatestArrivals /> - Movido debajo de SearchByBrand */}
        <ActionCards />
        <SearchByBrand />
        
        {/* Sección de últimos ingresos conectada al Backend */}
        <LatestArrivals />

        <MiniCatalog />
        <InsuranceBanner />
      </div>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}
