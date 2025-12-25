'use client';

import { MeetingCard } from './meeting-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarX } from 'lucide-react';
import type { Reunion } from '@/services/meetings';

interface AgendaDailyViewProps {
  meetings: Reunion[];
  loading?: boolean;
  onEdit: (meeting: Reunion) => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  onDelete: (id: number) => void;
}

export function AgendaDailyView({
  meetings,
  loading,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
}: AgendaDailyViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-md animate-pulse overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <div className="flex min-h-[100px]">
                <div className="w-[90px] bg-gray-200 rounded-l-xl"></div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <CalendarX className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No hay reuniones programadas
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              No tienes reuniones para este dia. Haz clic en &quot;Nueva Reunion&quot; para agendar una.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onEdit={onEdit}
          onComplete={onComplete}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
