'use client';

import React, { useState } from 'react';
import { PersonaProvider, usePersona, CHAPTERS_BY_PERSONA, type PersonaId, type ChapterId } from '@/lib/persona-context';
import NavigationWrapper from './NavigationWrapper';
import PersonaLanding from './PersonaLanding';

function DemoBar() {
  const { activePersona, activeChapter, setActiveChapter } = usePersona();
  const chapters = CHAPTERS_BY_PERSONA[activePersona.id] || [];

  return (
    <div className="demo-bar" style={{ backgroundColor: activePersona.barColor }}>
      <div className="demo-bar-label">{activePersona.label}</div>
      <div className="demo-bar-segments">
        {chapters.map(ch => (
          <button
            key={ch.id}
            className={`demo-bar-segment ${activeChapter === ch.id ? 'demo-bar-segment-active' : ''}`}
            onClick={() => setActiveChapter(ch.id)}
          >
            {ch.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoShellInner({ onBackToLanding }: { onBackToLanding: () => void }) {
  const { activePersona } = usePersona();

  return (
    <div className="demo-shell" style={{ backgroundColor: activePersona.barColor }}>
      <DemoBar />
      <div className="demo-shell-content">
        <NavigationWrapper onBackToLanding={onBackToLanding} />
      </div>
    </div>
  );
}

function DemoShellWithLanding() {
  const [showLanding, setShowLanding] = useState(true);
  const { setActivePersonaId } = usePersona();

  const handleSelectPersona = (id: PersonaId) => {
    setActivePersonaId(id);
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  if (showLanding) {
    return <PersonaLanding onSelectPersona={handleSelectPersona} />;
  }

  return <DemoShellInner onBackToLanding={handleBackToLanding} />;
}

export default function DemoShell() {
  return (
    <PersonaProvider>
      <DemoShellWithLanding />
    </PersonaProvider>
  );
}
