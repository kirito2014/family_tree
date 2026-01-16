export type HandleType = 'top' | 'right' | 'bottom' | 'left';
export type LineStyle = 'solid' | 'dashed' | 'dotted';

export interface FamilyMember {
  id: string;
  name: string;
  nameZh?: string;
  role: string; // fallback role
  birthDate?: string;
  deathDate?: string;
  location?: string;
  avatar: string;
  bio?: string;
  gender: 'male' | 'female';
  isSelf?: boolean;
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle: HandleType;
  targetHandle: HandleType;
  label: string;
  labelZh?: string;
  color?: string; // Hex
  lineStyle?: LineStyle; 
}

export type ViewMode = 'tree' | 'directory' | 'settings';

export interface Position {
  x: number;
  y: number;
}

export interface NodePosition extends Position {
  id: string;
}