import React, { useState } from 'react';
import { 
  format, 
  addDays, subDays, 
  startOfWeek, endOfWeek, addWeeks, subWeeks 
} from 'date-fns';
import { pt } from 'date-fns/locale'; 
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ViewMode, User, Tool, Reservation } from '../types';
import { CalendarView } from './CalendarView';
import { BookingModal } from './BookingModal';

interface DashboardProps {
  users: User[];
  tools: Tool[];
  reservations: Reservation[];
  onAddReservation: (r: Reservation) => void;
  onUpdateReservation: (r: Reservation) => void;
  onRemoveReservation: (id: string) => void;
  currentUser?: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  users, tools, reservations, 
  onAddReservation, onUpdateReservation, onRemoveReservation, currentUser 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day'); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);
  const [modalInitialToolId, setModalInitialToolId] = useState<string | undefined>(undefined);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Date Navigation
  const handlePrevious = () => {
    if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleSlotClick = (date: Date, toolId?: string) => {
    setSelectedReservation(null);
    setModalInitialDate(date);
    setModalInitialToolId(toolId);
    setIsModalOpen(true);
  };

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalInitialDate(undefined);
    setModalInitialToolId(undefined);
    setIsModalOpen(true);
  };

  const handleSaveBooking = (resData: Omit<Reservation, 'id'>) => {
    if (selectedReservation) {
      onUpdateReservation({ ...resData, id: selectedReservation.id });
    } else {
      onAddReservation({ ...resData, id: crypto.randomUUID() });
    }
  };

  const renderDateLabel = () => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    // Format: December 11, 2025
    return format(currentDate, "MMMM d, yyyy");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col font-sans">
      
      {/* Title Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Schedule</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your team's AI resource allocation efficiently.</p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden transition-colors">
        
        {/* Toolbar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Left Controls */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('day')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'day' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Day
                    </button>
                    <button 
                         onClick={() => setViewMode('week')}
                         className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'week' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Week
                    </button>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center gap-3">
                    <button onClick={handlePrevious} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-gray-900 dark:text-white text-sm min-w-[140px] text-center">
                        {renderDateLabel()}
                    </span>
                    <button onClick={handleNext} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Right Action */}
            <button
                onClick={() => {
                setSelectedReservation(null);
                setModalInitialDate(new Date());
                setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
                New Reservation
            </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-hidden relative">
            <CalendarView
                mode={viewMode}
                currentDate={currentDate}
                reservations={reservations}
                tools={tools}
                users={users}
                onSlotClick={handleSlotClick}
                onReservationClick={handleReservationClick}
            />
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBooking}
        onDelete={() => {
          if (selectedReservation) {
            onRemoveReservation(selectedReservation.id);
            setIsModalOpen(false);
          }
        }}
        users={users}
        tools={tools}
        existingReservations={reservations}
        initialDate={modalInitialDate}
        initialToolId={modalInitialToolId}
        reservationToEdit={selectedReservation || undefined}
        currentUser={currentUser}
      />
    </div>
  );
};