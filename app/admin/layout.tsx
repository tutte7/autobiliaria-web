'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/admin-sidebar";
import { authService } from "@/services/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Protección de rutas: Verificar autenticación al montar
  useEffect(() => {
    setMounted(true);
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  // Evitar flash de contenido no autorizado
  if (!mounted) return null;

  // Generar breadcrumbs basados en la URL
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    // paths[0] es 'admin'
    
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          {paths.length > 1 && <BreadcrumbSeparator />}
          {paths.slice(1).map((path, index) => {
            const isLast = index === paths.slice(1).length - 1;
            const href = `/admin/${paths.slice(1, index + 1).join('/')}`;
            // Capitalizar primera letra
            const title = path.charAt(0).toUpperCase() + path.slice(1);

            return (
              <div key={path} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                    </>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-gray-50/50 min-h-screen">
        {/* Topbar Fija */}
        <header className="flex h-14 items-center gap-2 border-b bg-white px-4 sticky top-0 z-10">
          <SidebarTrigger className="-ml-2 h-8 w-8 text-gray-500 hover:bg-gray-100" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {generateBreadcrumbs()}
        </header>
        
        {/* Contenido Principal */}
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
