import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"
import { CheckCircle2, Home, Car } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VenderExitoPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
                <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
                <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />
                <div className="mx-auto max-w-3xl px-4 space-y-3 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">¡Solicitud Enviada!</h1>
                    <p className="text-lg opacity-90">Tu vehículo está en camino a ser evaluado</p>
                </div>
            </section>

            {/* Success Content */}
            <section className="py-16 md:py-24 px-4">
                <div className="mx-auto max-w-xl text-center space-y-8">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                            <div className="relative bg-green-500 rounded-full p-6">
                                <CheckCircle2 className="h-16 w-16 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            Recibimos tu solicitud
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Un asesor evaluará tu vehículo y te contactará pronto para coordinar los siguientes pasos.
                        </p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-card border border-border/60 rounded-2xl p-6 text-left space-y-4">
                        <h3 className="font-semibold text-foreground">¿Qué sigue?</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                                <span>Nuestro equipo revisará la información y las fotos que enviaste.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                                <span>Te contactaremos por teléfono o email en las próximas 24-48 horas hábiles.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                                <span>Coordinaremos una inspección del vehículo si es necesario.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Volver al Inicio
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="gap-2">
                            <Link href="/comprar">
                                <Car className="h-4 w-4" />
                                Ver Vehículos
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsappCTA />
        </main>
    )
}
