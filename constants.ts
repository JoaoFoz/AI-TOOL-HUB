import { User, Tool } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ana Silva', avatarUrl: 'https://picsum.photos/seed/u1/200/200' },
  { id: 'u2', name: 'Bruno Santos', avatarUrl: 'https://picsum.photos/seed/u2/200/200' },
  { id: 'u3', name: 'Carla Dias', avatarUrl: 'https://picsum.photos/seed/u3/200/200' },
  { id: 'u4', name: 'Diogo Costa', avatarUrl: 'https://picsum.photos/seed/u4/200/200' },
  { id: 'u5', name: 'Elena Sousa', avatarUrl: 'https://picsum.photos/seed/u5/200/200' },
  { id: 'u6', name: 'Fabio Lima', avatarUrl: 'https://picsum.photos/seed/u6/200/200' },
  { id: 'u7', name: 'Gisela Novo', avatarUrl: 'https://picsum.photos/seed/u7/200/200' },
  { id: 'u8', name: 'Hugo Vale', avatarUrl: 'https://picsum.photos/seed/u8/200/200' },
  { id: 'u9', name: 'Ines Pires', avatarUrl: 'https://picsum.photos/seed/u9/200/200' },
  { id: 'u10', name: 'Joao Cruz', avatarUrl: 'https://picsum.photos/seed/u10/200/200' },
];

export const INITIAL_TOOLS: Tool[] = [
  { id: 't1', name: 'GPT-4 Turbo', color: '#3b82f6', description: 'High reasoning model' }, // Blue
  { id: 't2', name: 'Midjourney V6', color: '#06b6d4', description: 'Image generation' }, // Cyan
  { id: 't3', name: 'Claude 3 Opus', color: '#f97316', description: 'Large context window' }, // Orange
  { id: 't4', name: 'Gemini Pro', color: '#10b981', description: 'Google Multimodal' }, // Emerald
];

export const HOURS_OF_OPERATION = {
  start: 5, // 05:00
  end: 24, // 24:00
};