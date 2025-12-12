"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingresa un email válido" }),
  phone: z.string().min(6, { message: "Ingresa un teléfono válido" }),
  message: z.string().optional(),
  type: z.enum(["consultation", "reservation"]),
})

interface VehicleContactFormProps {
  vehicleTitle: string
}

export function VehicleContactForm({ vehicleTitle }: VehicleContactFormProps) {
  const [activeTab, setActiveTab] = useState<"consultation" | "reservation">("consultation")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      type: "consultation",
    },
  })

  // Actualizar el tipo cuando cambia el tab
  const handleTabChange = (value: string) => {
    const type = value === "consultar" ? "consultation" : "reservation"
    setActiveTab(type)
    form.setValue("type", type)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    // Simulación de envío a API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log("Formulario enviado:", values)
      
      toast({
        title: values.type === "consultation" ? "Consulta enviada" : "Solicitud de reserva enviada",
        description: "Nos pondremos en contacto contigo a la brevedad.",
      })
      
      form.reset({
        name: "",
        email: "",
        phone: "",
        message: "",
        type: activeTab,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el formulario. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <CardContent className="p-0 sm:p-6">
        <Tabs defaultValue="consultar" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="consultar">Consultar</TabsTrigger>
            <TabsTrigger value="reservar">Reservar</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 11 1234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={
                          activeTab === "consultation" 
                            ? `Hola, estoy interesado en el ${vehicleTitle}...` 
                            : `Hola, quisiera reservar el ${vehicleTitle}. Por favor contáctenme para coordinar.`
                        }
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    {activeTab === "consultation" ? "Enviar Consulta" : "Solicitar Reserva"}
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                Al enviar aceptas nuestros términos y condiciones de privacidad.
              </p>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
