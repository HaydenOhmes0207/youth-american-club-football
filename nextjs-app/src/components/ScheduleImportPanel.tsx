'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './Toast';
import type { CalendarEvent } from './CalendarView';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SPORT_COLORS, alexOpponents } from './CalendarView';

// ---- Types ----
interface ImportEvent extends CalendarEvent {
  opponent: string;
  isHome: boolean;
  facility: string;
  hasStream: boolean;
  hasTickets: boolean;
  hasCameras: boolean;
  status: 'pending' | 'accepted' | 'rejected';
}

interface SportSection {
  sport: string;
  teamName: string;
  color: string;
  events: ImportEvent[];
}

type Phase = 'choose' | 'paste' | 'agent' | 'review';

/** Pre-built fall schedule events for chapters that assume import already happened */
export function getFallScheduleEvents(): CalendarEvent[] {
  const sections = generateImportEvents(true, true, true);
  return sections.flatMap(s => s.events.map((ev): CalendarEvent => ({
    id: ev.id, title: ev.title, date: ev.date, time: ev.time,
    endTime: ev.endTime, sport: ev.sport, type: ev.type,
    location: ev.location, color: ev.color,
  })));
}

// Facility options for the edit view
const FACILITY_OPTIONS: Record<string, string[]> = {
  'Football': ['Memorial Stadium', 'Practice Field A', 'Practice Field B', 'Fieldhouse'],
  'Girls Volleyball': ['Main Gym', 'Auxiliary Gym', 'Fieldhouse'],
  'Boys Soccer': ['Soccer Complex', 'Practice Field A', 'Memorial Stadium'],
};

