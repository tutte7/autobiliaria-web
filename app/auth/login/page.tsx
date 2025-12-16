'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { authService } from '@/services/auth';

const formSchema = z.object({
  username: z.string().min(1, 'El usuario o email es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login({
        username: values.username,
        password: values.password,
      });
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Fondo con gradiente de marca */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0188c8] via-[#0166a0] to-[#00e8ff]/70 dark:from-[#012a42] dark:via-[#01405f] dark:to-[#00e8ff]/30" />

      {/* Patrón de puntos sutiles para textura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px] opacity-30" />

      {/* Orbes decorativos */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00e8ff]/40 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#0188c8]/50 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[80px]" />

      {/* Card con Glassmorphism */}
      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20 animate-fade-in-up">
        {/* Borde brillante superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <CardHeader className="space-y-4 text-center">
          {/* Logo */}
          <div className="mx-auto flex items-center justify-center rounded-xl bg-white/90 px-5 py-3 shadow-lg">
            <Image
              src="/logo-ab.png"
              alt="Autobiliaria"
              width={150}
              height={34}
              priority
            />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-sm">
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-white/70">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 border-red-400/30 bg-red-500/20 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertTitle className="text-red-200">Error</AlertTitle>
              <AlertDescription className="text-red-100/90">{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90">Usuario o Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin"
                        {...field}
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-white text-primary font-semibold hover:bg-white/90 shadow-lg shadow-white/25 transition-all hover:shadow-white/40 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ingresar
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <p className="text-xs text-white/50 font-medium tracking-widest uppercase">
            Autobiliaria
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
