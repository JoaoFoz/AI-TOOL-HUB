import React, { useState } from 'react';
import { Tool } from '../types';
import { Plus, Trash2, Tag } from 'lucide-react';

interface ToolManagerProps {
  tools: Tool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (toolId: string) => void;
}

const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#f43f5e', // Rose
];

export const ToolManager: React.FC<ToolManagerProps> = ({ tools, onAddTool, onRemoveTool }) => {
  const [newToolName, setNewToolName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[6]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;

    const newTool: Tool = {
      id: crypto.randomUUID(),
      name: newToolName,
      color: selectedColor,
      description: 'Custom Tool',
    };

    onAddTool(newTool);
    setNewToolName('');
    setSelectedColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Gerir Ferramentas IA
        </h2>
        <p className="text-sm text-gray-500 mt-1">Adicione novas ferramentas e atribua cores para o calendário.</p>
      </div>

      <div className="p-6">
        {/* Add New Tool Form */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 mb-8 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Ferramenta</label>
            <input
              type="text"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              placeholder="Ex: Claude 3, Midjourney..."
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
            <div className="flex gap-2 flex-wrap max-w-[200px]">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </form>

        {/* Existing Tools List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow group bg-white"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-12 rounded-full"
                  style={{ backgroundColor: tool.color }}
                />
                <span className="font-semibold text-gray-800">{tool.name}</span>
              </div>
              <button
                onClick={() => onRemoveTool(tool.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="Remover ferramenta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};