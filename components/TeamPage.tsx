import React, { useState } from 'react';
import { User } from '../types';
import { Plus, MoreVertical, Edit2, Trash2, X } from 'lucide-react';

interface TeamPageProps {
  users: User[];
  onAdd: (u: User) => void;
  onUpdate: (u: User) => void;
  onRemove: (id: string) => void;
  currentUser: User;
}

export const TeamPage: React.FC<TeamPageProps> = ({ users, onAdd, onUpdate, onRemove, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [initials, setInitials] = useState('');
  const [role, setRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');

  const openModal = (user?: User) => {
    setOpenMenuId(null);
    if (user) {
      setEditingUser(user);
      setName(user.name);
      setInitials(user.initials);
      setRole(user.role);
    } else {
      setEditingUser(null);
      setName('');
      setInitials('');
      setRole('Member');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdate({ ...editingUser, name, initials, role });
    } else {
      onAdd({
        id: crypto.randomUUID(),
        name,
        initials,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" onClick={() => setOpenMenuId(null)}>
      
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div>
           <h2 className="font-bold text-gray-900 dark:text-white">Team Members</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your team (10 seats limit recommended).</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all relative z-0">
            
            {/* Action Menu (Always Visible) */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {openMenuId === user.id && (
                <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 text-left animate-in fade-in zoom-in duration-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openModal(user); }}
                    className="w-full px-4 py-2.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Remove user?')) onRemove(user.id); }}
                    className="w-full px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium absolute left-6 top-6">
               {user.role}
            </span>

            <div className="mt-8 mb-3 w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-3xl font-bold flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm transition-colors">
              {user.initials}
            </div>
            
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</h3>
            
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200 transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{editingUser ? 'Edit Member' : 'Add Team Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
                <input required value={name} onChange={e => { setName(e.target.value); if(!editingUser) setInitials(e.target.value.substring(0,2).toUpperCase()); }} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Initials</label>
                  <input required value={initials} onChange={e => setInitials(e.target.value)} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" placeholder="JD" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Role</label>
                   <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                     <option value="Admin">Admin</option>
                     <option value="Member">Member</option>
                     <option value="Viewer">Viewer</option>
                   </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};