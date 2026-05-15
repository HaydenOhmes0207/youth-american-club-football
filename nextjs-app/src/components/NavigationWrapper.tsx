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
import FacilityResourceView from './FacilityResourceView';
import FacilityClosurePanel from './FacilityClosurePanel';
import type { ProgramWithStats } from '@/lib/actions/programs';

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
}

const mockPrograms: ProgramWithStats[] = [
  {
    id: 'program-1',
    title: 'Fall 2025 Football Season',
    type: 'season',
    eventDates: { start: '2025-08-15', end: '2025-11-30' },
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 45,
    programValue: 1125000,
    createdBy: { firstName: 'David', lastName: 'Mitchell', avatar: null },
  },
];

function HomePage({ onTakeAction, showStormAlert }: { onTakeAction?: () => void; showStormAlert?: boolean }) {
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

function ProgramsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader title="Programs" description="Manage your registration programs, seasons, and events." />
      <ProgramsTable programs={mockPrograms} />
    </div>
  );
}

const STATIC_PAGE_MAP: Record<string, React.FC> = {
  '/programs': ProgramsPage,
};

export default function NavigationWrapper() {
  const { activePersona, activeChapter, chapterVersion } = usePersona();
  const [activeRoute, setActiveRoute] = useState('/');
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importedEvents, setImportedEvents] = useState<CalendarEvent[]>([]);
  const [cancelledEventIds, setCancelledEventIds] = useState<Set<string>>(new Set());
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [showClosurePanel, setShowClosurePanel] = useState(false);

  // Chapter switching: reset state and set initial context for each chapter
  React.useEffect(() => {
    // Reset shared state
    setShowImportPanel(false);
    setShowClosurePanel(false);
    setCancelledEventIds(new Set());
    setSentNotifications([]);

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
        setImportedEvents(getFallScheduleEvents());
        break;
      case 'external-bookings':
        setActiveRoute('/');
        setImportedEvents(getFallScheduleEvents());
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

  const handleClosure = (eventIds: string[], notification: Omit<SentNotification, 'id' | 'sentAt'>) => {
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

  const StaticPage = STATIC_PAGE_MAP[activeRoute];

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

  // Build overlay based on active route
  let overlay: React.ReactNode = null;
  if (activeRoute === '/calendar') {
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
        <FacilityResourceView events={allEvents} cancelledEventIds={cancelledEventIds} simulatedToday={simulatedToday} />
      </div>
    );
  } else if (activeRoute === '/community') {
    pageContent = <CommunityPageContent sentNotifications={sentNotifications} />;
  } else if (activeRoute === '/') {
    pageContent = (
      <HomePage
        showStormAlert={activeChapter === 'communication'}
        onTakeAction={() => {
          setActiveRoute('/facilities');
          setShowClosurePanel(true);
        }}
      />
    );
  } else if (StaticPage) {
    pageContent = <StaticPage />;
  } else {
    pageContent = (
      <HomePage
        showStormAlert={activeChapter === 'communication'}
        onTakeAction={() => {
          setActiveRoute('/facilities');
          setShowClosurePanel(true);
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
      onNavigate={(route) => setActiveRoute(route)}
      overlay={overlay}
    >
      {pageContent}
    </LegacyNavigation>
  );
}