// ---- Generate demo events ----
function generateImportEvents(tickets: boolean, streaming: boolean, focus: boolean): SportSection[] {
  const C = SPORT_COLORS;
  const fallStart = new Date(2026, 7, 28);
  const fallEnd = new Date(2026, 10, 28);

  // Football: 9 Friday night games (home pattern: away, HOME, away, home, away, home, away, home, away)
  // Sep 4 is week 2 (g=1), must be home
  const fbHomePattern = [false, true, false, true, false, true, false, true, false];
  const fbEvents: ImportEvent[] = [];
  const fd = new Date(fallStart);
  while (fd.getDay() !== 5) fd.setDate(fd.getDate() + 1);
  for (let g = 0; g < 9 && fd <= fallEnd; g++) {
    const opp = alexOpponents[g % alexOpponents.length];
    const home = fbHomePattern[g];
    fbEvents.push({
      id: `import-fb-${g}`, title: `Varsity Football vs. ${opp}`,
      date: new Date(fd), time: '7:00 PM', endTime: '9:30 PM',
      sport: 'Football', type: 'game',
      location: home ? 'Memorial Stadium' : `${opp} HS`, color: C['Football'],
      opponent: opp, isHome: home, facility: home ? 'Memorial Stadium' : `${opp} HS`,
      hasStream: home && streaming, hasTickets: home && tickets, hasCameras: home && focus, status: 'pending',
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
      id: `import-vb-${vbI}`, title: `Varsity Girls Volleyball vs. ${opp}`,
      date: new Date(vt), time: '6:00 PM', endTime: '8:00 PM',
      sport: 'Girls Volleyball', type: 'game',
      location: home ? 'Main Gym' : `${opp} HS`, color: C['Girls Volleyball'],
      opponent: opp, isHome: home, facility: home ? 'Main Gym' : `${opp} HS`,
      hasStream: home && streaming, hasTickets: home && tickets, hasCameras: home && focus, status: 'pending',
    });
    vt.setDate(vt.getDate() + 7);
    vbI++;
  }
  vbEvents.push({
    id: 'import-vb-tourney', title: 'Varsity Girls Volleyball - Heartland Tournament',
    date: new Date(2026, 9, 10), time: '8:00 AM', endTime: '5:00 PM',
    sport: 'Girls Volleyball', type: 'game',
    location: 'Main Gym', color: C['Girls Volleyball'],
    opponent: 'Multiple', isHome: true, facility: 'Main Gym',
    hasStream: streaming, hasTickets: tickets, hasCameras: focus, status: 'pending',
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
      id: `import-soc-${socI}`, title: `Varsity Boys Soccer vs. ${opp}`,
      date: new Date(st2), time: '4:30 PM', endTime: '6:30 PM',
      sport: 'Boys Soccer', type: 'game',
      location: home ? 'Soccer Complex' : `${opp} HS`, color: C['Boys Soccer'],
      opponent: opp, isHome: home, facility: home ? 'Soccer Complex' : `${opp} HS`,
      hasStream: home && streaming, hasTickets: home && tickets, hasCameras: home && focus, status: 'pending',
    });
    st2.setDate(st2.getDate() + 7);
    socI++;
  }
  // Friday Sep 4 home match (rescheduled from rain-out)
  socEvents.push({
    id: 'import-soc-fri', title: 'Varsity Boys Soccer vs. Papillion Hawks',
    date: new Date(2026, 8, 4), time: '4:30 PM', endTime: '6:30 PM',
    sport: 'Boys Soccer', type: 'game',
    location: 'Soccer Complex', color: C['Boys Soccer'],
    opponent: 'Papillion Hawks', isHome: true, facility: 'Soccer Complex',
    hasStream: streaming, hasTickets: tickets, hasCameras: focus, status: 'pending',
  });

  // Cross Country: Saturday meets — unique names, one home meet
  const xcMeets: { name: string; location: string; isHome: boolean }[] = [
    { name: 'Pioneers Park Twilight', location: 'Pioneers Park', isHome: false },
    { name: 'Lincoln East Home Meet', location: 'Holmes Lake Park', isHome: true },
    { name: 'Heartland Conference Championships', location: 'Mahoney State Park', isHome: false },
    { name: 'Branched Oak Classic', location: 'Branched Oak Lake', isHome: false },
    { name: 'Walton Stampede Invitational', location: 'Walton Community Course', isHome: false },
    { name: 'UNL Pre-State Preview', location: 'UNL Cross Country Course', isHome: false },
    { name: 'NSAA District D-1 Meet', location: 'Kearney Country Club', isHome: false },
  ];
  const xcEvents: ImportEvent[] = [];
  const xcStart = new Date(fallStart);
  while (xcStart.getDay() !== 6) xcStart.setDate(xcStart.getDate() + 1);
  for (let xcI = 0; xcI < xcMeets.length; xcI++) {
    const meet = xcMeets[xcI];
    xcEvents.push({
      id: `import-xc-${xcI}`, title: `Cross Country - ${meet.name}`,
      date: new Date(xcStart), time: '9:00 AM', endTime: '12:00 PM',
      sport: 'Cross Country', type: 'game',
      location: meet.location, color: C['Cross Country'],
      opponent: meet.name, isHome: meet.isHome, facility: meet.location,
      hasStream: false, hasTickets: false, hasCameras: false, status: 'pending',
    });
    xcStart.setDate(xcStart.getDate() + 14);
  }

  return [
    { sport: 'Football', teamName: 'Varsity Football', color: C['Football'], events: fbEvents },
    { sport: 'Girls Volleyball', teamName: 'Varsity Girls Volleyball', color: C['Girls Volleyball'], events: vbEvents },
    { sport: 'Boys Soccer', teamName: 'Varsity Boys Soccer', color: C['Boys Soccer'], events: socEvents },
    { sport: 'Cross Country', teamName: 'Varsity Cross Country', color: C['Cross Country'], events: xcEvents },
  ];
}

