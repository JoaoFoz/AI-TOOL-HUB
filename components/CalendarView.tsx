import React, { useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addDays,
  parseISO,
  isWithinInterval,
  getHours,
  startOfDay,
  differenceInMinutes,
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { Reservation, User, Tool, ViewMode } from '../types';
import { HOURS_OF_OPERATION } from '../constants';

interface CalendarViewProps {
  mode: ViewMode;
  currentDate: Date;
  reservations: Reservation[];
  tools: Tool[];
  users: User[];
  onSlotClick: (date: Date, toolId?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  mode,
  currentDate,
  reservations,
  tools,
  users,
  onSlotClick,
}) => {
  // Helper to get user by ID
  const getUser = (id: string) => users.find((u) => u.id === id);
  // Helper to get tool by ID
  const getTool = (id: string) => tools.find((t) => t.id === id);

  // Generate hours for the vertical axis (Day/Week views)
  const hours = useMemo(() => {
    const h = [];
    for (let i = HOURS_OF_OPERATION.start; i <= HOURS_OF_OPERATION.end; i++) {
      h.push(i);
    }
    return h;
  }, []);

  // --- MONTH VIEW ---
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        // Find reservations for this day
        const dayReservations = reservations.filter((res) =>
          isSameDay(parseISO(res.startTime), cloneDay)
        );

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] bg-white border border-gray-100 p-2 transition-colors hover:bg-gray-50 relative group ${
              !isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : 'text-gray-700'
            } ${isSameDay(day, new Date()) ? 'bg-blue-50/50' : ''}`}
            onClick={() => onSlotClick(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
                {formattedDate}
              </span>
              <button 
                className="opacity-0 group-hover:opacity-100 p-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick(cloneDay);
                }}
              >
                +
              </button>
            </div>
            <div className="mt-2 space-y-1 overflow-y-auto max-h-[90px]">
              {dayReservations.map((res) => {
                const tool = getTool(res.toolId);
                const user = getUser(res.userId);
                if (!tool || !user) return null;
                return (
                  <div
                    key={res.id}
                    className="text-xs px-2 py-1 rounded-md text-white truncate shadow-sm flex items-center gap-1"
                    style={{ backgroundColor: tool.color }}
                    title={`${tool.name} - ${user.name} (${format(parseISO(res.startTime), 'HH:mm')})`}
                  >
                    <img src={user.avatarUrl} alt="" className="w-3 h-3 rounded-full bg-white/20" />
                    <span className="truncate">{format(parseISO(res.startTime), 'HH:mm')} {user.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-px bg-gray-200">
          {days}
        </div>
      );
      days = [];
    }

    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    return (
      <div className="bg-white rounded-lg shadow ring-1 ring-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="bg-gray-200 gap-px border-l border-t border-gray-200">{rows}</div>
      </div>
    );
  };

  // --- WEEK VIEW ---
  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, 6),
    });

    return (
      <div className="flex flex-col h-[600px] overflow-hidden bg-white rounded-lg shadow border border-gray-200">
        {/* Header */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-16 flex-shrink-0 border-r border-gray-200" /> {/* Time gutter */}
          {weekDays.map((day, i) => (
            <div key={i} className={`flex-1 text-center py-3 border-r border-gray-200 last:border-0 ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}>
              <div className="text-xs font-medium text-gray-500 uppercase">{format(day, 'EEE', { locale: pt })}</div>
              <div className={`text-sm font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="flex min-h-[600px]">
            {/* Time Column */}
            <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white z-10 sticky left-0">
              {hours.map((hour) => (
                <div key={hour} className="h-20 border-b border-gray-100 text-xs text-gray-400 text-right pr-2 py-1 sticky left-0">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-1 relative border-r border-gray-100 last:border-0 min-w-[120px]">
                 {/* Grid lines */}
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                        const clickDate = new Date(day);
                        clickDate.setHours(hour);
                        onSlotClick(clickDate);
                    }}
                  />
                ))}

                {/* Events */}
                {reservations
                  .filter((res) => isSameDay(parseISO(res.startTime), day))
                  .map((res) => {
                    const start = parseISO(res.startTime);
                    const end = parseISO(res.endTime);
                    const startHour = getHours(start);
                    const startMin = start.getMinutes();
                    
                    // Simple logic to position: (Hour - StartHour) * 80px + (Min / 60 * 80px)
                    // Assuming grid starts at HOURS_OF_OPERATION.start
                    const topOffset = ((startHour - HOURS_OF_OPERATION.start) * 80) + (startMin / 60 * 80);
                    const durationMins = differenceInMinutes(end, start);
                    const height = (durationMins / 60) * 80;
                    
                    const tool = getTool(res.toolId);
                    const user = getUser(res.userId);

                    if (topOffset < 0) return null; // Event before start time

                    return (
                      <div
                        key={res.id}
                        className="absolute left-1 right-1 rounded-md p-1.5 shadow-sm text-xs border-l-4 overflow-hidden hover:z-20 hover:shadow-md transition-all cursor-pointer"
                        style={{
                          top: `${topOffset}px`,
                          height: `${height}px`,
                          backgroundColor: tool?.color ? `${tool.color}20` : '#e5e7eb', // 20% opacity hex
                          borderColor: tool?.color || '#9ca3af',
                          color: '#1f2937'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`Reservado por ${user?.name} para ${tool?.name}`);
                        }}
                      >
                         <div className="font-semibold flex items-center gap-1">
                            {user && <img src={user.avatarUrl} className="w-4 h-4 rounded-full" alt="avatar"/>}
                            <span className="truncate">{format(start, 'HH:mm')}</span>
                         </div>
                         <div className="font-bold truncate mt-0.5">{tool?.name}</div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- DAY VIEW (Unified Single Column) ---
  const renderDayView = () => {
    // Single day column, but position events based on their tool
    // to avoid overlaps and maintain structure without explicit tool headers.

    return (
      <div className="flex flex-col h-[600px] overflow-hidden bg-white rounded-lg shadow border border-gray-200">
        {/* Header: Just the day label */}
        <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="w-16 flex-shrink-0 border-r border-gray-200" />
            <div className="flex-1 text-center py-3">
                 <div className="text-xs font-medium text-gray-500 uppercase">{format(currentDate, 'EEEE', { locale: pt })}</div>
                 <div className="text-sm font-bold text-gray-900">{format(currentDate, 'd', { locale: pt })}</div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto relative">
             <div className="flex min-h-[600px]">
                {/* Time Column */}
                <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white z-10 sticky left-0">
                {hours.map((hour) => (
                    <div key={hour} className="h-24 border-b border-gray-100 text-xs text-gray-400 text-right pr-2 py-1 sticky left-0">
                    {hour}:00
                    </div>
                ))}
                </div>

                {/* Single Day Content Area */}
                <div className="flex-1 relative">
                    {/* Grid Lines (Horizontal only) with Implicit Columns for clicking */}
                    {hours.map((hour) => (
                        <div 
                            key={hour} 
                            className="h-24 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer relative"
                        >
                            {/* Implicit Click Zones for Tools */}
                             {tools.map((tool, index) => (
                                <div 
                                    key={tool.id}
                                    className="absolute top-0 bottom-0 hover:bg-gray-100/50"
                                    style={{
                                        left: `${(index / tools.length) * 100}%`,
                                        width: `${100 / tools.length}%`
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent parent click
                                        const clickDate = new Date(currentDate);
                                        clickDate.setHours(hour);
                                        onSlotClick(clickDate, tool.id);
                                    }}
                                    title={`Reservar ${tool.name}`}
                                />
                             ))}
                        </div>
                    ))}

                    {/* Events */}
                    {reservations
                        .filter(res => isSameDay(parseISO(res.startTime), currentDate))
                        .map(res => {
                            const tool = getTool(res.toolId);
                            if (!tool) return null;
                            const toolIndex = tools.findIndex(t => t.id === tool.id);
                            if (toolIndex === -1) return null;

                            const start = parseISO(res.startTime);
                            const end = parseISO(res.endTime);
                            const startHour = getHours(start);
                            const startMin = start.getMinutes();
                            
                            const topOffset = ((startHour - HOURS_OF_OPERATION.start) * 96) + (startMin / 60 * 96);
                            const durationMins = differenceInMinutes(end, start);
                            const height = (durationMins / 60) * 96;

                            // Calculate horizontal position based on tool index
                            const widthPercent = 100 / tools.length;
                            const leftPercent = toolIndex * widthPercent;

                            const user = getUser(res.userId);

                            return (
                                <div
                                    key={res.id}
                                    className="absolute rounded-lg p-2 shadow-md text-sm border overflow-hidden hover:z-20 transition-all cursor-default flex flex-col items-center justify-center text-center bg-white"
                                    style={{
                                        top: `${topOffset}px`,
                                        height: `${height}px`,
                                        left: `${leftPercent}%`,
                                        width: `${widthPercent}%`,
                                        borderColor: tool.color,
                                    }}
                                >
                                    <div className="absolute inset-0 opacity-10" style={{backgroundColor: tool.color}}></div>
                                    <div className="z-10 relative flex flex-col items-center">
                                        <div className="flex items-center gap-1 mb-1">
                                            <img src={user?.avatarUrl} alt={user?.name} className="w-6 h-6 rounded-full border border-white" />
                                            <span className="font-bold text-gray-800 text-xs truncate max-w-[80px]">{user?.name}</span>
                                        </div>
                                        <span className="font-bold text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white mb-0.5" style={{backgroundColor: tool.color}}>
                                            {tool.name}
                                        </span>
                                        <span className="text-xs text-gray-500">{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</span>
                                    </div>
                                </div>
                             )
                        })
                    }
                </div>
             </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {mode === 'month' && renderMonthView()}
      {mode === 'week' && renderWeekView()}
      {mode === 'day' && renderDayView()}
    </div>
  );
};