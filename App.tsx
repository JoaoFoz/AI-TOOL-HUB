import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { LayoutGrid, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Settings, Plus } from 'lucide-react';

import { User, Tool, Reservation, ViewMode } from './types';
import { MOCK_USERS, INITIAL_TOOLS } from './constants';
import { CalendarView } from './components/CalendarView';
import { BookingModal } from './components/BookingModal';
import { ToolManager } from './components/ToolManager';

function App() {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [users] = useState<User[]>(MOCK_USERS);
  
  // Persistent State (Simulating Database)
  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('ai_scheduler_tools');
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });
  
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('ai_scheduler_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);
  const [modalInitialToolId, setModalInitialToolId] = useState<string | undefined>(undefined);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('ai_scheduler_tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('ai_scheduler_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Handlers
  const handlePrevious = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleSlotClick = (date: Date, toolId?: string) => {
    setModalInitialDate(date);
    setModalInitialToolId(toolId);
    setIsModalOpen(true);
  };

  const handleSaveReservation = (resData: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...resData,
      id: crypto.randomUUID(),
    };
    setReservations([...reservations, newReservation]);
  };

  const handleAddTool = (tool: Tool) => {
    setTools([...tools, tool]);
  };

  const handleRemoveTool = (toolId: string) => {
    // Also remove future reservations for this tool
    if (confirm('Tem a certeza? Todas as reservas futuras para esta ferramenta serão eliminadas.')) {
      setTools(tools.filter(t => t.id !== toolId));
      setReservations(reservations.filter(r => r.toolId !== toolId));
    }
  };

  const renderDateLabel = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: pt });
    }
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      
      if (start.getMonth() === end.getMonth()) {
         return `${format(start, 'd')} - ${format(end, 'd', { locale: pt })} de ${format(end, 'MMMM yyyy', { locale: pt })}`;
      }
      return `${format(start, 'd MMM', { locale: pt })} - ${format(end, 'd MMM yyyy', { locale: pt })}`;
    }
    if (viewMode === 'day') {
      return format(currentDate, "EEEE, d 'de' MMMM", { locale: pt });
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 hidden sm:block">
                AI Tool Hub
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
                title="Configurações"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setModalInitialDate(new Date());
                  setModalInitialToolId(undefined);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nova Reserva</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {isSettingsOpen ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="flex items-center gap-2 mb-6 cursor-pointer text-gray-500 hover:text-blue-600 w-fit" onClick={() => setIsSettingsOpen(false)}>
                <ChevronLeft className="w-4 h-4" />
                Voltar ao Calendário
             </div>
             <ToolManager tools={tools} onAddTool={handleAddTool} onRemoveTool={handleRemoveTool} />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dia
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-800 min-w-[200px] text-center capitalize">
                  {renderDateLabel()}
                  {viewMode === 'day' && <span className="block text-xs font-normal text-gray-500">{format(currentDate, 'yyyy', { locale: pt })}</span>}
                </h2>
                <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <button
                onClick={handleToday}
                className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Hoje
              </button>
            </div>

            {/* Calendar View */}
            <CalendarView
              mode={viewMode}
              currentDate={currentDate}
              reservations={reservations}
              tools={tools}
              users={users}
              onSlotClick={handleSlotClick}
            />

            {/* Legend (for Month/Week views mostly) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Legenda das Ferramentas</h3>
              <div className="flex flex-wrap gap-4">
                {tools.map(tool => (
                  <div key={tool.id} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tool.color }}></span>
                    <span className="text-sm text-gray-700">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservation}
        users={users}
        tools={tools}
        existingReservations={reservations}
        initialDate={modalInitialDate}
        initialToolId={modalInitialToolId}
      />
    </div>
  );
}

export default App;