// ---- Agent log entries (built dynamically based on options) ----
function buildAgentLog(tickets: boolean, streaming: boolean, focus: boolean): { text: string; type: 'working' | 'found' | 'done' }[] {
  const log: { text: string; type: 'working' | 'found' | 'done' }[] = [
    { text: 'Connecting to nsaa-schedule.org...', type: 'working' },
    { text: 'Parsing district schedule page...', type: 'working' },
    { text: 'Identified organization: Lincoln East High School', type: 'found' },
    { text: 'Found 9 Varsity Football games (Aug 28 - Oct 30)', type: 'found' },
    { text: 'Found 11 Varsity Girls Volleyball matches + 1 tournament', type: 'found' },
    { text: 'Found 9 Varsity Boys Soccer matches (Aug 28 - Oct 24)', type: 'found' },
    { text: 'Found 7 Varsity Cross Country meets (Aug 29 - Oct 31)', type: 'found' },
    { text: 'Mapping home games to facilities...', type: 'working' },
    { text: 'Memorial Stadium assigned to 5 football home games', type: 'done' },
    { text: 'Main Gym assigned to 6 volleyball home matches', type: 'done' },
    { text: 'Soccer Complex assigned to 4 soccer home matches', type: 'done' },
  ];
  if (streaming) log.push({ text: 'Configuring live streams for 15 home events...', type: 'working' });
  if (tickets) log.push({ text: 'Creating ticketed events for 15 home games...', type: 'working' });
  if (focus) log.push({ text: 'Linking Focus cameras for 15 home events...', type: 'working' });
  log.push({ text: 'Schedule import complete — 36 events ready for review', type: 'done' });
  return log;
}

