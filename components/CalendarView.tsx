import React, { useMemo, useRef, useEffect } from 'react';
import {
  isSameDay,
  parseISO,
  differenceInMinutes,
  startOfDay,
  areIntervalsOverlapping,
} from 'date-fns';
import { Reservation, User, Tool, ViewMode } from '../types';

interface CalendarViewProps {
  mode: ViewMode;
  currentDate: Date;
  reservations: Reservation[];
  tools: Tool[];
  users: User[];
  onSlotClick: (date: Date, toolId?: string) => void;
  onReservationClick: (reservation: Reservation) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  mode,
  currentDate,
  reservations,
  tools,
  users,
  onSlotClick,
  onReservationClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const getUser = (id: string) => users.find((u) => u.id === id);

  // Generate 24 hours
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  // Filter reservations for the current day
  const dayReservations = useMemo(() => {
    return reservations.filter(res => isSameDay(parseISO(res.startTime), currentDate));
  }, [reservations, currentDate]);

  const getToolReservations = (toolId: string) => {
    return dayReservations.filter(res => res.toolId === toolId);
  };

  // Helper to position items on the timeline
  const getPositionStyle = (startTimeStr: string, endTimeStr: string) => {
    const start = parseISO(startTimeStr);
    const end = parseISO(endTimeStr);
    
    const startOfDayDate = startOfDay(currentDate);
    const startMinutes = differenceInMinutes(start, startOfDayDate);
    const durationMinutes = differenceInMinutes(end, start);
    
    // Total day = 1440 minutes
    const HOUR_WIDTH = 100; // px
    const left = (startMinutes / 60) * HOUR_WIDTH;
    const width = (durationMinutes / 60) * HOUR_WIDTH;

    return { left: `${left}px`, width: `${width}px` };
  };

  // Scroll to 8:00 on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
        // Scroll to 08:00 (8 * 100px)
        scrollContainerRef.current.scrollLeft = 8 * 100 - 50; 
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Container */}
      <div ref={scrollContainerRef} className="overflow-x-auto flex-1 custom-scrollbar relative">
        <div className="min-w-[2600px] bg-white dark:bg-gray-800 pb-4 transition-colors"> 
            
            {/* Header Row (Time) */}
            <div className="flex border-b border-gray-100 dark:border-gray-700 h-12 sticky top-0 bg-white dark:bg-gray-800 z-20">
                {/* Sticky Corner */}
                <div className="w-56 sticky left-0 bg-white dark:bg-gray-800 z-30 flex items-center px-6 border-r border-gray-100 dark:border-gray-700 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Tool / Time</span>
                </div>
                
                {/* Time Slots */}
                <div className="flex flex-1">
                    {hours.map(h => (
                        <div key={h} className="w-[100px] flex-shrink-0 border-r border-gray-50 dark:border-gray-700 flex items-center justify-center">
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{h.toString().padStart(2, '0')}:00</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tool Rows */}
            <div className="">
                {tools.map((tool) => (
                    <div key={tool.id} className="flex h-16 border-b border-gray-50 dark:border-gray-700 relative group">
                        
                        {/* Sticky Tool Name */}
                        <div className="w-56 sticky left-0 bg-white dark:bg-gray-800 z-20 flex items-center gap-3 px-6 border-r border-gray-100 dark:border-gray-700 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] group-hover:bg-gray-50/50 dark:group-hover:bg-gray-700/50 transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tool.color }} />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{tool.name}</span>
                        </div>

                        {/* Grid & Click Area */}
                        <div className="flex flex-1 relative bg-white dark:bg-gray-800 group-hover:bg-gray-50/30 dark:group-hover:bg-gray-700/30 transition-colors">
                            {/* Grid Lines */}
                            {hours.map(h => (
                                <div 
                                    key={h} 
                                    className="w-[100px] h-full flex-shrink-0 border-r border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                    onClick={() => {
                                        const clickDate = new Date(currentDate);
                                        clickDate.setHours(h, 0, 0, 0);
                                        onSlotClick(clickDate, tool.id);
                                    }}
                                />
                            ))}

                            {/* Reservations */}
                            {getToolReservations(tool.id).map(res => {
                                const user = getUser(res.userId);
                                if (!user) return null;
                                const style = getPositionStyle(res.startTime, res.endTime);
                                
                                return (
                                    <div
                                        key={res.id}
                                        className="absolute top-2 bottom-2 rounded-md shadow-sm border border-white/20 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all z-10 overflow-hidden flex items-center px-2 gap-2"
                                        style={{ ...style, backgroundColor: tool.color }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReservationClick(res);
                                        }}
                                        title={`${tool.name} reserved by ${user.name}`}
                                    >
                                        <img 
                                            src={user.avatarUrl} 
                                            className="w-5 h-5 rounded-full border border-white/50 flex-shrink-0" 
                                            alt={user.name} 
                                        />
                                        <span className="text-xs font-bold text-white truncate drop-shadow-sm pointer-events-none">
                                            {user.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Empty State / Filler */}
            {tools.length === 0 && (
                 <div className="p-8 text-center text-gray-400 dark:text-gray-500">No tools configured.</div>
            )}
        </div>
      </div>
    </div>
  );
};