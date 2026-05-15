'use client';

import React from 'react';
import { PersonaProvider, usePersona, CHAPTERS_BY_PERSONA, type PersonaId, type ChapterId } from '@/lib/persona-context';
import NavigationWrapper from './NavigationWrapper';

function DemoBar() {
  const { activePersona, setActivePersonaId, personas, activeChapter, setActiveChapter } = usePersona();
  const chapters = CHAPTERS_BY_PERSONA[activePersona.id] || [];

  return (
    <div className="demo-bar" style={{ backgroundColor: activePersona.barColor }}>
      <div className="demo-bar-left">
        <div className="demo-bar-label">{activePersona.label}</div>
        <div className="demo-bar-separator" />
        <div className="demo-bar-chapters">
          {chapters.map(ch => (
            <button
              key={ch.id}
              className={`demo-bar-chapter ${activeChapter === ch.id ? 'demo-bar-chapter--active' : ''}`}
              onClick={() => setActiveChapter(ch.id)}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>
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
