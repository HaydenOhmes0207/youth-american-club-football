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
import type { ManualEventResult } from './ScheduleImportPanel';
import FacilityResourceView, { ALEX_SURFACES, MARIA_SURFACES } from './FacilityResourceView';
import FacilityClosurePanel, { ALEX_FACILITIES, MARIA_FACILITIES } from './FacilityClosurePanel';
import ProgramDetailView from './ProgramDetailView';
import type { Registrant } from './ProgramDetailView';
import MessageComposePanel from './MessageComposePanel';
import type { MessagePayload } from './MessageComposePanel';
import type { ProgramWithStats } from '@/lib/actions/programs';
import BookingRequestPanel from './BookingRequestPanel';
import type { BookingRequest } from './BookingRequestPanel';
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
  showBookingAlert?: boolean;
  onReviewPrograms?: () => void;
  onReviewBooking?: () => void;
  deskItems?: DeskItem[];
}

function HomePage({ onTakeAction, showStormAlert, showPaymentAlert, showBookingAlert, onReviewPrograms, onReviewBooking, deskItems }: HomePageProps) {
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
      {showBookingAlert && (
        <div className="booking-alert-card">
          <div className="booking-alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="booking-alert-content">
            <div className="booking-alert-title">Facility Booking Request</div>
            <div className="booking-alert-desc"><strong>Lincoln Junior Football Club</strong> is requesting <strong>Spartan Field &ndash; Memorial Stadium</strong> for Championship Saturday on <strong>November 7</strong>. Includes camera &amp; streaming access.</div>
          </div>
          <button className="booking-alert-action" onClick={onReviewBooking}>Review Request</button>
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
        actions={[{ label: 'Add Event', buttonStyle: 'standard' as const, onClick: onOpenImport }]}
      />
    </>
  );
}

function FacilitiesPageContent({ onOpenClosure, activeTab, onTabChange }: {
  onOpenClosure: () => void;
  activeTab: 'schedule' | 'bookings';
  onTabChange: (tab: 'schedule' | 'bookings') => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <PageHeader
        title="Facilities"
        description="Manage fields, gyms, and other facilities available for your organization."
        actions={[
          { label: 'Close Facilities', buttonStyle: 'minimal', onClick: onOpenClosure },
          { label: 'Add Facility', buttonStyle: 'standard' },
        ]}
      />
      <div className="facility-tabs">
        <button
          className={`facility-tab ${activeTab === 'schedule' ? 'facility-tab--active' : ''}`}
          onClick={() => onTabChange('schedule')}
        >Schedule</button>
        <button
          className={`facility-tab ${activeTab === 'bookings' ? 'facility-tab--active' : ''}`}
          onClick={() => onTabChange('bookings')}
        >Bookings</button>
      </div>
    </div>
  );
}

function BookingListItem({ request, onReview }: { request: BookingRequest; onReview: () => void }) {
  return (
    <button className="booking-list-item" onClick={onReview}>
      <div className="booking-list-item-left">
        <div className="booking-list-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
        </div>
        <div className="booking-list-info">
          <span className="booking-list-org">{request.fromOrg}</span>
          <span className="booking-list-detail">{request.eventTitle} &middot; {request.facility} &middot; {request.dateLabel}</span>
        </div>
      </div>
      <div className="booking-list-item-right">
        <span className={`booking-list-status booking-list-status--${request.status}`}>
          {request.status === 'pending' ? 'Pending Review' : request.status === 'approved' ? 'Approved' : 'Declined'}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </button>
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
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [bookingApproved, setBookingApproved] = useState(false);
  const [facilitiesTab, setFacilitiesTab] = useState<'schedule' | 'bookings'>('schedule');
  const [bookingRequestSubmitted, setBookingRequestSubmitted] = useState(false);
  const [submittedEventResult, setSubmittedEventResult] = useState<ManualEventResult | null>(null);
  const { showToast } = useToast();

  const AMENITY_ID_TO_BOOKING: Record<string, { label: string; icon: 'camera' | 'scoreboard' | 'pa' | 'pressbox' }> = {
    camera: { label: 'Camera / Streaming', icon: 'camera' },
    scoreboard: { label: 'Scoreboard', icon: 'scoreboard' },
    pa: { label: 'PA System', icon: 'pa' },
    pressbox: { label: 'Press Box', icon: 'pressbox' },
  };

  const mariaBookingRequest: BookingRequest = {
    id: 'booking-1',
    fromOrg: 'Lincoln Junior Football Club',
    fromDirector: 'Maria Rodriguez',
    fromRole: 'Club Director',
    facility: 'Spartan Field',
    venue: 'Memorial Stadium',
    date: submittedEventResult?.date || '2026-11-07',
    dateLabel: submittedEventResult
      ? new Date(submittedEventResult.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'Saturday, November 7, 2026',
    timeBlock: submittedEventResult?.timeBlock || '8:00 AM - 6:00 PM',
    eventTitle: submittedEventResult?.title || 'Championship Saturday',
    description: submittedEventResult?.description || 'End-of-season championship games for our youth tackle football program. Four title games across age divisions (3rd-6th grade). Expected attendance: ~400 families.',
    amenities: submittedEventResult
      ? submittedEventResult.amenities.map(id => AMENITY_ID_TO_BOOKING[id]).filter(Boolean)
      : [
          { label: 'Camera / Streaming', icon: 'camera' },
          { label: 'Scoreboard', icon: 'scoreboard' },
          { label: 'PA System', icon: 'pa' },
        ],
    status: 'pending',
  };

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
    setShowBookingPanel(false);
    setBookingApproved(false);
    setBookingRequestSubmitted(false);
    setSubmittedEventResult(null);
    setFacilitiesTab('schedule');

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
        setBookingApproved(false);
        break;
      case 'booking-request':
        setActiveRoute('/calendar');
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

  const handleBookingApprove = (_request: BookingRequest) => {
    setBookingApproved(true);
    // Add the championship event to imported events so it shows on the resource view
    const champEvent: CalendarEvent = {
      id: 'ext-champ-saturday',
      title: 'Championship Saturday - Lincoln Jr. Football',
      date: new Date(2026, 10, 7),
      time: '8:00 AM',
      endTime: '6:00 PM',
      location: 'Memorial Stadium',
      sport: 'Football',
      type: 'game',
      color: '#14b8a6',
      isExternal: true,
    };
    setImportedEvents(prev => [...prev, champEvent]);
  };

  const handleEventCreate = (result: ManualEventResult) => {
    const [startTime, endTime] = result.timeBlock.split(' - ');
    const dateParts = result.date.split('-');
    const eventDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
    const pendingEvent: CalendarEvent = {
      id: `pending-${Date.now()}`,
      title: result.title,
      date: eventDate,
      time: startTime,
      endTime: endTime,
      location: result.location,
      sport: 'Football',
      type: 'game',
      color: result.isExternal ? '#d97706' : '#1a2744',
      isExternal: result.isExternal,
      isPending: true,
    };
    setImportedEvents(prev => [...prev, pendingEvent]);
    setShowImportPanel(false);
    setBookingRequestSubmitted(true);
    setSubmittedEventResult(result);
    showToast(
      result.isExternal
        ? `Booking request sent to ${result.externalOrg}`
        : `Event "${result.title}" saved`,
      'success'
    );
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
      case 'external-bookings': return new Date(2026, 10, 7); // Nov 7
      case 'booking-request': return new Date(2026, 6, 16);  // Jul 16 (planning ahead)
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
        onManualSubmit={handleEventCreate}
      />
    );
  } else if (activeRoute === '/facilities' && showBookingPanel) {
    overlay = (
      <BookingRequestPanel
        isOpen={showBookingPanel}
        onClose={() => setShowBookingPanel(false)}
        request={mariaBookingRequest}
        onApprove={handleBookingApprove}
        onDecline={() => setShowBookingPanel(false)}
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
    // Build bookings list -- Alex sees Maria's request when it's been submitted
    const bookingRequests: BookingRequest[] = [];
    if (isAlex && activeChapter === 'external-bookings') {
      bookingRequests.push({ ...mariaBookingRequest, status: bookingApproved ? 'approved' : 'pending' });
    }

    pageContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
        <FacilitiesPageContent
          onOpenClosure={() => setShowClosurePanel(true)}
          activeTab={facilitiesTab}
          onTabChange={setFacilitiesTab}
        />
        {facilitiesTab === 'schedule' ? (
          <FacilityResourceView events={allEvents} cancelledEventIds={cancelledEventIds} simulatedToday={simulatedToday} surfaces={activePersona.id === 'maria' ? MARIA_SURFACES : ALEX_SURFACES} />
        ) : (
          <div className="booking-list">
            {bookingRequests.length === 0 ? (
              <div className="booking-list-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
                <span>No booking requests</span>
              </div>
            ) : (
              bookingRequests.map(req => (
                <BookingListItem key={req.id} request={req} onReview={() => setShowBookingPanel(true)} />
              ))
            )}
          </div>
        )}
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
        showBookingAlert={isAlex && activeChapter === 'external-bookings' && !bookingApproved}
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
        onReviewBooking={() => {
          setActiveRoute('/facilities');
          setFacilitiesTab('bookings');
          setShowBookingPanel(true);
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
