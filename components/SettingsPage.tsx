import React, { useState, useEffect } from 'react';
import { Bell, Moon, Shield } from 'lucide-react';

const Toggle = ({ active, onChange }: { active: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
  >
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export const SettingsPage = () => {
  const [mentions, setMentions] = useState(true);
  const [conflicts, setConflicts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [publicView, setPublicView] = useState(false);

  // Load settings on mount
  useEffect(() => {
    // Check if 'dark' class is present on html element or local storage
    const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSave = () => {
    // Apply Dark Mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Feedback to user
    alert('Definições guardadas com sucesso!');
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your application preferences and configuration.</p>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Bell className="w-5 h-5" /></div>
           <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Configure how you receive alerts.</p>
           </div>
        </div>
        <div className="p-6 space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">Mentions</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications when you are mentioned.</p>
             </div>
             <Toggle active={mentions} onChange={() => setMentions(!mentions)} />
           </div>
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">Booking Conflicts</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">Alert when a booking overlaps with your schedule.</p>
             </div>
             <Toggle active={conflicts} onChange={() => setConflicts(!conflicts)} />
           </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg"><Moon className="w-5 h-5" /></div>
           <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Appearance</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Customize the look and feel.</p>
           </div>
        </div>
        <div className="p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">Enable dark theme for the interface.</p>
             </div>
             <Toggle active={darkMode} onChange={() => setDarkMode(!darkMode)} />
           </div>
        </div>
      </div>

       {/* Privacy */}
       <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg"><Shield className="w-5 h-5" /></div>
           <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Privacy & Data</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage your data and privacy settings.</p>
           </div>
        </div>
        <div className="p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">Public Availability</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">Allow other teams to see your availability.</p>
             </div>
             <Toggle active={publicView} onChange={() => setPublicView(!publicView)} />
           </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-colors"
        >
            Save Changes
        </button>
      </div>

    </div>
  );
};