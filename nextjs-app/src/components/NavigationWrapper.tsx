'use client';

import React, { useState } from 'react';
import LegacyNavigation from './LegacyNavigation';
import { usePersona } from '@/lib/persona-context';
import { mockNavItems } from '@/lib/mock-data';
import PageHeader from './PageHeader';
import ProgramsTable from './ProgramsTable';
import CommunityTable from './CommunityTable';
import CalendarView, { EVENTS_BY_PERSONA } from './CalendarView';
import type { CalendarEvent } from './CalendarView';
import ScheduleImportPanel, { getFallScheduleEvents } from './ScheduleImportPanel';
import FacilityResourceView, { ALEX_SURFACES, MARIA_SURFACES } from './FacilityResourceView';
import FacilityClosurePanel, { ALEX_FACILITIES, MARIA_FACILITIES } from './FacilityClosurePanel';
import ProgramDetailView from './ProgramDetailView';
import type { Registrant } from './ProgramDetailView';
import MessageComposePanel from './MessageComposePanel';
import type { MessagePayload } from './MessageComposePanel';
import type { ProgramWithStats } from '@/lib/actions/programs';
import { useToast } from './Toast';

export interface SentNotification {
  id: string;
  date: Date;
  facilities: string[];
  events: string[];
  recipients: { coaches: boolean; parents: boolean; fans: boolean };
  channels: { email: boolean; sms: boolean; push: boolean };
  message: string;
  sentAt: Date;
  recipientCount: number;
  sentBy: string;
  // Optional fields for program messages
  subject?: string;
  programTitle?: string;
  type?: 'facility-closure' | 'program-message';
}

const alexPrograms: ProgramWithStats[] = [
  {
    id: 'program-1',
    title: 'Fall 2026 Football Season',
    type: 'season',
    eventDates: { start: '2026-08-15', end: '2026-11-30' },
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 145,
    programValue: 0,
    createdBy: { id: 'user-alex', firstName: 'Alex', lastName: 'Mitchell', avatar: null },
  },
];

const mariaPrograms: ProgramWithStats[] = [
  {
    id: 'mp-tackle', title: 'Fall Tackle Football', type: 'season',
    eventDates: { start: '2026-08-10', end: '2026-11-14' },
    keyDates: 'Aug 10 – Nov 14, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 186, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Maria', lastName: 'Santos', avatar: null },
    teamCount: 12, feePerPlayer: 285, paidPercent: 74, outstandingAmount: 13_680, totalRevenue: 39_330,
  },
  {
    id: 'mp-flag', title: 'Fall Flag Football', type: 'season',
    eventDates: { start: '2026-09-06', end: '2026-10-25' },
    keyDates: 'Sep 6 – Oct 25, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 112, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Maria', lastName: 'Santos', avatar: null },
    teamCount: 8, feePerPlayer: 125, outstandingAmount: 2_500, totalRevenue: 11_500, paidPercent: 82,
  },
  {
    id: 'mp-cheer', title: 'Fall Cheer', type: 'season',
    eventDates: { start: '2026-08-10', end: '2026-11-14' },
    keyDates: 'Aug 10 – Nov 14, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 64, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Maria', lastName: 'Santos', avatar: null },
    teamCount: 4, feePerPlayer: 195, outstandingAmount: 1_365, totalRevenue: 11_115, paidPercent: 89,
  },
  {
    id: 'mp-camp', title: 'Summer Skills Camp', type: 'camp',
    eventDates: { start: '2026-06-15', end: '2026-06-19' },
    keyDates: 'Jun 15 – 19, 2026',
    visibility: 'public', registrationStatus: 'closed', status: 'published',
    registrantCount: 78, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Maria', lastName: 'Santos', avatar: null },
    teamCount: 0, feePerPlayer: 85, outstandingAmount: 0, totalRevenue: 6_630, paidPercent: 100,
  },
  {
    id: 'mp-combine', title: 'Spring Combine & Evaluation', type: 'clinic',
    eventDates: { start: '2026-04-18', end: '2026-04-18' },
    keyDates: 'Apr 18, 2026',
    visibility: 'public', registrationStatus: 'closed', status: 'published',
    registrantCount: 134, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Maria', lastName: 'Santos', avatar: null },
    teamCount: 0, feePerPlayer: 35, outstandingAmount: 0, totalRevenue: 4_690, paidPercent: 100,
  },
  {
    id: 'mp-equip', title: 'Equipment Fitting Day', type: 'clinic',
    eventDates: { start: '2026-07-25', end: '2026-07-25' },
    keyDates: 'Jul 25, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 210, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Maria', lastName: 'Santos', avatar: null },
    teamCount: 0, feePerPlayer: 0, outstandingAmount: 0, totalRevenue: 0, paidPercent: 100,
  },
];

