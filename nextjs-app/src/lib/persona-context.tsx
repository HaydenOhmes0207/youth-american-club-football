'use client';

import React, { createContext, useContext, useState } from 'react';

export type PersonaId = 'alex' | 'maria';

// Each persona has their own chapters -- they tell independent stories
export type AlexChapterId = 'home' | 'schedule-ingest' | 'communication' | 'external-bookings';
export type MariaChapterId = 'home' | 'operations' | 'communication' | 'booking-request';
export type ChapterId = AlexChapterId | MariaChapterId;

export interface Chapter {
  id: ChapterId;
  label: string;
}

export const CHAPTERS_BY_PERSONA: Record<PersonaId, Chapter[]> = {
  alex: [
    { id: 'home', label: 'Chapter 1: Home' },
    { id: 'schedule-ingest', label: 'Chapter 2: Schedule' },
    { id: 'communication', label: 'Chapter 3: Communication' },
    { id: 'external-bookings', label: 'Chapter 4: Bookings' },
  ],
  maria: [
    { id: 'home', label: 'Chapter 1: Home' },
    { id: 'operations', label: 'Chapter 2: Operations' },
    { id: 'communication', label: 'Chapter 3: Communication' },
    { id: 'booking-request', label: 'Chapter 4: Booking Request' },
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
  description: string;
}

const personas: Record<PersonaId, Persona> = {
  alex: {
    id: 'alex',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@lincoln.edu',
    role: 'Athletic Director — Lincoln High School',
    label: 'Director Spotlight Demo — High School Athletic Director',
    orgName: 'Lincoln High School',
    orgId: 'org-hs',
    primaryColor: '#1e40af',
    secondaryColor: '#fbbf24',
    barColor: '#1b3a2a',
    orgAvatar: '/images/alex-avatar.png',
    description: 'Sarah is a high school athletic director at a mid-sized school. She manages 18 facilities and coordinates schedules across multiple sports.',
  },
  maria: {
    id: 'maria',
    firstName: 'Jeff',
    lastName: 'Rodriguez',
    email: 'jeff.rodriguez@lincolnjr.org',
    role: 'Club Director — Lincoln Junior Football Club',
    label: 'Director Spotlight Demo — Club Director',
    orgName: 'Lincoln Junior Football Club',
    orgId: 'org-club',
    primaryColor: '#16a34a',
    secondaryColor: '#ffffff',
    barColor: '#1a2744',
    orgAvatar: '/images/maria-avatar.png',
    description: 'Jeff is a youth football club director managing 40 teams across football and cheer. He coordinates facilities and manages a robust registration pipeline.',
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
