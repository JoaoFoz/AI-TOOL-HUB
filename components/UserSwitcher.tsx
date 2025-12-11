import React from 'react';
import { User } from '../types';
import { Check } from 'lucide-react';

interface UserSwitcherProps {
  users: User[];
  currentUser: User;
  onSwitch: (user: User) => void;
  onClose: () => void;
}

export const UserSwitcher: React.FC<UserSwitcherProps> = ({ users, currentUser, onSwitch, onClose }) => {
  return (
    <div className="absolute bottom-full left-0 w-60 bg-white rounded-xl shadow-xl border border-gray-200 mb-2 overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Switch Account</p>
      </div>
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onSwitch(user)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-l-2 ${
              currentUser.id === user.id ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
              {user.initials}
            </div>
            <div className="flex-1 overflow-hidden">
               <p className={`text-sm truncate ${currentUser.id === user.id ? 'font-bold text-blue-900' : 'font-medium text-gray-700'}`}>
                 {user.name}
               </p>
               <p className="text-[10px] text-gray-500">{user.role}</p>
            </div>
            {currentUser.id === user.id && <Check className="w-4 h-4 text-blue-600" />}
          </button>
        ))}
      </div>
    </div>
  );
};