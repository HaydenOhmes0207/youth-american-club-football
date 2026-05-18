'use client';

import { usePersona, type PersonaId } from '@/lib/persona-context';
import Image from 'next/image';

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface PersonaLandingProps {
  onSelectPersona: (id: PersonaId) => void;
}

export default function PersonaLanding({ onSelectPersona }: PersonaLandingProps) {
  const { personas } = usePersona();
  const personaList = Object.values(personas);

  return (
    <div className="persona-landing">
      <div className="persona-landing-content">
        {/* Header */}
        <div className="persona-landing-header">
          <div className="persona-landing-logo">
            <Image src="/icons/hudl-logo.svg" alt="Hudl" width={32} height={32} />
            <span className="persona-landing-logo-text">Hudl</span>
          </div>
          <h1 className="persona-landing-title">Director Spotlight Demo</h1>
          <p className="persona-landing-subtitle">Select a persona to continue</p>
        </div>

        {/* Persona Cards */}
        <div className="persona-landing-cards">
          {personaList.map((persona) => (
            <button
              key={persona.id}
              className="persona-card"
              onClick={() => onSelectPersona(persona.id)}
            >
              <div className="persona-card-avatar">
                <Image
                  src={persona.orgAvatar}
                  alt={`${persona.firstName} ${persona.lastName}`}
                  width={56}
                  height={56}
                  className="persona-card-avatar-img"
                />
              </div>
              <div className="persona-card-info">
                <h3 className="persona-card-name">{persona.firstName} {persona.lastName}</h3>
                <p className="persona-card-role">{persona.role}</p>
                <p className="persona-card-description">{persona.description}</p>
              </div>
              <div className="persona-card-chevron">
                <ChevronRight />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="persona-landing-footer">No password required — this is a demo environment</p>
      </div>
    </div>
  );
}
