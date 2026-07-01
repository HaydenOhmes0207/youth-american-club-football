'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import ProgramsTable from '@/components/ProgramsTable';
import type { ProgramWithStats } from '@/lib/actions/programs';

interface ProgramsPageClientProps {
  programs: ProgramWithStats[];
}

export default function ProgramsPageClient({ programs }: ProgramsPageClientProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%' }}>

        {/* Title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
          <h1 style={{
            fontFamily: 'var(--u-font-body)',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '1.2',
            letterSpacing: '0.25px',
            color: 'var(--u-color-base-foreground-contrast, #071c31)',
            margin: 0,
          }}>
            Programs
          </h1>
          <p style={{
            fontFamily: 'var(--u-font-body)',
            fontSize: '14px',
            color: 'var(--u-color-base-foreground, #36485c)',
            margin: 0,
          }}>
            Manage your registration programs, seasons, and events.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Button
            buttonStyle="standard"
            buttonType="primary"
            size="medium"
            onClick={() => router.push('/programs/new')}
          >
            New Program
          </Button>

          {/* Ellipsis ⋯ */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              className={`prog-ellipsis ${menuOpen ? 'prog-ellipsis--open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More actions"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="13" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="prog-dropdown">
                <button
                  className="prog-dropdown-item"
                  onClick={() => { setMenuOpen(false); router.push('/programs/transfer'); }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8a4 4 0 0 1 6.6-3.1M12 8a4 4 0 0 1-6.6 3.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10.6 3.2l2 1.8-2.1 1.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.4 12.8l-2-1.8 2.1-1.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Transfer Teams to New Season
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProgramsTable programs={programs} />

      {/* Scoped only to ellipsis + dropdown — no layout class names that could collide */}
      <style jsx>{`
        .prog-ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 4px;
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          flex-shrink: 0;
        }
        .prog-ellipsis:hover,
        .prog-ellipsis--open {
          background: var(--u-color-background-canvas, #eff0f0);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }
        .prog-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 224px;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 4px;
        }
        .prog-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          background: none;
          border: none;
          border-radius: 5px;
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          text-align: left;
          white-space: nowrap;
          transition: background 0.1s ease;
        }
        .prog-dropdown-item:hover {
          background: var(--u-color-background-canvas, #eff0f0);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
      `}</style>
    </div>
  );
}
