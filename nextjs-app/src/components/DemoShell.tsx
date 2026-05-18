'use client';

import React, { useState } from 'react';
import { PersonaProvider, usePersona, CHAPTERS_BY_PERSONA, type PersonaId, type ChapterId } from '@/lib/persona-context';
import NavigationWrapper from './NavigationWrapper';
import PersonaLanding from './PersonaLanding';

function DemoBar() {
  const { activePersona, activeChapter, setActiveChapter } = usePersona();
  const chapters = CHAPTERS_BY_PERSONA[activePersona.id] || [];

  // Extract the role part after the dash (e.g., "High School Athletic Director" from "Director Spotlight Demo — High School Athletic Director")
  const roleLabel = activePersona.displayRole.split('—')[0]?.trim() || activePersona.displayRole;

  return (
    <div className="demo-bar" style={{ backgroundColor: activePersona.barColor }}>
      <div className="demo-bar-left">Director Spotlight Demo</div>
      <div className="demo-bar-center">
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
      <div className="demo-bar-right">{roleLabel}</div>
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
