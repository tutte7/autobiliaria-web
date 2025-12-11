"use client"

import Image from "next/image"

export default function WhatsappCTA() {
  const whatsappNumber = "5492236857040"
  const message = "Hola, quiero consultar sobre tus vehículos disponibles"

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 flex items-center justify-center transition-transform duration-300 hover:scale-110"
      aria-label="Contactar por WhatsApp"
      title="WhatsApp"
    >
      <Image
        src="/whatsapp-logo.png"
        alt="WhatsApp"
        width={64}
        height={64}
        className="w-full h-full object-contain drop-shadow-lg"
        priority
      />
    </button>
  )
}
