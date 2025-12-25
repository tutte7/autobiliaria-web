'use client';

import {
  LayoutDashboard,
  CarFront,
  CalendarDays,
  Inbox,
  Users,
  Settings,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
    title: 'Agenda',
    url: '/admin/agenda',
    icon: CalendarDays,
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
    <Sidebar collapsible="icon" className="border-r border-gray-100 bg-white/95 backdrop-blur-sm">
      {/* Header con Logo */}
      <SidebarHeader className="h-16 flex items-center px-4 pt-4 border-b border-gray-100/50">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-ab.png"
            alt="Autobiliaria"
            width={80}
            height={28}
            className="h-6 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <SidebarGroup>
          {/* Label con líneas decorativas */}
          <SidebarGroupLabel className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest px-5 mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <span className="group-data-[collapsible=icon]:hidden">Plataforma</span>
            <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent group-data-[collapsible=icon]:hidden" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url ||
                  (item.url !== '/admin' && pathname.startsWith(`${item.url}/`));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`
                        h-10 px-3 text-sm font-medium transition-all duration-200 rounded-xl
                        ${isActive
                          ? 'bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 text-white shadow-md shadow-[#0188c8]/25 hover:shadow-lg hover:shadow-[#0188c8]/30'
                          : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-[18px] w-[18px] transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#0188c8]'}`} />
                        <span className={`flex-1 ${isActive ? 'text-white' : ''}`}>{item.title}</span>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer con Avatar Premium */}
      <SidebarFooter className="border-t border-gray-100/50 p-3 bg-gradient-to-t from-gray-50/50 to-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-gray-100 rounded-xl hover:bg-gray-100/80 transition-all"
                >
                  <Avatar className="h-9 w-9 rounded-xl ring-2 ring-[#0188c8]/20">
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-[#0188c8] to-[#00e8ff] text-white font-bold text-sm">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-gray-900">Admin</span>
                    <span className="truncate text-xs text-gray-500">admin@autobiliaria.cloud</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg mx-1 my-1"
                >
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
