'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Checkbox from './Checkbox';
import { useToast } from './Toast';
import type { CalendarEvent } from './CalendarView';
import { SPORT_COLORS, alexOpponents } from './CalendarView';

// ---- Types ----
interface ImportEvent extends CalendarEvent {
  opponent: string;
  isHome: boolean;
  facility: string;
  hasStream: boolean;
  hasTickets: boolean;
  hasCameras: boolean;
}

interface SportSection {
  sport: string;
  label: string;
  color: string;
  events: ImportEvent[];
}

type Phase = 'choose' | 'paste' | 'agent' | 'review';

// ---- Generate demo events (same data that was removed from CalendarView) ----
function generateImportEvents(): SportSection[] {
  const C = SPORT_COLORS;
  const fallStart = new Date(2026, 7, 28);
  const fallEnd = new Date(2026, 10, 28);

  // Football: 9 Friday night games
  const fbEvents: ImportEvent[] = [];
  const fd = new Date(fallStart);
  while (fd.getDay() !== 5) fd.setDate(fd.getDate() + 1);
  for (let g = 0; g < 9 && fd <= fallEnd; g++) {
    const opp = alexOpponents[g % alexOpponents.length];
    const home = g % 2 === 0;
    fbEvents.push({
      id: `import-fb-${g}`,
      title: `Football vs. ${opp}`,
      date: new Date(fd),
      time: '7:00 PM',
      endTime: '9:30 PM',
      sport: 'Football',
      type: 'game',
      location: home ? 'Memorial Stadium' : `${opp} HS`,
      color: C['Football'],
      opponent: opp,
      isHome: home,
      facility: home ? 'Memorial Stadium' : `${opp} HS`,
      hasStream: home,
      hasTickets: home,
      hasCameras: home,
    });
    fd.setDate(fd.getDate() + 7);
  }

  // Volleyball: weekly Tuesday matches + tournament
  const vbEvents: ImportEvent[] = [];
  const vbMatchEnd = new Date(2026, 10, 7);
  const vt = new Date(fallStart);
  while (vt.getDay() !== 2) vt.setDate(vt.getDate() + 1);
  let vbI = 0;
  while (vt <= vbMatchEnd) {
    const opp = alexOpponents[(vbI + 5) % alexOpponents.length];
    const home = vbI % 2 === 0;
    vbEvents.push({
      id: `import-vb-${vbI}`,
      title: `Volleyball vs. ${opp}`,
      date: new Date(vt),
      time: '6:00 PM',
      endTime: '8:00 PM',
      sport: 'Girls Volleyball',
      type: 'game',
      location: home ? 'Main Gym' : `${opp} HS`,
      color: C['Girls Volleyball'],
      opponent: opp,
      isHome: home,
      facility: home ? 'Main Gym' : `${opp} HS`,
      hasStream: home,
      hasTickets: home,
      hasCameras: home,
    });
    vt.setDate(vt.getDate() + 7);
    vbI++;
  }
  // Tournament
  vbEvents.push({
    id: 'import-vb-tourney',
    title: 'Volleyball - Heartland Tournament',
    date: new Date(2026, 9, 10),
    time: '8:00 AM',
    endTime: '5:00 PM',
    sport: 'Girls Volleyball',
    type: 'game',
    location: 'Main Gym',
    color: C['Girls Volleyball'],
    opponent: 'Multiple',
    isHome: true,
    facility: 'Main Gym',
    hasStream: true,
    hasTickets: true,
    hasCameras: true,
  });

  // Soccer: biweekly Tuesday
  const socEvents: ImportEvent[] = [];
  const socEnd = new Date(2026, 9, 24);
  const st2 = new Date(fallStart);
  while (st2.getDay() !== 2) st2.setDate(st2.getDate() + 1);
  let socI = 0;
  while (socI < 8 && st2 <= socEnd) {
    const opp = alexOpponents[(socI + 3) % alexOpponents.length];
    const home = socI % 2 === 0;
    socEvents.push({
      id: `import-soc-${socI}`,
      title: `Boys Soccer vs. ${opp}`,
      date: new Date(st2),
      time: '4:30 PM',
      endTime: '6:30 PM',
      sport: 'Boys Soccer',
      type: 'game',
      location: home ? 'Soccer Complex' : `${opp} HS`,
      color: C['Boys Soccer'],
      opponent: opp,
      isHome: home,
      facility: home ? 'Soccer Complex' : `${opp} HS`,
      hasStream: home,
      hasTickets: home,
      hasCameras: home,
    });
    st2.setDate(st2.getDate() + 14);
    socI++;
  }

  return [
    { sport: 'Football', label: 'Football', color: C['Football'], events: fbEvents },
    { sport: 'Girls Volleyball', label: 'Girls Volleyball', color: C['Girls Volleyball'], events: vbEvents },
    { sport: 'Boys Soccer', label: 'Boys Soccer', color: C['Boys Soccer'], events: socEvents },
  ];
}

