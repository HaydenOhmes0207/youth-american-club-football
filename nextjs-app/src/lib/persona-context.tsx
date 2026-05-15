'use client';

import React, { createContext, useContext, useState } from 'react';

export type PersonaId = 'alex' | 'maria';

// Each persona has their own chapters -- they tell independent stories
export type AlexChapterId = 'home' | 'schedule-ingest' | 'communication' | 'external-bookings';
export type MariaChapterId = 'home' | 'registration' | 'game-day' | 'volunteer-coordination';
export type ChapterId = AlexChapterId | MariaChapterId;

export interface Chapter {
  id: ChapterId;
  label: string;
}

export const CHAPTERS_BY_PERSONA: Record<PersonaId, Chapter[]> = {
  alex: [
    { id: 'home', label: 'Home' },
    { id: 'schedule-ingest', label: 'Schedule Ingest' },
    { id: 'communication', label: 'Communication' },
    { id: 'external-bookings', label: 'External Bookings' },
  ],
  maria: [
    { id: 'home', label: 'Home' },
    { id: 'registration', label: 'Registration' },
    { id: 'game-day', label: 'Game Day' },
    { id: 'volunteer-coordination', label: 'Volunteer Coordination' },
  ],
};

export interface Persona {
  id: PersonaId;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  label: string;
  orgName: string;
  orgId: string;
  primaryColor: string;
  secondaryColor: string;
  barColor: string;
  orgAvatar: string;
}

const personas: Record<PersonaId, Persona> = {
  alex: {
    id: 'alex',
    firstName: 'Alex',
    lastName: 'Mitchell',
    email: 'alex.mitchell@lincoln.edu',
    role: 'High School Director',
    label: 'YCHS Group Spotlight - High School Director',
    orgName: 'Lincoln High School',
    orgId: 'org-hs',
    primaryColor: '#1e40af',
    secondaryColor: '#fbbf24',
    barColor: '#1b3a2a',
    orgAvatar: '/images/alex-avatar.png',
  },
  maria: {
    id: 'maria',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@lincolnjr.org',
    role: 'Club Director',
    label: 'YCHS Group Spotlight - Club Director',
    orgName: 'Lincoln Junior Football Club',
    orgId: 'org-club',
    primaryColor: '#16a34a',
    secondaryColor: '#ffffff',
    barColor: '#1a2744',
    orgAvatar: '/images/maria-avatar.png',
  },
};

interface PersonaContextValue {
  activePersona: Persona;
  setActivePersonaId: (id: PersonaId) => void;
  personas: Record<PersonaId, Persona>;
  activeChapter: ChapterId;
  setActiveChapter: (id: ChapterId) => void;
  chapterVersion: number;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<PersonaId>('alex');
  const [activeChapter, setActiveChapterState] = useState<ChapterId>('home');
  const [chapterVersion, setChapterVersion] = useState(0);
  const activePersona = personas[activeId];

  const setActivePersonaId = (id: PersonaId) => {
    setActiveId(id);
    setActiveChapterState('home');
    setChapterVersion(v => v + 1);
  };

  const setActiveChapter = (id: ChapterId) => {
    setActiveChapterState(id);
    setChapterVersion(v => v + 1);
  };

  return (
    <PersonaContext.Provider value={{ activePersona, setActivePersonaId, personas, activeChapter, setActiveChapter, chapterVersion }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
