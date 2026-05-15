'use client';

import React, { createContext, useContext, useState } from 'react';

export type PersonaId = 'alex' | 'maria';

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
    barColor: '#2d4a3e',
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
    barColor: '#1e293b',
  },
};

interface PersonaContextValue {
  activePersona: Persona;
  setActivePersonaId: (id: PersonaId) => void;
  personas: Record<PersonaId, Persona>;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<PersonaId>('alex');
  const activePersona = personas[activeId];

  return (
    <PersonaContext.Provider value={{ activePersona, setActivePersonaId: setActiveId, personas }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
