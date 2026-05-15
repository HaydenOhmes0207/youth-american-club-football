'use client';

import React from 'react';
import { PersonaProvider, usePersona, type PersonaId } from '@/lib/persona-context';
import NavigationWrapper from './NavigationWrapper';

function DemoBar() {
  const { activePersona, setActivePersonaId, personas } = usePersona();

  return (
    <div className="demo-bar" style={{ backgroundColor: activePersona.barColor }}>
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

export default function DemoShell() {
  return (
    <PersonaProvider>
      <div className="demo-shell">
        <DemoBar />
        <div className="demo-shell-content">
          <NavigationWrapper />
        </div>
      </div>
    </PersonaProvider>
  );
}
