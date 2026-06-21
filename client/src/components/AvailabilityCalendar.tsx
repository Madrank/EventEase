import { useState, useMemo, useCallback } from 'react';

interface AvailabilityCalendarProps {
  unavailableDates: string[];
  unavailableRanges?: { checkIn: string; checkOut: string }[];
  title?: string;
  minDate?: Date;
  selectedDates?: string[];
  onSelectionChange?: (dates: string[]) => void;
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function expandRanges(ranges: { checkIn: string; checkOut: string }[]): string[] {
  const dates: string[] = [];
  for (const range of ranges) {
    const start = new Date(range.checkIn);
    const end = new Date(range.checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
}

export default function AvailabilityCalendar({ unavailableDates, unavailableRanges, title = 'Disponibilités', minDate, selectedDates = [], onSelectionChange }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const allUnavailable = useMemo(() => {
    const set = new Set(unavailableDates);
    if (unavailableRanges) {
      for (const d of expandRanges(unavailableRanges)) set.add(d);
    }
    return set;
  }, [unavailableDates, unavailableRanges]);

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const minDateNormalized = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : todayDate;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const toggleDate = useCallback((dateStr: string) => {
    if (!onSelectionChange) return;
    const next = selectedSet.has(dateStr)
      ? selectedDates.filter(d => d !== dateStr)
      : [...selectedDates, dateStr].sort();
    onSelectionChange(next);
  }, [onSelectionChange, selectedSet, selectedDates]);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`e-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(day);
    const dateObj = new Date(year, month, day);
    const isPast = dateObj < minDateNormalized;
    const busy = allUnavailable.has(dateStr);
    const isSelected = selectedSet.has(dateStr);
    const isToday = dateStr === todayStr;
    const clickable = !isPast && !busy && !!onSelectionChange;

    let bg = 'bg-emerald-50 text-emerald-700';
    let title = 'Disponible';
    if (isPast) { bg = 'bg-gray-100 text-gray-300'; title = 'Date passée'; }
    else if (busy) { bg = 'bg-red-50 text-red-400 line-through'; title = 'Indisponible'; }
    else if (isSelected) { bg = 'bg-primary-500 text-white font-bold'; title = 'Sélectionné'; }

    days.push(
      <div
        key={day}
        onClick={() => clickable && toggleDate(dateStr)}
        className={`h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${bg} ${
          clickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
        } ${isToday && !isPast && !isSelected ? 'ring-2 ring-primary-500' : ''}`}
        title={title}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-sm font-semibold text-gray-700 w-32 text-center">{MONTHS[month]} {year}</span>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">{days}</div>
      <div className="flex items-center justify-end space-x-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-50 border border-emerald-200 inline-block" />
          <span>Disponible</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200 inline-block" />
          <span>Indisponible</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-100 border border-gray-200 inline-block" />
          <span>Passé</span>
        </span>
        {onSelectionChange && (
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary-500 inline-block" />
            <span>Sélectionné</span>
          </span>
        )}
      </div>
    </div>
  );
}
