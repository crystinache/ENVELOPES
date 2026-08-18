
import { LucideIcon } from 'lucide-react';

export type PerformanceObject = {
  id: string;
  name: string;
  iconName: string;
};

export type EnvelopeColor = 'Blue' | 'Red' | 'Green' | 'Yellow';

export type PerformanceState = {
  selectedObjects: PerformanceObject[];
  secretSequence: number[]; // Indices of selectedObjects (0-indexed)
  isPerforming: boolean;
};

export const AVAILABLE_OBJECTS: PerformanceObject[] = [
  { id: 'bottle', name: 'Bottiglia', iconName: 'BottleWine' },
  { id: 'glass', name: 'Bicchiere', iconName: 'GlassWater' },
  { id: 'smartphone', name: 'Smartphone', iconName: 'Smartphone' },
  { id: 'ring', name: 'Anello', iconName: 'Ring' },
  { id: 'watch', name: 'Orologio', iconName: 'Watch' },
  { id: 'keys', name: 'Chiavi', iconName: 'Key' },
  { id: 'glasses', name: 'Occhiali', iconName: 'Glasses' },
  { id: 'pen', name: 'Penna', iconName: 'PenTool' },
  { id: 'candy', name: 'Caramella', iconName: 'Candy' },
  { id: 'fork', name: 'Forchetta', iconName: 'Fork' },
  { id: 'spoon', name: 'Cucchiaio', iconName: 'Spoon' },
  { id: 'knife', name: 'Coltello', iconName: 'Knife' },
  { id: 'cigarettes', name: 'Sigarette', iconName: 'Cigarette' },
  { id: 'lighter', name: 'Accendino', iconName: 'Lighter' },
  { id: 'mug', name: 'Tazza', iconName: 'Mug' },
  { id: 'personal', name: 'PERSONAL OBJECT', iconName: 'None' },
];

export const ENVELOPE_COLORS: EnvelopeColor[] = ['Blue', 'Red', 'Green', 'Yellow'];
export const COLOR_MAP: Record<EnvelopeColor, string> = {
  Blue: '#1e40af',
  Red: '#991b1b',
  Green: '#166534',
  Yellow: '#ca8a04',
};
