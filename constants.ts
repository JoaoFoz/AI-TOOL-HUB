import { User, Tool } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ana Silva', avatarUrl: 'https://picsum.photos/seed/u1/200/200', role: 'Admin', initials: 'AS' },
  { id: 'u2', name: 'Bruno Santos', avatarUrl: 'https://picsum.photos/seed/u2/200/200', role: 'Member', initials: 'BS' },
  { id: 'u3', name: 'Carla Dias', avatarUrl: 'https://picsum.photos/seed/u3/200/200', role: 'Member', initials: 'CD' },
  { id: 'u4', name: 'Diogo Costa', avatarUrl: 'https://picsum.photos/seed/u4/200/200', role: 'Member', initials: 'DC' },
  { id: 'u5', name: 'Elena Sousa', avatarUrl: 'https://picsum.photos/seed/u5/200/200', role: 'Member', initials: 'ES' },
  { id: 'u6', name: 'Fabio Lima', avatarUrl: 'https://picsum.photos/seed/u6/200/200', role: 'Member', initials: 'FL' },
  { id: 'u7', name: 'Gisela Novo', avatarUrl: 'https://picsum.photos/seed/u7/200/200', role: 'Member', initials: 'GN' },
  { id: 'u8', name: 'Hugo Vale', avatarUrl: 'https://picsum.photos/seed/u8/200/200', role: 'Member', initials: 'HV' },
  { id: 'u9', name: 'Ines Pires', avatarUrl: 'https://picsum.photos/seed/u9/200/200', role: 'Member', initials: 'IP' },
  { id: 'u10', name: 'Joao Cruz', avatarUrl: 'https://picsum.photos/seed/u10/200/200', role: 'Member', initials: 'JC' },
];

export const INITIAL_TOOLS: Tool[] = [
  { id: 't1', name: 'GPT-4 Turbo', color: '#3b82f6', description: 'High reasoning model', nature: 'LLM / Chat' }, // Blue
  { id: 't2', name: 'Midjourney V6', color: '#06b6d4', description: 'Image generation', nature: 'Text-to-Image' }, // Cyan
  { id: 't3', name: 'Claude 3 Opus', color: '#f97316', description: 'Large context window', nature: 'LLM / Chat' }, // Orange
  { id: 't4', name: 'Gemini Pro', color: '#10b981', description: 'Google Multimodal', nature: 'Multimodal' }, // Emerald
  { id: 't5', name: 'DALL-E 3', color: '#ec4899', description: 'Simple image gen', nature: 'Text-to-Image' }, // Pink
  { id: 't6', name: 'Github Copilot', color: '#6366f1', description: 'Code completion', nature: 'Code Assistant' }, // Indigo
  { id: 't7', name: 'Perplexity', color: '#14b8a6', description: 'Search engine', nature: 'AI Search' }, // Teal
  { id: 't8', name: 'Jasper', color: '#8b5cf6', description: 'Marketing copy', nature: 'Copywriting' }, // Violet
  { id: 't9', name: 'Runway Gen-2', color: '#eab308', description: 'Video generation', nature: 'Text-to-Video' }, // Yellow
  { id: 't10', name: 'ElevenLabs', color: '#ef4444', description: 'Voice synthesis', nature: 'Text-to-Speech' }, // Red
];

export const HOURS_OF_OPERATION = {
  start: 8, // 08:00
  end: 20, // 20:00
};