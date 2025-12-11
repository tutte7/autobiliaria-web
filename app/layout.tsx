import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const square721BoldExtended = localFont({
  src: "./fonts/Square721BoldExtended.otf",
  variable: "--font-square-721",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
})

export const metadata: Metadata = {
  title: "Autobiliaria - Compra y Venta de Autos",
  description: "Autobiliaria: Compra y vende autos nuevos y usados. Financiación y consignación disponibles.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${square721BoldExtended.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
