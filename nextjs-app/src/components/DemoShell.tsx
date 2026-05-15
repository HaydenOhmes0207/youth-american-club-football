'use client';

import React from 'react';
import { PersonaProvider, usePersona, type PersonaId } from '@/lib/persona-context';
import NavigationWrapper from './NavigationWrapper';

function DemoBar() {
  const { activePersona, setActivePersonaId, personas } = usePersona();

  return (
    <div className="demo-bar">
      <div className="demo-bar-label">{activePersona.label}</div>
      <div className="demo-bar-personas">
        {(Object.keys(personas) as PersonaId[]).map((id) => {
          const persona = personas[id];
          const isActive = activePersona.id === id;
          return (
            <button
              key={id}
              className={`demo-bar-persona ${isActive ? 'demo-bar-persona--active' : ''}`}
              onClick={() => setActivePersonaId(id)}
            >
              {persona.firstName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <div className="demo-shell">
        <DemoBar />
        <div className="demo-shell-content">
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </div>
      </div>
    </PersonaProvider>
  );
}
