'use client';

import {
  LayoutDashboard,
  CarFront, // Icono solicitado para Inventario
  Inbox,    // Icono solicitado para Bandeja
  Users,
  Settings,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService } from '@/services/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Estructura de navegación definida en los requerimientos
const items = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Inventario',
    url: '/admin/vehiculos',
    icon: CarFront,
  },
  {
    title: 'Bandeja de Entrada',
    url: '/admin/solicitudes',
    icon: Inbox,
  },
  {
    title: 'Vendedores',
    url: '/admin/vendedores',
    icon: Users,
  },
  {
    title: 'Configuración',
    url: '/admin/parametros',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="h-14 flex items-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          {/* Puedes poner tu logo aquí */}
          <div className="h-6 w-6 rounded-md bg-black text-white flex items-center justify-center text-xs font-bold">A</div>
          <span className="group-data-[collapsible=icon]:hidden">Autobiliaria</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-xs font-medium uppercase tracking-wider px-4 mb-2">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`
                        h-9 px-3 text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      <Link href={item.url}>
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-gray-100 text-gray-600">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs text-gray-500">admin@autobiliaria.cloud</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-gray-500" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white border border-gray-200 shadow-lg"
              >
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
