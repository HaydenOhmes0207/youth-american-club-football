'use client';

import React from 'react';
import { PersonaProvider, usePersona, CHAPTERS_BY_PERSONA, type PersonaId, type ChapterId } from '@/lib/persona-context';
import NavigationWrapper from './NavigationWrapper';

function DemoBar() {
  const { activePersona, setActivePersonaId, personas, activeChapter, setActiveChapter } = usePersona();
  const chapters = CHAPTERS_BY_PERSONA[activePersona.id] || [];

  return (
    <div className="demo-bar" style={{ backgroundColor: activePersona.barColor }}>
      <div className="demo-bar-label">{activePersona.label}</div>
      <div className="demo-bar-selects">
        <select
          className="demo-bar-select"
          value={activePersona.id}
          onChange={(e) => setActivePersonaId(e.target.value as PersonaId)}
        >
          {(Object.keys(personas) as PersonaId[]).map((id) => (
            <option key={id} value={id}>{personas[id].firstName}</option>
          ))}
        </select>
        <select
          className="demo-bar-select"
          value={activeChapter}
          onChange={(e) => setActiveChapter(e.target.value as ChapterId)}
        >
          {chapters.map(ch => (
            <option key={ch.id} value={ch.id}>{ch.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function DemoShellInner() {
  const { activePersona } = usePersona();

  return (
    <div className="demo-shell" style={{ backgroundColor: activePersona.barColor }}>
      <DemoBar />
      <div className="demo-shell-content">
        <NavigationWrapper />
      </div>
    </div>
  );
}

export default function DemoShell() {
  return (
    <PersonaProvider>
      <DemoShellInner />
    </PersonaProvider>
  );
}
