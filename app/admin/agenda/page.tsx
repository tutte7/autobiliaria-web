'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { StatsCards } from '@/components/admin/agenda/stats-cards';
import { DateNavigation } from '@/components/admin/agenda/date-navigation';
import { AgendaDailyView } from '@/components/admin/agenda/agenda-daily-view';
import { MeetingForm } from '@/components/admin/agenda/meeting-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import meetingsService, { Reunion, ReunionEstadisticas } from '@/services/meetings';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Reunion[]>([]);
  const [stats, setStats] = useState<ReunionEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Reunion | null>(null);

  // Estados para el dialogo de confirmacion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);

  // Cargar reuniones del dia seleccionado
  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const fecha = format(selectedDate, 'yyyy-MM-dd');
      const data = await meetingsService.getByDate(fecha);
      setMeetings(data);
    } catch (error) {
      console.error('Error cargando reuniones:', error);
      toast.error('Error al cargar las reuniones');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Cargar estadisticas
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await meetingsService.getEstadisticas();
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadisticas:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Efecto para cargar datos
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handlers
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNewMeeting = () => {
    setEditingMeeting(null);
    setFormOpen(true);
  };

  const handleEditMeeting = (meeting: Reunion) => {
    setEditingMeeting(meeting);
    setFormOpen(true);
  };

  const handleCompleteMeeting = async (id: number) => {
    try {
      await meetingsService.marcarCompletada(id);
      toast.success('Reunion marcada como completada');
      fetchMeetings();
      fetchStats();
    } catch (error) {
      console.error('Error completando reunion:', error);
      toast.error('Error al completar la reunion');
    }
  };

  const handleCancelMeeting = async (id: number) => {
    try {
      await meetingsService.marcarCancelada(id);
      toast.success('Reunion cancelada');
      fetchMeetings();
      fetchStats();
    } catch (error) {
      console.error('Error cancelando reunion:', error);
      toast.error('Error al cancelar la reunion');
    }
  };

  const handleDeleteMeeting = (id: number) => {
    setMeetingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!meetingToDelete) return;

    try {
      await meetingsService.delete(meetingToDelete);
      toast.success('Reunion eliminada');
      setDeleteDialogOpen(false);
      setMeetingToDelete(null);
      fetchMeetings();
      fetchStats();
    } catch (error) {
      console.error('Error eliminando reunion:', error);
      toast.error('Error al eliminar la reunion');
    }
  };

  const handleFormSuccess = () => {
    toast.success(editingMeeting ? 'Reunion actualizada' : 'Reunion creada');
    fetchMeetings();
    fetchStats();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agenda</h1>
          <p className="text-gray-500 mt-1">Gestiona tus reuniones con compradores y vendedores</p>
        </div>
        <Button
          onClick={handleNewMeeting}
          className="rounded-xl bg-gradient-to-r from-[#0188c8] to-[#0188c8]/90 shadow-md shadow-[#0188c8]/25 hover:shadow-lg hover:shadow-[#0188c8]/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Reunion
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Date Navigation */}
      <DateNavigation
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Reuniones del dia
        </h2>
        <span className="text-sm text-gray-500">
          {meetings.length} reunion{meetings.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Daily View */}
      <AgendaDailyView
        meetings={meetings}
        loading={loading}
        onEdit={handleEditMeeting}
        onComplete={handleCompleteMeeting}
        onCancel={handleCancelMeeting}
        onDelete={handleDeleteMeeting}
      />

      {/* Meeting Form Dialog */}
      <MeetingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        meeting={editingMeeting}
        selectedDate={selectedDate}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Reunion</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. La reunion sera eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
