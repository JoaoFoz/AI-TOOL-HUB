import React, { useState, useEffect } from 'react';
import { User, Tool, Reservation } from '../types';
import { format, isBefore, parseISO, addHours, differenceInMinutes } from 'date-fns';
import { X, Calendar, Clock, AlertCircle, Trash2, AlignLeft } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: Omit<Reservation, 'id'>) => void;
  onDelete?: () => void;
  users: User[];
  tools: Tool[];
  existingReservations: Reservation[];
  initialDate?: Date;
  initialToolId?: string;
  reservationToEdit?: Reservation;
  currentUser?: User;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  users,
  tools,
  existingReservations,
  initialDate,
  initialToolId,
  reservationToEdit,
  currentUser
}) => {
  const [userId, setUserId] = useState<string>('');
  const [toolId, setToolId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(1);
  const [notes, setNotes] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (reservationToEdit) {
        // Edit Mode
        const start = parseISO(reservationToEdit.startTime);
        const end = parseISO(reservationToEdit.endTime);
        
        setUserId(reservationToEdit.userId);
        setToolId(reservationToEdit.toolId);
        setDate(format(start, 'yyyy-MM-dd'));
        setStartTime(format(start, 'HH:mm'));
        setNotes(reservationToEdit.notes || '');
        
        const diffMins = differenceInMinutes(end, start);
        setDuration(diffMins / 60);
      } else {
        // Create Mode
        setUserId(currentUser?.id || users[0]?.id || '');
        if (initialDate) setDate(format(initialDate, 'yyyy-MM-dd'));
        else setDate(format(new Date(), 'yyyy-MM-dd'));
        
        setToolId(initialToolId || tools[0]?.id || '');
        setStartTime('09:00');
        setDuration(1);
        setNotes('');
      }
      setError(null);
    }
  }, [isOpen, initialDate, initialToolId, reservationToEdit, users, tools, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startDateTime = parseISO(`${date}T${startTime}`);
    const endDateTime = addHours(startDateTime, duration);

    if (isBefore(endDateTime, startDateTime)) {
      setError('A hora de fim deve ser depois da hora de início.');
      return;
    }

    const hasConflict = existingReservations.some((res) => {
      if (reservationToEdit && res.id === reservationToEdit.id) return false;
      if (res.toolId !== toolId) return false;

      const resStart = parseISO(res.startTime);
      const resEnd = parseISO(res.endTime);

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
      notes 
    });
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!reservationToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? 'Editar Reserva' : 'Reservar Ferramenta IA'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Membro da Equipa</label>
            <div className="relative">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900 dark:text-white"
                disabled={!isEditing && currentUser?.role !== 'Admin' && currentUser?.id !== userId} 
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ferramenta</label>
            <select
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora de Início</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-9 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duração (Horas)</label>
            <div className="flex items-center gap-4">
               <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">{duration}h</span>
            </div>
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição da Tarefa</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva o que vai fazer..."
                className="w-full pl-9 p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 mt-2">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                {isEditing ? 'Guardar' : 'Confirmar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};