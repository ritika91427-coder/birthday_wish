export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  tag?: string;
  rotation?: number;
}

export interface AppreciationCard {
  id: string;
  title: string;
  message: string;
  iconName: string;
  accentColor: string;
  isRevealed?: boolean;
}

export interface StickyNote {
  id: string;
  text: string;
  author: string;
  color: 'yellow' | 'lavender' | 'peach' | 'mint' | 'cream';
  x: number;
  y: number;
  rotation: number;
}

export interface BirthdayConfig {
  recipientName: string;
  greetingTitle: string;
  letterContent: string;
  photos: MemoryPhoto[];
  appreciationCards: AppreciationCard[];
  stickyNotes: StickyNote[];
}