// ---- Agent log entries ----
const AGENT_LOG: { text: string; type: 'working' | 'found' | 'done' }[] = [
  { text: 'Connecting to nsaa-schedule.org...', type: 'working' },
  { text: 'Parsing district schedule page...', type: 'working' },
  { text: 'Found 28 games across 3 sports for Lincoln East', type: 'found' },
  { text: 'Identifying Football schedule... found 9 games', type: 'found' },
  { text: 'Identifying Girls Volleyball schedule... found 11 matches', type: 'found' },
  { text: 'Identifying Boys Soccer schedule... found 8 matches', type: 'found' },
  { text: 'Mapping home games to facilities...', type: 'working' },
  { text: 'Memorial Stadium assigned to Football (5 home games)', type: 'found' },
  { text: 'Main Gym assigned to Volleyball (6 home matches)', type: 'found' },
  { text: 'Soccer Complex assigned to Boys Soccer (4 home matches)', type: 'found' },
  { text: 'Setting up live streams for home events...', type: 'working' },
  { text: 'Configuring ticketed events for home games...', type: 'working' },
  { text: 'Linking cameras for 15 home events...', type: 'working' },
  { text: 'Schedule ready for review', type: 'done' },
];

// ---- Format helpers ----
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatEventDate(date: Date): string {
  return `${SHORT_DAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

// ---- Component ----
interface ScheduleImportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (events: CalendarEvent[]) => void;
}

export default function ScheduleImportPanel({ isOpen, onClose, onImport }: ScheduleImportPanelProps) {
  const [phase, setPhase] = useState<Phase>('choose');
  const [logEntries, setLogEntries] = useState<number>(0);
  const [sections, setSections] = useState<SportSection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const logRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Reset state when panel opens
  useEffect(() => {
    if (isOpen) {
      setPhase('choose');
      setLogEntries(0);
      setSections([]);
      setSelected(new Set());
    }
  }, [isOpen]);

  // Agent log streaming
  useEffect(() => {
    if (phase !== 'agent') return;
    if (logEntries >= AGENT_LOG.length) {
      // Done — generate events and move to review
      const timer = setTimeout(() => {
        const generatedSections = generateImportEvents();
        setSections(generatedSections);
        // Select all by default
        const allIds = new Set<string>();
        generatedSections.forEach(s => s.events.forEach(e => allIds.add(e.id)));
        setSelected(allIds);
        setPhase('review');
      }, 600);
      return () => clearTimeout(timer);
    }

    const delay = logEntries === 0 ? 300 : (400 + Math.random() * 400);
    const timer = setTimeout(() => {
      setLogEntries(prev => prev + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, logEntries]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);

  const handleStartImport = useCallback(() => {
    setLogEntries(0);
    setPhase('agent');
  }, []);

  const toggleEvent = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSportAll = useCallback((section: SportSection) => {
    setSelected(prev => {
      const next = new Set(prev);
      const allSelected = section.events.every(e => next.has(e.id));
      if (allSelected) {
        section.events.forEach(e => next.delete(e.id));
      } else {
        section.events.forEach(e => next.add(e.id));
      }
      return next;
    });
  }, []);

  const handleApprove = useCallback(() => {
    const eventsToAdd: CalendarEvent[] = [];
    sections.forEach(section => {
      section.events.forEach(evt => {
        if (selected.has(evt.id)) {
          eventsToAdd.push({
            id: evt.id,
            title: evt.title,
            date: evt.date,
            time: evt.time,
            endTime: evt.endTime,
            sport: evt.sport,
            type: evt.type,
            location: evt.location,
            color: evt.color,
          });
        }
      });
    });
    onImport(eventsToAdd);
    showToast(`${eventsToAdd.length} events added to your calendar`, 'success');
    onClose();
  }, [sections, selected, onImport, onClose, showToast]);

  const selectedCount = selected.size;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="import-panel-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="import-panel">
        {/* Header */}
        <div className="import-panel-header">
          <h2 className="import-panel-title">Add Event</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="import-panel-body">
          {/* Phase: Choose method */}
          {phase === 'choose' && (
            <div className="import-phase-choose">
              <button className="import-method-card import-method-card--ai" onClick={() => setPhase('paste')}>
                <div className="import-method-icon import-method-icon--ai">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="import-method-text">
                  <span className="import-method-label">AI-Assisted Schedule Import</span>
                  <span className="import-method-desc">Paste a link to your district schedule and let Hudl AI find and import your games automatically.</span>
                </div>
                <svg className="import-method-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="import-method-card import-method-card--manual" disabled>
                <div className="import-method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="import-method-text">
                  <span className="import-method-label">Add Manually</span>
                  <span className="import-method-desc">Create an event by filling in the details yourself.</span>
                </div>
                <svg className="import-method-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          )}

          {/* Phase: Paste URL */}
          {phase === 'paste' && (
            <div className="import-phase-paste">
              <div className="import-paste-header">
                <button className="import-back-btn" onClick={() => setPhase('choose')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back
                </button>
              </div>
              <div className="import-paste-content">
                <div className="import-paste-label">Paste your district schedule URL</div>
                <div className="import-paste-sublabel">Hudl AI will parse the page, find games for your teams, map facilities, and configure streaming.</div>
                <input
                  className="import-paste-input"
                  type="url"
                  defaultValue="https://www.nsaa-schedule.org/district/lincoln-east/fall-2026"
                  readOnly
                />
                <button className="import-paste-submit" onClick={handleStartImport}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Import Schedule
                </button>
              </div>
            </div>
          )}

          {/* Phase: Agent streaming log */}
          {phase === 'agent' && (
            <div className="import-phase-agent">
              <div className="import-agent-header">
                <div className="import-agent-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1L1 5.5l9 4.5 9-4.5L10 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 14.5l9 4.5 9-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 10l9 4.5 9-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="import-agent-title">Hudl AI is importing your schedule</span>
              </div>
              <div className="import-agent-log" ref={logRef}>
                {AGENT_LOG.slice(0, logEntries).map((entry, i) => (
                  <div
                    key={i}
                    className={`import-log-entry import-log-entry--${entry.type} ${i === logEntries - 1 ? 'import-log-entry--latest' : ''}`}
                  >
                    <span className={`import-log-dot import-log-dot--${entry.type}`} />
                    <span className="import-log-text">{entry.text}</span>
                  </div>
                ))}
                {logEntries < AGENT_LOG.length && (
                  <div className="import-log-entry import-log-entry--thinking">
                    <span className="import-log-spinner" />
                    <span className="import-log-text import-log-text--dim">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phase: Review & Approve */}
          {phase === 'review' && (
            <div className="import-phase-review">
              <div className="import-review-summary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Found {sections.reduce((sum, s) => sum + s.events.length, 0)} events across {sections.length} sports</span>
              </div>

              {sections.map(section => {
                const sectionSelected = section.events.filter(e => selected.has(e.id)).length;
                const allSelected = sectionSelected === section.events.length;
                const someSelected = sectionSelected > 0 && !allSelected;

                return (
                  <div key={section.sport} className="import-sport-section">
                    <div className="import-sport-header">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={() => toggleSportAll(section)}
                      />
                      <span className="import-sport-dot" style={{ background: section.color }} />
                      <span className="import-sport-label">{section.label}</span>
                      <span className="import-sport-count">{section.events.length} events</span>
                    </div>
                    <div className="import-event-list">
                      {section.events.map(evt => (
                        <div key={evt.id} className={`import-event-row ${selected.has(evt.id) ? 'import-event-row--selected' : ''}`}>
                          <div className="import-event-row-top">
                            <Checkbox
                              checked={selected.has(evt.id)}
                              onChange={() => toggleEvent(evt.id)}
                            />
                            <span className="import-event-date">{formatEventDate(evt.date)}</span>
                            <span className="import-event-title">{evt.isHome ? 'vs.' : '@'} {evt.opponent}</span>
                            <span className="import-event-time">{evt.time}</span>
                          </div>
                          <div className="import-event-row-meta">
                            <span className="import-event-badge import-event-badge--facility">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 4h10M3 1h6a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                              {evt.facility}
                            </span>
                            {evt.hasStream && (
                              <span className="import-event-badge import-event-badge--stream">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3.5v5l3-2.5 2 1.5 2-2 3 3V3.5a1 1 0 00-1-1H2a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Live Stream
                              </span>
                            )}
                            {evt.hasTickets && (
                              <span className="import-event-badge import-event-badge--tickets">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l1-2h6l1 2M2 4v5a1 1 0 001 1h6a1 1 0 001-1V4M2 4h8M5 7h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                                Tickets
                              </span>
                            )}
                            {evt.hasCameras && (
                              <span className="import-event-badge import-event-badge--cameras">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1"/><path d="M1 4a1 1 0 011-1h1l1-1h4l1 1h1a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1"/></svg>
                                Cameras
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer (review phase only) */}
        {phase === 'review' && (
          <div className="import-panel-footer">
            <button
              className="import-approve-btn"
              onClick={handleApprove}
              disabled={selectedCount === 0}
            >
              Add {selectedCount} {selectedCount === 1 ? 'Event' : 'Events'} to Calendar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
