import React, { useState } from 'react';
import { Tool, User } from '../types';
import { Plus, Trash2, Cpu, MessageSquare, MoreVertical, Edit2, X, Calendar, Tag } from 'lucide-react';

interface ToolsPageProps {
  tools: Tool[];
  onAdd: (tool: Tool) => void;
  onRemove: (id: string) => void;
  onViewReviews: (toolId: string) => void;
  getReviewCount: (toolId: string) => number;
  currentUser: User;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ 
  tools, onAdd, onRemove, onViewReviews, getReviewCount, currentUser 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [iconName, setIconName] = useState('Cpu');
  const [nature, setNature] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('0');
  const [cycle, setCycle] = useState<'Monthly' | 'Yearly'>('Monthly');

  const openModal = (tool?: Tool) => {
    setOpenMenuId(null);
    if (tool) {
      setEditingId(tool.id);
      setName(tool.name);
      setColor(tool.color);
      setIconName(tool.icon || 'Cpu');
      setNature(tool.nature || '');
      setStartDate(tool.startDate || '');
      setEndDate(tool.endDate || '');
      setPrice(tool.price || '0');
      setCycle(tool.billingCycle || 'Monthly');
    } else {
      setEditingId(null);
      setName('');
      setColor('#3b82f6');
      setIconName('Cpu');
      setNature('');
      setStartDate('');
      setEndDate('');
      setPrice('0');
      setCycle('Monthly');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const toolData: Tool = {
      id: editingId || crypto.randomUUID(),
      name,
      color,
      icon: iconName,
      nature,
      startDate,
      endDate,
      price,
      billingCycle: cycle,
      description: 'AI Tool'
    };
    
    if (editingId) {
        onRemove(editingId); 
    }
    onAdd(toolData); 

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" onClick={() => setOpenMenuId(null)}>
      
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div>
           <h2 className="font-bold text-gray-900 dark:text-white">AI Tools</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Configure the tools available for scheduling.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const reviewCount = getReviewCount(tool.id);
          return (
            <div key={tool.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col relative group z-0">
              {/* Color Stripe Left */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl" style={{ backgroundColor: tool.color }} />
              
              <div className="p-6 pl-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                    <Cpu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  
                  {/* Always show action menu */}
                  <div className="relative z-10">
                      <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === tool.id ? null : tool.id); }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === tool.id && (
                      <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 text-left animate-in fade-in zoom-in duration-100">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(tool); }}
                          className="w-full px-4 py-2.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if(confirm('Delete tool?')) onRemove(tool.id); }}
                          className="w-full px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{tool.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">${tool.price}</span>
                     <span className="text-xs text-gray-400 dark:text-gray-500">/ {tool.billingCycle}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                   {/* Nature Display in Bottom Left */}
                   <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {tool.nature || 'General'}
                   </span>
                   
                   <button 
                      onClick={() => onViewReviews(tool.id)}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                   >
                      <MessageSquare className="w-3 h-3" />
                      {reviewCount} Reviews
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-in zoom-in duration-200 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">{editingId ? 'Edit AI Tool' : 'Add AI Tool'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure available AI tools for the team.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Tool Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Tool Name</label>
                <input 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                    placeholder="e.g. GPT-4" 
                />
              </div>

               {/* Nature of the Tool (New Field) */}
               <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Natureza da Ferramenta</label>
                <input 
                    value={nature} 
                    onChange={e => setNature(e.target.value)} 
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                    placeholder="e.g. Text-to-Speech, Image Generation, LLM" 
                />
              </div>

              {/* Row 1: Color & Icon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Color</label>
                    <div className="flex gap-3">
                        <div 
                            className="w-11 h-11 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex-shrink-0"
                            style={{ backgroundColor: color }}
                        />
                        <input 
                            value={color} 
                            onChange={e => setColor(e.target.value)} 
                            className="flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500" 
                            placeholder="#000000" 
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Icon Name (Lucide)</label>
                    <input 
                        value={iconName} 
                        onChange={e => setIconName(e.target.value)} 
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                        placeholder="Cpu" 
                    />
                 </div>
              </div>

              {/* Row 2: Start Date & End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Start Date</label>
                    <div className="relative">
                        <input 
                            type="date"
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)} 
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700" 
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">End Date (Optional)</label>
                    <div className="relative">
                        <input 
                             type="date"
                            value={endDate} 
                            onChange={e => setEndDate(e.target.value)} 
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700" 
                        />
                    </div>
                 </div>
              </div>

              {/* Row 3: Price & Cycle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Price</label>
                   <input 
                        value={price} 
                        onChange={e => setPrice(e.target.value)} 
                        type="number" 
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                </div>
                <div>
                   <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-300">Billing Cycle</label>
                   <select value={cycle} onChange={e => setCycle(e.target.value as any)} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                     <option value="Monthly">Monthly</option>
                     <option value="Yearly">Yearly</option>
                   </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-4">
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
                >
                    Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};