'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import type { ReunionEstadisticas } from '@/services/meetings';

interface StatsCardsProps {
  stats: ReunionEstadisticas | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const statCards = [
    {
      title: 'Hoy',
      value: stats?.hoy || 0,
      description: 'Reuniones pendientes',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Manana',
      value: stats?.manana || 0,
      description: 'Reuniones programadas',
      icon: CalendarClock,
      color: 'from-cyan-500 to-cyan-600',
      bgLight: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Esta Semana',
      value: stats?.semana || 0,
      description: 'Total de la semana',
      icon: CalendarDays,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Este Mes',
      value: stats?.mes || 0,
      description: 'Total del mes',
      icon: CalendarRange,
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      iconColor: 'text-violet-600'
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden border-0 shadow-md animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-9 w-9 bg-gray-200 rounded-xl"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${stat.bgLight}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
        </Card>
      ))}
    </div>
  );
}
