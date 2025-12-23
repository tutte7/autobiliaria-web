'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    setMounted(true);
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  if (!mounted) return null;

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin"
              className="text-gray-500 hover:text-[#0188c8] transition-colors font-medium"
            >
              Admin
            </BreadcrumbLink>
          </BreadcrumbItem>
          {paths.length > 1 && <BreadcrumbSeparator className="text-gray-300" />}
          {paths.slice(1).map((path, index) => {
            const isLast = index === paths.slice(1).length - 1;
            const href = `/admin/${paths.slice(1, index + 2).join('/')}`;
            const title = path.charAt(0).toUpperCase() + path.slice(1);

            return (
              <div key={path} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-gray-900 font-semibold">{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={href}
                      className="text-gray-500 hover:text-[#0188c8] transition-colors font-medium"
                    >
                      {title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="text-gray-300" />}
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
        {/* Header Premium */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-2 h-9 w-9 text-gray-500 hover:bg-gray-100 hover:text-[#0188c8] rounded-lg transition-colors" />
            <Separator orientation="vertical" className="h-6 bg-gray-200" />
            <div className="flex items-center">
              {generateBreadcrumbs()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Acceso Rápido Web */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex h-10 rounded-xl border-gray-200 text-gray-600 hover:text-[#0188c8] hover:border-[#0188c8]/50 transition-colors"
              asChild
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Web
              </a>
            </Button>
          </div>
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
