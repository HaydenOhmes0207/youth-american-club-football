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
  confidence: number; // AI confidence percentage (0-100)
}

interface SportSection {
  sport: string;
  teamName: string;
  color: string;
  events: ImportEvent[];
}

type Phase = 'choose' | 'paste' | 'agent' | 'review' | 'manual';

// ---- Manual event venue data ----
interface VenueOption {
  id: string;
  name: string;
  org?: string;
  isExternal: boolean;
  availableOnDate?: boolean;
}

const MY_VENUES: VenueOption[] = [
  { id: 'v-pp1', name: 'Pioneer Park Field 1', isExternal: false },
  { id: 'v-pp2', name: 'Pioneer Park Field 2', isExternal: false },
  { id: 'v-pp3', name: 'Pioneer Park Field 3', isExternal: false },
  { id: 'v-pp4', name: 'Pioneer Park Field 4', isExternal: false },
  { id: 'v-cc', name: 'Community Center Gym', isExternal: false },
];

const NETWORK_VENUES: VenueOption[] = [
  { id: 'v-spartan', name: 'Spartan Field - Memorial Stadium', org: 'Northwest HS', isExternal: true, availableOnDate: true },
  { id: 'v-hawks', name: 'Hawks Field', org: 'Papillion-La Vista HS', isExternal: true, availableOnDate: false },
  { id: 'v-mustang', name: 'Mustang Stadium', org: 'Millard North HS', isExternal: true, availableOnDate: true },
];

const AMENITY_OPTIONS = [
  { id: 'camera', label: 'Camera / Streaming' },
  { id: 'scoreboard', label: 'Scoreboard' },
  { id: 'pa', label: 'PA System' },
  { id: 'pressbox', label: 'Press Box' },
];

export interface ManualEventResult {
  title: string;
  date: string;
  timeBlock: string;
  location: string;
  isExternal: boolean;
  externalOrg?: string;
  amenities: string[];
  description: string;
}

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
      confidence: 92 + Math.floor(Math.random() * 8), // 92-99%
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
      confidence: 90 + Math.floor(Math.random() * 10), // 90-99%
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
    confidence: 88,
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
      confidence: 91 + Math.floor(Math.random() * 9), // 91-99%
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
    confidence: 95,
  });

  // Cross Country: Saturday meets — unique names, one home meet
  const xcMeets: { name: string; location: string; isHome: boolean }[] = [
    { name: 'Pioneers Park Twilight', location: 'Pioneers Park', isHome: false },
    { name: 'Northwest Home Meet', location: 'Holmes Lake Park', isHome: true },
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
      confidence: 85 + Math.floor(Math.random() * 12), // 85-96%
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
    { text: 'Identified organization: Northwest High School', type: 'found' },
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
  onManualSubmit?: (result: ManualEventResult) => void;
}

