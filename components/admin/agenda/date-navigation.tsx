'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatDisplayDate = (date: Date) => {
    if (isToday(date)) {
      return `Hoy, ${format(date, "d 'de' MMMM yyyy", { locale: es })}`;
    }
    return format(date, "EEEE, d 'de' MMMM yyyy", { locale: es });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousDay}
          className="rounded-xl h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl min-w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="capitalize">{formatDisplayDate(selectedDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextDay}
          className="rounded-xl h-10 w-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <Button
        variant={isToday(selectedDate) ? "default" : "outline"}
        onClick={goToToday}
        className={`rounded-xl ${isToday(selectedDate) ? 'bg-[#0188c8] hover:bg-[#0188c8]/90' : ''}`}
        disabled={isToday(selectedDate)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Hoy
      </Button>
    </div>
  );
}
