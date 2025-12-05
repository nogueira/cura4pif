export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface WeightRecord {
  id: string;
  weight: number;
  date: string;
  unit: 'kg' | 'lbs';
}

export interface Cat {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  gender: 'Macho' | 'Fêmea';
  neutered: boolean;
  weight: number;
  goalWeight: number;
  image: string;
  activityLevel: 'Baixo' | 'Médio' | 'Alto';
  weightHistory: WeightRecord[];
  trend?: 'up' | 'down' | 'stable';
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'vaccine' | 'consultation' | 'medication';
  petId: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface UpdateItem {
  title: string;
  date: string;
  description: string;
  type: 'feature' | 'improvement' | 'fix' | 'announcement';
}