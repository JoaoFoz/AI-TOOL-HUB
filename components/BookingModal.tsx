import React, { useState, useEffect } from 'react';
import { User, Tool, Reservation } from '../types';
import { format, isBefore, parseISO, startOfHour, addHours } from 'date-fns';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: Omit<Reservation, 'id'>) => void;
  users: User[];
  tools: Tool[];
  existingReservations: Reservation[];
  initialDate?: Date;
  initialToolId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  users,
  tools,
  existingReservations,
  initialDate,
  initialToolId,
}) => {
  const [userId, setUserId] = useState<string>(users[0]?.id || '');
  const [toolId, setToolId] = useState<string>(initialToolId || tools[0]?.id || '');
  const [date, setDate] = useState<string>(format(initialDate || new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialDate) setDate(format(initialDate, 'yyyy-MM-dd'));
      if (initialToolId) setToolId(initialToolId);
      setError(null);
    }
  }, [isOpen, initialDate, initialToolId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startDateTime = parseISO(`${date}T${startTime}`);
    const endDateTime = addHours(startDateTime, duration);

    // Basic Validation
    if (isBefore(endDateTime, startDateTime)) {
      setError('A hora de fim deve ser depois da hora de início.');
      return;
    }

    // Overlap Check
    const hasConflict = existingReservations.some((res) => {
      // Check if it's the same tool
      if (res.toolId !== toolId) return false;

      const resStart = parseISO(res.startTime);
      const resEnd = parseISO(res.endTime);

      // (StartA < EndB) and (EndA > StartB)
      return isBefore(startDateTime, resEnd) && isBefore(resStart, endDateTime);
    });

    if (hasConflict) {
      setError('Esta ferramenta já está reservada neste horário.');
      return;
    }

    onSave({
      userId,
      toolId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Reservar Ferramenta IA</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-200">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membro da Equipa</label>
            <div className="relative">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tool Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ferramenta</label>
            <select
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Início</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-9 p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duração (Horas)</label>
            <div className="flex items-center gap-4">
               <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="font-semibold text-gray-700 w-12 text-right">{duration}h</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};