interface DeskItem {
  id: string;
  icon: 'payment' | 'registration' | 'assignment';
  label: string;
  detail: string;
}

function DeskIcon({ type }: { type: DeskItem['icon'] }) {
  if (type === 'payment') return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/></svg>
  );
  if (type === 'registration') return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  );
}

interface HomePageProps {
  onTakeAction?: () => void;
  showStormAlert?: boolean;
  showPaymentAlert?: boolean;
  onReviewPrograms?: () => void;
  deskItems?: DeskItem[];
}

function HomePage({ onTakeAction, showStormAlert, showPaymentAlert, onReviewPrograms, deskItems }: HomePageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader title="Home" description="Welcome to your organization overview and quick actions." />
      {showStormAlert && (
        <div className="storm-alert-card">
          <div className="storm-alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 16.9A5 5 0 0018 7h-1.26A8 8 0 104 15.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 11l-4 6h6l-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="storm-alert-content">
            <div className="storm-alert-title">Severe Thunderstorm Warning</div>
            <div className="storm-alert-desc">A severe thunderstorm warning has been issued for <strong>Friday, September 4</strong>. Consider closing outdoor facilities and notifying affected coaches, parents, and fans.</div>
          </div>
          <button className="storm-alert-action" onClick={onTakeAction}>Take Action</button>
        </div>
      )}
      {showPaymentAlert && (
        <div className="payment-alert-card">
          <div className="payment-alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="payment-alert-content">
            <div className="payment-alert-title">Overdue Payments Across 3 Programs</div>
            <div className="payment-alert-desc"><strong>$17,545</strong> outstanding across Fall Tackle Football, Fall Flag Football, and Fall Cheer. <strong>72 families</strong> have unpaid balances that need follow-up before the season starts.</div>
          </div>
          <button className="payment-alert-action" onClick={onReviewPrograms}>Review Programs</button>
        </div>
      )}
      {deskItems && deskItems.length > 0 && (
        <div className="desk-section">
          <h3 className="desk-section-title">On Your Desk</h3>
          <div className="desk-items">
            {deskItems.map(item => (
              <div key={item.id} className="desk-item">
                <div className="desk-item-icon"><DeskIcon type={item.icon} /></div>
                <div className="desk-item-content">
                  <span className="desk-item-label">{item.label}</span>
                  <span className="desk-item-detail">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarPageContent({ onOpenImport }: { onOpenImport: () => void }) {
  return (
    <>
      <PageHeader
        title="Calendar"
        description="View and manage camps, clinics, and events across your organization."
        actions={[{ label: 'Add Event', buttonStyle: 'standard', onClick: onOpenImport }]}
      />
    </>
  );
}

function FacilitiesPageContent({ onOpenClosure }: { onOpenClosure: () => void }) {
  return (
    <PageHeader
      title="Facilities"
      description="Manage fields, gyms, and other facilities available for your organization."
      actions={[
        { label: 'Close Facilities', buttonStyle: 'minimal', onClick: onOpenClosure },
        { label: 'Add Facility', buttonStyle: 'standard' },
      ]}
    />
  );
}

function CommunityPageContent({ sentNotifications }: { sentNotifications: SentNotification[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
      <PageHeader title="Community" description="Manage athletes, coaches, and staff across your organization." actions={[{ label: 'Import', buttonStyle: 'minimal' }, { label: 'Add Member', buttonStyle: 'standard' }]} />
      <CommunityTable sentNotifications={sentNotifications} />
    </div>
  );
}

/* ProgramsPage is now rendered inline with persona-specific data */

export default function NavigationWrapper() {
  const { activePersona, activeChapter, chapterVersion } = usePersona();
  const [activeRoute, setActiveRoute] = useState('/');
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importedEvents, setImportedEvents] = useState<CalendarEvent[]>([]);
  const [cancelledEventIds, setCancelledEventIds] = useState<Set<string>>(new Set());
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [showClosurePanel, setShowClosurePanel] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithStats | null>(null);
  const [showComposePanel, setShowComposePanel] = useState(false);
  const [composeRecipients, setComposeRecipients] = useState<Registrant[]>([]);
  const [composeOverduePrograms, setComposeOverduePrograms] = useState<ProgramWithStats[]>([]);
  const { showToast } = useToast();

  // Chapter switching: reset state and set initial context for each chapter
  React.useEffect(() => {
    // Reset shared state
    setShowImportPanel(false);
    setShowClosurePanel(false);
    setCancelledEventIds(new Set());
    setSentNotifications([]);
    setSelectedProgram(null);
    setShowComposePanel(false);
    setComposeRecipients([]);
    setComposeOverduePrograms([]);

    switch (activeChapter) {
      case 'home':
        setActiveRoute('/');
        setImportedEvents([]);
        break;
      case 'schedule-ingest':
        setActiveRoute('/calendar');
        setImportedEvents([]);
        break;
      case 'communication':
        setActiveRoute('/');
        if (activePersona.id !== 'maria') {
          setImportedEvents(getFallScheduleEvents());
        } else {
          setImportedEvents([]);
        }
        break;
      case 'operations':
        setActiveRoute('/programs');
        setImportedEvents([]);
        break;
      case 'external-bookings':
        setActiveRoute('/');
        setImportedEvents(getFallScheduleEvents());
        break;
      case 'booking-request':
        setActiveRoute('/');
        setImportedEvents([]);
        break;
      default:
        setActiveRoute('/');
        setImportedEvents([]);
        break;
    }
  }, [activeChapter, chapterVersion]);

  const handleImport = (events: CalendarEvent[]) => {
    setImportedEvents(prev => [...prev, ...events]);
  };

  const handleClosure = (eventIds: string[], notification: Omit<SentNotification, 'id' | 'sentAt' | 'sentBy'>) => {
    setCancelledEventIds(prev => {
      const next = new Set(prev);
      eventIds.forEach(id => next.add(id));
      return next;
    });
    setSentNotifications(prev => [...prev, {
      ...notification,
      id: `notif-${Date.now()}`,
      sentAt: new Date(),
      sentBy: `${activePersona.firstName} ${activePersona.lastName}`,
    }]);
  };

  const handleEmailRegistrants = (registrants: Registrant[]) => {
    setComposeRecipients(registrants);
    setComposeOverduePrograms([]);
    setShowComposePanel(true);
  };

  const handleMessageOverdue = (programs: ProgramWithStats[]) => {
    setComposeOverduePrograms(programs);
    setComposeRecipients([]);
    setShowComposePanel(true);
  };

  const handleMessageSend = (payload: MessagePayload) => {
    setSentNotifications(prev => [...prev, {
      id: `msg-${Date.now()}`,
      date: new Date(),
      facilities: [],
      events: [],
      recipients: { coaches: false, parents: true, fans: false },
      channels: payload.channels,
      message: payload.message,
      sentAt: new Date(),
      recipientCount: payload.recipientCount,
      sentBy: payload.sentBy,
      subject: payload.subject,
      programTitle: payload.programTitle,
      type: 'program-message',
    }]);
    setShowComposePanel(false);
    setComposeRecipients([]);
    setComposeOverduePrograms([]);
    showToast(`Message sent to ${payload.recipientCount} families`, 'success');
  };

  const organization = {
    id: activePersona.orgId,
    name: activePersona.orgName,
    primary_sport: 'Football',
    avatar: activePersona.orgAvatar,
    primary_color: activePersona.primaryColor,
    secondary_color: activePersona.secondaryColor,
  };

  const teams = activePersona.id === 'alex'
    ? [
        { id: 'team-hs-1', title: 'Varsity Football', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1e40af', secondary_color: '#fbbf24' },
        { id: 'team-hs-2', title: 'JV Football', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1e40af', secondary_color: '#fbbf24' },
        { id: 'team-hs-3', title: 'Freshman Football', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1e40af', secondary_color: '#fbbf24' },
      ]
    : [
        { id: 'team-cl-1', title: '6th Grade Football A', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-2', title: '6th Grade Football B', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-3', title: '5th Grade Football A', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-4', title: '5th Grade Football B', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-5', title: '4th Grade Football A', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-6', title: '4th Grade Football B', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-7', title: '3rd Grade Football A', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-8', title: '3rd Grade Football B', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#1a2744', secondary_color: '#c0c0c0' },
        { id: 'team-cl-9', title: '6th Grade Cheer', sport: 'Cheer', gender: 'Female', avatar: null, primary_color: '#7c3aed', secondary_color: '#c0c0c0' },
        { id: 'team-cl-10', title: '5th Grade Cheer', sport: 'Cheer', gender: 'Female', avatar: null, primary_color: '#7c3aed', secondary_color: '#c0c0c0' },
        { id: 'team-cl-11', title: '4th Grade Cheer', sport: 'Cheer', gender: 'Female', avatar: null, primary_color: '#7c3aed', secondary_color: '#c0c0c0' },
        { id: 'team-cl-12', title: '3rd Grade Cheer', sport: 'Cheer', gender: 'Female', avatar: null, primary_color: '#7c3aed', secondary_color: '#c0c0c0' },
      ];

  const navItems = mockNavItems
    .filter(item => item.is_active)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      route: item.route,
      children: [] as { id: string; label: string; route: string | null }[],
    }));

  const currentUser = {
    id: activePersona.id,
    email: activePersona.email,
    firstName: activePersona.firstName,
    lastName: activePersona.lastName,
    role: activePersona.role,
  };

  // Persona-specific programs
  const currentPrograms = activePersona.id === 'maria' ? mariaPrograms : alexPrograms;

  // Simulated "today" per chapter
  const simulatedToday = React.useMemo(() => {
    switch (activeChapter) {
      case 'schedule-ingest': return new Date(2026, 6, 16); // July 16
      case 'communication': return new Date(2026, 8, 4);    // Sep 4
      default: return undefined;
    }
  }, [activeChapter]);

  // Collect all events for facilities view
  const allEvents = [...(EVENTS_BY_PERSONA[activePersona.id] || []), ...importedEvents];

  // Build overlay based on active route or compose panel
  let overlay: React.ReactNode = null;
  const isBulkOverdue = showComposePanel && composeOverduePrograms.length > 0;
  const isRegistrantCompose = showComposePanel && selectedProgram && composeRecipients.length > 0;
  if (isBulkOverdue) {
    overlay = (
      <MessageComposePanel
        isOpen
        onClose={() => { setShowComposePanel(false); setComposeOverduePrograms([]); }}
        senderName={`${activePersona.firstName} ${activePersona.lastName}`}
        onSend={handleMessageSend}
        overduePrograms={composeOverduePrograms}
      />
    );
  } else if (isRegistrantCompose) {
    overlay = (
      <MessageComposePanel
        isOpen
        onClose={() => { setShowComposePanel(false); setComposeRecipients([]); }}
        recipients={composeRecipients}
        programTitle={selectedProgram.title}
        senderName={`${activePersona.firstName} ${activePersona.lastName}`}
        onSend={handleMessageSend}
      />
    );
  } else if (activeRoute === '/calendar') {
    overlay = (
      <ScheduleImportPanel
        isOpen={showImportPanel}
        onClose={() => setShowImportPanel(false)}
        onImport={handleImport}
      />
    );
  } else if (activeRoute === '/facilities') {
    overlay = (
      <FacilityClosurePanel
        isOpen={showClosurePanel}
        onClose={() => setShowClosurePanel(false)}
        allEvents={allEvents}
        cancelledEventIds={cancelledEventIds}
        onConfirm={handleClosure}
        facilities={activePersona.id === 'maria' ? MARIA_FACILITIES : ALEX_FACILITIES}
      />
    );
  }

  // Render page content
  let pageContent: React.ReactNode;
  if (activeRoute === '/calendar') {
    pageContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
        <CalendarPageContent onOpenImport={() => setShowImportPanel(true)} />
        <CalendarView extraEvents={importedEvents} cancelledEventIds={cancelledEventIds} simulatedToday={simulatedToday} />
      </div>
    );
  } else if (activeRoute === '/facilities') {
    pageContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
        <FacilitiesPageContent onOpenClosure={() => setShowClosurePanel(true)} />
        <FacilityResourceView events={allEvents} cancelledEventIds={cancelledEventIds} simulatedToday={simulatedToday} surfaces={activePersona.id === 'maria' ? MARIA_SURFACES : ALEX_SURFACES} />
      </div>
    );
  } else if (activeRoute === '/community') {
    pageContent = <CommunityPageContent sentNotifications={sentNotifications} />;
  } else if (activeRoute === '/programs') {
    if (selectedProgram) {
      pageContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', flex: 1, minHeight: 0 }}>
          <ProgramDetailView program={selectedProgram} onBack={() => setSelectedProgram(null)} onEmailRegistrants={handleEmailRegistrants} />
        </div>
      );
    } else {
      pageContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
          <PageHeader title="Programs" description="Manage your registration programs, seasons, and events." />
          <ProgramsTable
            programs={currentPrograms}
            onProgramClick={(p) => setSelectedProgram(p)}
            selectable={activePersona.id === 'maria' && activeChapter === 'communication'}
            onMessageOverdue={handleMessageOverdue}
          />
        </div>
      );
    }
  } else if (activeRoute === '/') {
    const isAlex = activePersona.id === 'alex';
    const isMaria = activePersona.id === 'maria';

    const mariaDeskItems: DeskItem[] = isMaria && activeChapter !== 'home' ? [
      { id: 'desk-1', icon: 'assignment', label: '14 athletes unassigned to teams', detail: 'Fall Tackle Football registration' },
      { id: 'desk-2', icon: 'registration', label: '12 new registrations this week', detail: 'Flag Football is filling up fast' },
    ] : [];

    pageContent = (
      <HomePage
        showStormAlert={isAlex && activeChapter === 'communication'}
        showPaymentAlert={isMaria && activeChapter === 'communication'}
        deskItems={mariaDeskItems}
        onTakeAction={() => {
          setActiveRoute('/facilities');
          setShowClosurePanel(true);
        }}
        onReviewPrograms={() => {
          setActiveRoute('/programs');
          const overduePrograms = mariaPrograms.filter(p => (p.outstandingAmount ?? 0) > 0);
          setComposeOverduePrograms(overduePrograms);
          setShowComposePanel(true);
        }}
      />
    );
  }

  return (
    <LegacyNavigation
      key={activePersona.id}
      organization={organization}
      teams={teams}
      navItems={navItems}
      currentUser={currentUser}
      activeRoute={activeRoute}
      onNavigate={(route) => { setActiveRoute(route); setSelectedProgram(null); }}
      overlay={overlay}
    >
      {pageContent}
    </LegacyNavigation>
  );
}