export default function ScheduleImportPanel({ isOpen, onClose, onImport, onManualSubmit }: ScheduleImportPanelProps) {
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

  // Manual form state
  const [manualEventType, setManualEventType] = useState<'game' | 'practice' | 'other'>('other');
  const [manualTitle, setManualTitle] = useState('Championship Saturday');
  const [manualStartDate, setManualStartDate] = useState('2026-11-07');
  const [manualEndDate, setManualEndDate] = useState('2026-11-07');
  const [manualStartTime, setManualStartTime] = useState('8:00 AM');
  const [manualEndTime, setManualEndTime] = useState('6:00 PM');
  const [manualDescription, setManualDescription] = useState(
    'End-of-season championship games for our youth tackle football program. Four title games across age divisions (3rd-6th grade). Expected attendance: ~400 families.'
  );
  const [venueSearch, setVenueSearch] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set(['camera', 'scoreboard', 'pa']));
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);

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
      // Reset manual form
      setManualEventType('other');
      setManualTitle('Championship Saturday');
      setManualStartDate('2026-11-07');
      setManualEndDate('2026-11-07');
      setManualStartTime('8:00 AM');
      setManualEndTime('6:00 PM');
      setManualDescription('End-of-season championship games for our youth tackle football program. Four title games across age divisions (3rd-6th grade). Expected attendance: ~400 families.');
      setVenueSearch('');
      setSelectedVenue(null);
      setShowVenueDropdown(false);
      setSelectedAmenities(new Set(['camera', 'scoreboard', 'pa']));
      setIsManualSubmitting(false);
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
                    <button className="import-method-card import-method-card--manual" onClick={() => setPhase('manual')}>
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
                                className={`import-event-card import-event-card--${evt.status}`}
                                style={{ '--event-color': section.color } as React.CSSProperties}
                              >
                                {/* Header: Opponent, Home/Away badge, Confidence */}
                                <div className="import-event-header">
                                  <div className="import-event-header-left">
                                    <span className="import-event-opponent">{evt.opponent}</span>
                                    <span className={`import-event-home-badge ${evt.isHome ? 'import-event-home-badge--home' : 'import-event-home-badge--away'}`}>
                                      {evt.isHome ? 'Home' : 'Away'}
                                    </span>
                                  </div>
                                  <span className="import-event-confidence">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    {evt.confidence}%
                                  </span>
                                </div>

                                {/* Details row: Date, Time, Location */}
                                <div className="import-event-details">
                                  <span className="import-event-detail">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5.5h11M4.5 1v2M9.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                    {formatEventDate(evt.date)}
                                  </span>
                                  <span className="import-event-detail">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    {evt.time}
                                  </span>
                                  <span className="import-event-detail">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 13c3-3 5-5.5 5-7.5a5 5 0 10-10 0c0 2 2 4.5 5 7.5z" stroke="currentColor" strokeWidth="1.2"/></svg>
                                    {evt.facility}
                                  </span>
                                </div>

                                {/* Tags row: Streaming, Tickets, Recording */}
                                {(evt.hasStream || evt.hasTickets || evt.hasCameras) && (
                                  <div className="import-event-tags">
                                    {evt.hasTickets && (
                                      <span className="import-event-tag import-event-tag--tickets">Tickets</span>
                                    )}
                                    {evt.hasStream && (
                                      <span className="import-event-tag import-event-tag--stream">Streaming</span>
                                    )}
                                    {evt.hasCameras && (
                                      <span className="import-event-tag import-event-tag--cameras">Recording</span>
                                    )}
                                  </div>
                                )}

                                {/* Footer: AI Status left, Actions right */}
                                <div className="import-event-footer">
                                  <div className="import-event-ai-status">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l.8 2.4L10.2 4l-2.4.8L7 7.2l-.8-2.4L3.8 4l2.4-.8L7 1zM3 8l.5 1.5L5 10l-1.5.5L3 12l-.5-1.5L1 10l1.5-.5L3 8zM10.5 9l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1z" fill="currentColor"/></svg>
                                    <span>All details verified. Ready to add.</span>
                                  </div>
                                  <div className="import-event-actions-row">
                                    <button
                                      className={`import-event-btn import-event-btn--approve ${evt.status === 'accepted' ? 'import-event-btn--active' : ''}`}
                                      onClick={() => setEventStatus(evt.id, evt.status === 'accepted' ? 'pending' : 'accepted')}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      Approve
                                    </button>
                                    <button
                                      className={`import-event-btn import-event-btn--reject ${evt.status === 'rejected' ? 'import-event-btn--active' : ''}`}
                                      onClick={() => setEventStatus(evt.id, evt.status === 'rejected' ? 'pending' : 'rejected')}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Phase: Manual Event */}
                {phase === 'manual' && (
                  <div className="closure-phase-review">
                    <div className="import-paste-header">
                      <button className="import-back-btn" onClick={() => setPhase('choose')}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Back
                      </button>
                    </div>

                    {/* Event Type */}
                    <div className="closure-review-section">
                      <div className="closure-section-label">Event Type <span style={{ color: '#dc2626' }}>*</span></div>
                      <div className="manual-radio-group">
                        {(['game', 'practice', 'other'] as const).map(t => (
                          <label key={t} className="manual-radio-option">
                            <input type="radio" name="eventType" checked={manualEventType === t} onChange={() => setManualEventType(t)} />
                            <span className="manual-radio-dot" />
                            <span>{t === 'game' ? 'Game' : t === 'practice' ? 'Practice' : 'Other'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Game Type (only for games) */}
                    {manualEventType === 'game' && (
                      <div className="closure-review-section">
                        <div className="closure-section-label">Game Type <span style={{ color: '#dc2626' }}>*</span></div>
                        <div className="manual-radio-group">
                          {['Regular Season', 'Scrimmage', 'Tournament', 'Postseason'].map(t => (
                            <label key={t} className="manual-radio-option">
                              <input type="radio" name="gameType" />
                              <span className="manual-radio-dot" />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Title (for Other type) */}
                    {manualEventType === 'other' && (
                      <div className="closure-review-section">
                        <div className="closure-section-label">Event Name <span style={{ color: '#dc2626' }}>*</span></div>
                        <input className="compose-subject-input" value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder="e.g. Championship Saturday" />
                      </div>
                    )}

                    {/* Opponent (only for games) */}
                    {manualEventType === 'game' && (
                      <div className="closure-review-section">
                        <div className="closure-section-label">Opponent <span style={{ color: '#dc2626' }}>*</span></div>
                        <select className="compose-subject-input">
                          <option value="">Select an opponent</option>
                          {alexOpponents.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Date (Start + End) */}
                    <div className="closure-review-section">
                      <div className="closure-section-label">Date <span style={{ color: '#dc2626' }}>*</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input className="compose-subject-input" style={{ flex: 1 }} type="date" value={manualStartDate} onChange={e => { setManualStartDate(e.target.value); if (e.target.value > manualEndDate) setManualEndDate(e.target.value); }} />
                        <span className="compose-field-value" style={{ flexShrink: 0 }}>to</span>
                        <input className="compose-subject-input" style={{ flex: 1 }} type="date" value={manualEndDate} min={manualStartDate} onChange={e => setManualEndDate(e.target.value)} />
                      </div>
                    </div>

                    {/* Time */}
                    <div className="closure-review-section">
                      <div className="closure-section-label">Start Time <span style={{ color: '#dc2626' }}>*</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select className="compose-subject-input" style={{ flex: 1 }} value={manualStartTime} onChange={e => setManualStartTime(e.target.value)}>
                          {['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="compose-field-value" style={{ flexShrink: 0 }}>to</span>
                        <select className="compose-subject-input" style={{ flex: 1 }} value={manualEndTime} onChange={e => setManualEndTime(e.target.value)}>
                          {['2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Location / Venue */}
                    <div className="closure-review-section">
                      <div className="closure-section-label">Location <span style={{ color: '#dc2626' }}>*</span></div>
                      {manualEventType !== 'other' ? (
                        <div className="manual-radio-group">
                          {['Home', 'Neutral', 'Away'].map(t => (
                            <label key={t} className="manual-radio-option">
                              <input type="radio" name="location" defaultChecked={t === 'Home'} />
                              <span className="manual-radio-dot" />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                      ) : selectedVenue ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div className="event-venue-selected">
                            <div className="event-venue-selected-info">
                              <span className="event-venue-selected-name">{selectedVenue.name}</span>
                              {selectedVenue.isExternal ? (
                                <span className="event-venue-external-tag">
                                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M12 2h4v4M6 10l6-6M14 9v5a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  External &middot; {selectedVenue.org} &middot; Requires approval
                                </span>
                              ) : null}
                            </div>
                            <button className="event-venue-change" onClick={() => { setSelectedVenue(null); setShowVenueDropdown(true); }}>Change</button>
                          </div>

                          {/* Unavailability warning -- only shown when venue is NOT available */}
                          {selectedVenue.isExternal && !selectedVenue.availableOnDate && (
                            <div className="event-approval-notice">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                              <span>This venue appears <strong>unavailable</strong> on the selected date</span>
                            </div>
                          )}

                          {/* Amenity requests -- inline with venue selection */}
                          {selectedVenue.isExternal && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span style={{ fontFamily: 'var(--u-font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--u-color-base-foreground-subtle, #607081)' }}>Request Amenities</span>
                              <div className="booking-amenities">
                                {AMENITY_OPTIONS.map(a => (
                                  <label key={a.id} className={`event-amenity-toggle ${selectedAmenities.has(a.id) ? 'event-amenity-toggle--active' : ''}`}>
                                    <input type="checkbox" checked={selectedAmenities.has(a.id)} onChange={() => {
                                      setSelectedAmenities(prev => {
                                        const next = new Set(prev);
                                        if (next.has(a.id)) next.delete(a.id); else next.add(a.id);
                                        return next;
                                      });
                                    }} style={{ display: 'none' }} />
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      {selectedAmenities.has(a.id) ? (
                                        <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      ) : (
                                        <path d="M6 3v6M3 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                      )}
                                    </svg>
                                    {a.label}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <input
                            className="compose-subject-input"
                            value={venueSearch}
                            onChange={e => { setVenueSearch(e.target.value); setShowVenueDropdown(true); }}
                            onFocus={() => setShowVenueDropdown(true)}
                            placeholder="Search venues..."
                          />
                          {showVenueDropdown && (
                            <div className="event-venue-dropdown">
                              {MY_VENUES.filter(v => !venueSearch || v.name.toLowerCase().includes(venueSearch.toLowerCase())).length > 0 && (
                                <>
                                  <div className="event-venue-group-label">Your Venues</div>
                                  {MY_VENUES.filter(v => !venueSearch || v.name.toLowerCase().includes(venueSearch.toLowerCase())).map(v => (
                                    <button key={v.id} className="event-venue-option" onClick={() => { setSelectedVenue(v); setShowVenueDropdown(false); setVenueSearch(''); }}>
                                      <span className="event-venue-option-name">{v.name}</span>
                                    </button>
                                  ))}
                                </>
                              )}
                              {NETWORK_VENUES.filter(v => !venueSearch || v.name.toLowerCase().includes(venueSearch.toLowerCase()) || (v.org && v.org.toLowerCase().includes(venueSearch.toLowerCase()))).length > 0 && (
                                <>
                                  <div className="event-venue-group-label">Nearby / Network Venues</div>
                                  {NETWORK_VENUES.filter(v => !venueSearch || v.name.toLowerCase().includes(venueSearch.toLowerCase()) || (v.org && v.org.toLowerCase().includes(venueSearch.toLowerCase()))).map(v => (
                                    <button key={v.id} className="event-venue-option" onClick={() => { setSelectedVenue(v); setShowVenueDropdown(false); setVenueSearch(''); }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span className="event-venue-option-name">{v.name}</span>
                                        <span className="event-venue-option-org">
                                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M12 2h4v4M6 10l6-6M14 9v5a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                          {v.org}
                                        </span>
                                      </div>
                                      {v.availableOnDate !== false ? (
                                        <span className="event-venue-avail event-venue-avail--open">Available</span>
                                      ) : (
                                        <span className="event-venue-avail event-venue-avail--busy">Unavailable</span>
                                      )}
                                    </button>
                                  ))}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="closure-review-section">
                      <div className="closure-section-label">Description</div>
                      <textarea className="closure-message" value={manualDescription} onChange={e => setManualDescription(e.target.value)} rows={4} />
                    </div>
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

        {/* Footer (manual phase) */}
        {phase === 'manual' && (
          <div className="import-panel-footer" style={{ display: 'flex', gap: '8px' }}>
            <button className="booking-decline-btn" onClick={onClose}>Cancel</button>
            {selectedVenue?.isExternal ? (
              <button
                className="compose-send-btn"
                style={{ flex: 1 }}
                disabled={!selectedVenue || !manualTitle.trim() || isManualSubmitting}
                onClick={() => {
                  if (!selectedVenue || !onManualSubmit) return;
                  setIsManualSubmitting(true);
                  setTimeout(() => {
                    onManualSubmit({
                      title: manualTitle,
                      date: manualStartDate,
                      timeBlock: `${manualStartTime} - ${manualEndTime}`,
                      location: selectedVenue.name,
                      isExternal: true,
                      externalOrg: selectedVenue.org,
                      amenities: Array.from(selectedAmenities),
                      description: manualDescription,
                    });
                    setIsManualSubmitting(false);
                  }, 1200);
                }}
              >
                {isManualSubmitting ? (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" /></svg>Submitting...</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2.667L7.333 9.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><path d="M14 2.667l-4.667 13.333-2.666-6-6-2.667L14 2.667z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>Submit Booking Request</>
                )}
              </button>
            ) : (
              <>
                <button
                  className="import-approve-btn"
                  style={{ flex: 1, background: '#6b7280' }}
                  disabled={isManualSubmitting}
                  onClick={() => {
                    if (!onManualSubmit) return;
                    onManualSubmit({
                    title: manualTitle, date: manualStartDate, timeBlock: `${manualStartTime} - ${manualEndTime}`,
                    location: selectedVenue?.name || '', isExternal: false, amenities: [], description: manualDescription,
                    });
                  }}
                >Save &amp; Add Another</button>
                <button
                  className="compose-send-btn"
                  style={{ flex: 1 }}
                  disabled={isManualSubmitting}
                  onClick={() => {
                    if (!onManualSubmit) return;
                    onManualSubmit({
                      title: manualTitle, date: manualStartDate, timeBlock: `${manualStartTime} - ${manualEndTime}`,
                      location: selectedVenue?.name || '', isExternal: false, amenities: [], description: manualDescription,
                    });
                  }}
                >Save &amp; Close</button>
              </>
            )}
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
