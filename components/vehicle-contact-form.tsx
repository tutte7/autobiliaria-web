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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.autobiliaria.cloud';

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingresa un email válido" }),
  phone: z.string().min(6, { message: "Ingresa un teléfono válido" }),
  message: z.string().min(1, { message: "El mensaje es requerido" }),
  type: z.enum(["consultation", "reservation"]),
})

interface VehicleContactFormProps {
  vehicleTitle: string
  vehicleId: number
}

export function VehicleContactForm({ vehicleTitle, vehicleId }: VehicleContactFormProps) {
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

    // Map form type to API type ('consulta' or 'reserva')
    const tipoApi = values.type === "consultation" ? "consulta" : "reserva";

    // Build payload according to consultas.md documentation
    const payload = {
      nombre: values.name,
      email: values.email,
      telefono: values.phone,
      mensaje: values.message || `Consulta sobre ${vehicleTitle}`,
      tipo: tipoApi,
      vehiculo: vehicleId,
    };

    const endpoint = `${API_URL}/api/consultas/`;
    console.log('Enviando consulta a:', endpoint, payload);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessages = Object.values(errorData).flat().join(', ');
        throw new Error(errorMessages || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Consulta creada exitosamente:', data);

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
    } catch (error: any) {
      console.error('Error enviando consulta:', error);
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al enviar el formulario. Intenta nuevamente.",
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