// ---- Format helpers ----
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatEventDate(date: Date): string {
  return `${SHORT_DAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function formatEventDateLong(date: Date): string {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${SHORT_DAYS[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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
  const [editingEvent, setEditingEvent] = useState<ImportEvent | null>(null);
  const [optTickets, setOptTickets] = useState(false);
  const [optStreaming, setOptStreaming] = useState(false);
  const [optFocus, setOptFocus] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Reset state when panel opens
  useEffect(() => {
    if (isOpen) {
      setPhase('choose');
      setLogEntries(0);
      setSections([]);
      setEditingEvent(null);
      setOptTickets(false);
      setOptStreaming(false);
      setOptFocus(false);
      setPastedUrl('');
      setIsPublishing(false);
    }
  }, [isOpen]);

  // Fake paste: click the input to instantly fill the URL
  const FAKE_URL = 'https://www.nsaa-schedule.org/district/lincoln-east/fall-2026';
  const handleFakePaste = useCallback(() => {
    if (pastedUrl) return;
    setPastedUrl(FAKE_URL);
  }, [pastedUrl]);

  // Build log based on options
  const agentLog = React.useMemo(() => buildAgentLog(optTickets, optStreaming, optFocus), [optTickets, optStreaming, optFocus]);

  // Agent log streaming
  useEffect(() => {
    if (phase !== 'agent') return;
    if (logEntries >= agentLog.length) {
      const timer = setTimeout(() => {
        const generatedSections = generateImportEvents(optTickets, optStreaming, optFocus);
        setSections(generatedSections);
        setPhase('review');
      }, 600);
      return () => clearTimeout(timer);
    }
    const delay = logEntries === 0 ? 500 : (600 + Math.random() * 500);
    const timer = setTimeout(() => setLogEntries(prev => prev + 1), delay);
    return () => clearTimeout(timer);
  }, [phase, logEntries, agentLog, optTickets, optStreaming, optFocus]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logEntries]);

  const handleStartImport = useCallback(() => {
    setLogEntries(0);
    setPhase('agent');
  }, []);

  // Accept / Reject
  const setEventStatus = useCallback((eventId: string, status: 'pending' | 'accepted' | 'rejected') => {
    setSections(prev => prev.map(s => ({
      ...s,
      events: s.events.map(e => e.id === eventId ? { ...e, status } : e),
    })));
  }, []);

  // Bulk accept / reject all events in a section
  const setSectionStatus = useCallback((sport: string, status: 'accepted' | 'rejected') => {
    setSections(prev => prev.map(s =>
      s.sport === sport
        ? { ...s, events: s.events.map(e => ({ ...e, status })) }
        : s
    ));
  }, []);

  // Update event from edit view
  const updateEvent = useCallback((updated: ImportEvent) => {
    setSections(prev => prev.map(s => ({
      ...s,
      events: s.events.map(e => e.id === updated.id ? updated : e),
    })));
    setEditingEvent(null);
  }, []);

  const [isPublishing, setIsPublishing] = useState(false);

  const handleApprove = useCallback(() => {
    setIsPublishing(true);
    setTimeout(() => {
      const eventsToAdd: CalendarEvent[] = [];
      sections.forEach(section => {
        section.events.forEach(evt => {
          if (evt.status === 'accepted') {
            eventsToAdd.push({
              id: evt.id, title: evt.title, date: evt.date,
              time: evt.time, endTime: evt.endTime, sport: evt.sport,
              type: evt.type, location: evt.location, color: evt.color,
            });
          }
        });
      });
      onImport(eventsToAdd);
      setIsPublishing(false);
      showToast(`${eventsToAdd.length} events added to your calendar`, 'success');
      onClose();
    }, 2000);
  }, [sections, onImport, onClose, showToast]);

  // Counts
  const totalEvents = sections.reduce((sum, s) => sum + s.events.length, 0);
  const reviewedCount = sections.reduce((sum, s) => sum + s.events.filter(e => e.status !== 'pending').length, 0);
  const acceptedCount = sections.reduce((sum, s) => sum + s.events.filter(e => e.status === 'accepted').length, 0);
  const allReviewed = totalEvents > 0 && reviewedCount === totalEvents;

  if (!isOpen) return null;

  return (
    <>
      <div className="import-panel-backdrop" onClick={onClose} />
      <div className="import-panel">
        {/* Header */}
        <div className="import-panel-header">
          <h2 className="import-panel-title">Add Event</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Body — wraps list + edit as a horizontal slider */}
        <div className="import-panel-body-wrapper">
          <div className={`import-panel-slider ${editingEvent ? 'import-panel-slider--edit' : ''}`}>
            {/* Left pane: main content */}
            <div className="import-panel-pane">
              <div className="import-panel-body">
                {/* Phase: Choose */}
                {phase === 'choose' && (
                  <div className="import-phase-choose">
                    <button className="import-method-card import-method-card--ai" onClick={() => setPhase('paste')}>
                      <div className="import-method-icon import-method-icon--ai">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.962 0z" fill="currentColor"/><path d="M20 3v4M22 5h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
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
                      <div className="import-paste-text-group">
                        <div className="import-paste-label">Paste your district schedule URL</div>
                        <div className="import-paste-sublabel">Hudl AI will parse the page, find games for your teams, map facilities, and configure streaming.</div>
                      </div>
                      <input
                        className="import-paste-input"
                        type="url"
                        value={pastedUrl}
                        placeholder="Click here to paste your schedule URL"
                        onClick={handleFakePaste}
                        readOnly
                      />
                      <div className="import-paste-options">
                        <div className="import-paste-options-label">For home games, automatically set up:</div>
                        <label className="import-paste-option">
                          <input type="checkbox" checked={optTickets} onChange={() => setOptTickets(v => !v)} />
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7.333A1.333 1.333 0 013.333 6h1.334c.17 0 .333.07.471.195L6.667 8l4-4.667A.667.667 0 0111.333 3H12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7.333z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span>Ticketed events</span>
                        </label>
                        <label className="import-paste-option">
                          <input type="checkbox" checked={optStreaming} onChange={() => setOptStreaming(v => !v)} />
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25"/><path d="M5.17 5.17a4 4 0 000 5.66M10.83 5.17a4 4 0 010 5.66" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><path d="M3.05 3.05a7 7 0 000 9.9M12.95 3.05a7 7 0 010 9.9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                          <span>Live streaming</span>
                        </label>
                        <label className="import-paste-option">
                          <input type="checkbox" checked={optFocus} onChange={() => setOptFocus(v => !v)} />
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25"/></svg>
                          <span>Focus recordings</span>
                        </label>
                      </div>
                      <button className="import-paste-submit" onClick={handleStartImport} disabled={pastedUrl !== FAKE_URL}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.625 10.333A1.333 1.333 0 015.667 9.375l-4.09-1.054a.333.333 0 010-.642L5.667 6.625A1.333 1.333 0 016.625 5.667l1.054-4.09a.333.333 0 01.642 0l1.054 4.09a1.333 1.333 0 00.958.958l4.09 1.054a.333.333 0 010 .642l-4.09 1.054a1.333 1.333 0 00-.958.958l-1.054 4.09a.333.333 0 01-.642 0z" fill="currentColor"/><path d="M13.333 2v2.667M14.667 3.333h-2.667" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                        Import Schedule
                      </button>
                    </div>
                  </div>
                )}

                {/* Phase: Agent log */}
                {phase === 'agent' && (
                  <div className="import-phase-agent">
                    <div className="import-agent-header">
                      <div className="import-agent-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8.281 12.917A1.667 1.667 0 017.083 11.719L3.003 10.667a.417.417 0 010-.803l4.08-1.052A1.667 1.667 0 008.281 7.614l1.052-4.08a.417.417 0 01.803 0l1.052 4.08a1.667 1.667 0 001.198 1.198l4.08 1.052a.417.417 0 010 .803l-4.08 1.052a1.667 1.667 0 00-1.198 1.198l-1.052 4.08a.417.417 0 01-.803 0z" fill="currentColor"/><path d="M16.667 2.5v3.333M18.333 4.167H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <span className="import-agent-title">Hudl AI is importing your schedule</span>
                    </div>
                    <div className="import-agent-log" ref={logRef}>
                      {agentLog.slice(0, logEntries).map((entry, i) => (
                        <div key={i} className={`import-log-entry import-log-entry--${entry.type} ${i === logEntries - 1 ? 'import-log-entry--latest' : ''}`}>
                          <span className={`import-log-dot import-log-dot--${entry.type}`} />
                          <span className="import-log-text">{entry.text}</span>
                        </div>
                      ))}
                      {logEntries < agentLog.length && (
                        <div className="import-log-entry import-log-entry--thinking">
                          <span className="import-log-spinner" />
                          <span className="import-log-text import-log-text--dim">Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase: Review */}
                {phase === 'review' && (
                  <div className="import-phase-review">
                    <div className="import-review-summary">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>Found {totalEvents} events across {sections.length} sports</span>
                    </div>

                    <div className="import-review-progress">
                      <div className="import-review-progress-bar">
                        <div className="import-review-progress-fill" style={{ width: `${totalEvents > 0 ? (reviewedCount / totalEvents) * 100 : 0}%` }} />
                      </div>
                      <span className="import-review-progress-label">{reviewedCount} of {totalEvents} reviewed</span>
                    </div>

                    {sections.map(section => {
                      const sectionAccepted = section.events.filter(e => e.status === 'accepted').length;
                      const sectionRejected = section.events.filter(e => e.status === 'rejected').length;
                      const sectionReviewed = sectionAccepted + sectionRejected;

                      return (
                        <div key={section.sport} className="import-sport-section">
                          <div className="import-sport-header">
                            <span className="import-sport-dot" style={{ background: section.color }} />
                            <span className="import-sport-label">{section.teamName}</span>
                            <span className="import-sport-count">
                              {sectionReviewed === section.events.length
                                ? `${sectionAccepted} accepted`
                                : `${sectionReviewed} / ${section.events.length} reviewed`}
                            </span>
                            <div className="import-event-actions">
                              <button
                                className={`import-action-btn import-action-btn--accept ${sectionAccepted === section.events.length ? 'import-action-btn--active' : ''}`}
                                onClick={() => setSectionStatus(section.sport, 'accepted')}
                                aria-label={`Accept all ${section.teamName}`}
                                title="Accept all"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                              <button
                                className={`import-action-btn import-action-btn--reject ${sectionRejected === section.events.length ? 'import-action-btn--active' : ''}`}
                                onClick={() => setSectionStatus(section.sport, 'rejected')}
                                aria-label={`Reject all ${section.teamName}`}
                                title="Reject all"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                            </div>
                          </div>
                          <div className="import-event-list">
                            {section.events.map(evt => (
                              <div
                                key={evt.id}
                                className={`import-event-row import-event-row--${evt.status}`}
                              >
                                <div className="import-event-row-top">
                                  <button
                                    className="import-event-row-clickable"
                                    onClick={() => setEditingEvent(evt)}
                                    aria-label={`Edit ${evt.title}`}
                                  >
                                    <span className="import-event-date">{formatEventDate(evt.date)}</span>
                                    <span className="import-event-title">{evt.isHome ? 'vs.' : '@'} {evt.opponent}</span>
                                    <span className="import-event-time">{evt.time}</span>
                                  </button>
                                  <div className="import-event-actions">
                                    <button
                                      className={`import-action-btn import-action-btn--accept ${evt.status === 'accepted' ? 'import-action-btn--active' : ''}`}
                                      onClick={() => setEventStatus(evt.id, evt.status === 'accepted' ? 'pending' : 'accepted')}
                                      aria-label="Accept"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </button>
                                    <button
                                      className={`import-action-btn import-action-btn--reject ${evt.status === 'rejected' ? 'import-action-btn--active' : ''}`}
                                      onClick={() => setEventStatus(evt.id, evt.status === 'rejected' ? 'pending' : 'rejected')}
                                      aria-label="Reject"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </button>
                                  </div>
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
            </div>

            {/* Right pane: edit detail (pushes over) */}
            <div className="import-panel-pane">
              {editingEvent && (
                <EditEventView
                  event={editingEvent}
                  facilityOptions={FACILITY_OPTIONS[editingEvent.sport] || [editingEvent.facility]}
                  onSave={updateEvent}
                  onBack={() => setEditingEvent(null)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer (review phase only) */}
        {phase === 'review' && !editingEvent && (
          <div className="import-panel-footer">
            <button
              className="import-approve-btn"
              onClick={handleApprove}
              disabled={!allReviewed || acceptedCount === 0 || isPublishing}
            >
              {isPublishing ? (
                <><span className="import-btn-spinner" />Creating events...</>
              ) : !allReviewed
                ? `Review All Events (${reviewedCount}/${totalEvents})`
                : `Add ${acceptedCount} ${acceptedCount === 1 ? 'Event' : 'Events'} to Calendar`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}


// ---- Edit Event Sub-view ----
function EditEventView({
  event,
  facilityOptions,
  onSave,
  onBack,
}: {
  event: ImportEvent;
  facilityOptions: string[];
  onSave: (updated: ImportEvent) => void;
  onBack: () => void;
}) {
  const [facility, setFacility] = useState(event.facility);
  const [hasStream, setHasStream] = useState(event.hasStream);
  const [hasTickets, setHasTickets] = useState(event.hasTickets);
  const [hasCameras, setHasCameras] = useState(event.hasCameras);

  const handleSave = () => {
    onSave({
      ...event,
      facility,
      location: facility,
      hasStream,
      hasTickets,
      hasCameras,
    });
  };

  // Find team name from sport
  const teamName = event.sport === 'Football' ? 'Varsity Football'
    : event.sport === 'Girls Volleyball' ? 'Varsity Girls Volleyball'
    : event.sport === 'Boys Soccer' ? 'Varsity Boys Soccer'
    : event.sport;

  return (
    <div className="import-edit-view">
      <div className="import-edit-header">
        <button className="import-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
      </div>

      <div className="import-edit-body">
        <div className="import-edit-title-row">
          <span className="import-sport-dot" style={{ background: event.color }} />
          <h3 className="import-edit-title">{event.isHome ? 'vs.' : '@'} {event.opponent}</h3>
        </div>

        <div className="import-edit-meta">
          <span className="import-edit-team">{teamName}</span>
          <span className="import-edit-date">{formatEventDateLong(event.date)}</span>
          <span className="import-edit-time">{event.time} - {event.endTime}</span>
        </div>

        <div className="import-edit-section">
          <label className="import-edit-label">Facility</label>
          {event.isHome ? (
            <select
              className="import-edit-select"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
            >
              {facilityOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          ) : (
            <div className="import-edit-readonly">{facility}</div>
          )}
        </div>

        {event.isHome && (
          <>
            <div className="import-edit-section">
              <label className="import-edit-label">Event Configuration</label>
              <div className="import-edit-toggles">
                <label className="import-edit-toggle">
                  <input type="checkbox" checked={hasStream} onChange={(e) => setHasStream(e.target.checked)} />
                  <span className="import-edit-toggle-label">Live Stream</span>
                </label>
                <label className="import-edit-toggle">
                  <input type="checkbox" checked={hasTickets} onChange={(e) => setHasTickets(e.target.checked)} />
                  <span className="import-edit-toggle-label">Tickets</span>
                </label>
                <label className="import-edit-toggle">
                  <input type="checkbox" checked={hasCameras} onChange={(e) => setHasCameras(e.target.checked)} />
                  <span className="import-edit-toggle-label">Cameras</span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="import-edit-footer">
        <button className="import-approve-btn" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}
