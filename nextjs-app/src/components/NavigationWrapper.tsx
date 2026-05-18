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
import DashboardHome, { type TaskItem } from './DashboardHome';
import CamerasView from './CamerasView';

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
    id: 'alex-varsity-fall',
    title: 'Varsity Football - Fall 2026',
    type: 'season',
    eventDates: { start: '2026-08-15', end: '2026-11-22' },
    keyDates: 'Aug 15 – Nov 22, 2026',
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 52,
    programValue: 0,
    teamCount: 1,
    feePerPlayer: 350,
    paidPercent: 88,
    outstandingAmount: 2_100,
    totalRevenue: 15_750,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-jv-fall',
    title: 'JV Football - Fall 2026',
    type: 'season',
    eventDates: { start: '2026-08-15', end: '2026-11-08' },
    keyDates: 'Aug 15 – Nov 8, 2026',
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 48,
    programValue: 0,
    teamCount: 1,
    feePerPlayer: 300,
    paidPercent: 92,
    outstandingAmount: 1_200,
    totalRevenue: 13_200,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-freshman-fall',
    title: 'Freshman Football - Fall 2026',
    type: 'season',
    eventDates: { start: '2026-08-15', end: '2026-10-25' },
    keyDates: 'Aug 15 – Oct 25, 2026',
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 45,
    programValue: 0,
    teamCount: 1,
    feePerPlayer: 275,
    paidPercent: 85,
    outstandingAmount: 1_925,
    totalRevenue: 10_725,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-summer-camp',
    title: 'Summer Football Camp',
    type: 'camp',
    eventDates: { start: '2026-06-15', end: '2026-06-19' },
    keyDates: 'Jun 15 – 19, 2026',
    visibility: 'public',
    registrationStatus: 'closed',
    status: 'published',
    registrantCount: 87,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 150,
    paidPercent: 100,
    outstandingAmount: 0,
    totalRevenue: 13_050,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-spring-training',
    title: 'Spring Conditioning Program',
    type: 'clinic',
    eventDates: { start: '2026-03-09', end: '2026-05-15' },
    keyDates: 'Mar 9 – May 15, 2026',
    visibility: 'public',
    registrationStatus: 'closed',
    status: 'published',
    registrantCount: 68,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 75,
    paidPercent: 100,
    outstandingAmount: 0,
    totalRevenue: 5_100,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-7on7',
    title: '7-on-7 Summer League',
    type: 'season',
    eventDates: { start: '2026-06-22', end: '2026-07-26' },
    keyDates: 'Jun 22 – Jul 26, 2026',
    visibility: 'public',
    registrationStatus: 'closed',
    status: 'published',
    registrantCount: 35,
    programValue: 0,
    teamCount: 1,
    feePerPlayer: 125,
    paidPercent: 100,
    outstandingAmount: 0,
    totalRevenue: 4_375,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-weight-room',
    title: 'Off-Season Weight Training',
    type: 'clinic',
    eventDates: { start: '2026-01-12', end: '2026-02-28' },
    keyDates: 'Jan 12 – Feb 28, 2026',
    visibility: 'private',
    registrationStatus: 'closed',
    status: 'published',
    registrantCount: 92,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 0,
    paidPercent: 100,
    outstandingAmount: 0,
    totalRevenue: 0,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-qb-camp',
    title: 'QB & Receiver Skills Camp',
    type: 'camp',
    eventDates: { start: '2026-07-13', end: '2026-07-17' },
    keyDates: 'Jul 13 – 17, 2026',
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 28,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 200,
    paidPercent: 75,
    outstandingAmount: 1_400,
    totalRevenue: 4_200,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-lineman-camp',
    title: 'Lineman Development Camp',
    type: 'camp',
    eventDates: { start: '2026-07-20', end: '2026-07-24' },
    keyDates: 'Jul 20 – 24, 2026',
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 24,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 175,
    paidPercent: 80,
    outstandingAmount: 840,
    totalRevenue: 3_360,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-film-study',
    title: 'Film Study Sessions',
    type: 'clinic',
    eventDates: { start: '2026-08-01', end: '2026-08-14' },
    keyDates: 'Aug 1 – 14, 2026',
    visibility: 'private',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 55,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 0,
    paidPercent: 100,
    outstandingAmount: 0,
    totalRevenue: 0,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
  {
    id: 'alex-winter-2027',
    title: 'Winter 2027 Prep Program',
    type: 'clinic',
    eventDates: { start: '2027-01-06', end: '2027-02-28' },
    keyDates: 'Jan 6 – Feb 28, 2027',
    visibility: 'public',
    registrationStatus: 'open',
    status: 'draft',
    registrantCount: 0,
    programValue: 0,
    teamCount: 0,
    feePerPlayer: 100,
    paidPercent: 0,
    outstandingAmount: 0,
    totalRevenue: 0,
    createdBy: { id: 'user-alex', firstName: 'Sarah', lastName: 'Mitchell', avatar: null },
  },
];

const mariaPrograms: ProgramWithStats[] = [
  {
    id: 'mp-tackle', title: 'Fall Tackle Football', type: 'season',
    eventDates: { start: '2026-08-10', end: '2026-11-14' },
    keyDates: 'Aug 10 – Nov 14, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 186, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Jeff', lastName: 'Rodriguez', avatar: null },
    teamCount: 12, feePerPlayer: 285, paidPercent: 74, outstandingAmount: 13_680, totalRevenue: 39_330,
  },
  {
    id: 'mp-flag', title: 'Fall Flag Football', type: 'season',
    eventDates: { start: '2026-09-06', end: '2026-10-25' },
    keyDates: 'Sep 6 – Oct 25, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 112, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Jeff', lastName: 'Rodriguez', avatar: null },
    teamCount: 8, feePerPlayer: 125, outstandingAmount: 2_500, totalRevenue: 11_500, paidPercent: 82,
  },
  {
    id: 'mp-cheer', title: 'Fall Cheer', type: 'season',
    eventDates: { start: '2026-08-10', end: '2026-11-14' },
    keyDates: 'Aug 10 – Nov 14, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 64, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Jeff', lastName: 'Rodriguez', avatar: null },
    teamCount: 4, feePerPlayer: 195, outstandingAmount: 1_365, totalRevenue: 11_115, paidPercent: 89,
  },
  {
    id: 'mp-camp', title: 'Summer Skills Camp', type: 'camp',
    eventDates: { start: '2026-06-15', end: '2026-06-19' },
    keyDates: 'Jun 15 – 19, 2026',
    visibility: 'public', registrationStatus: 'closed', status: 'published',
    registrantCount: 78, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Jeff', lastName: 'Rodriguez', avatar: null },
    teamCount: 0, feePerPlayer: 85, outstandingAmount: 0, totalRevenue: 6_630, paidPercent: 100,
  },
  {
    id: 'mp-combine', title: 'Spring Combine & Evaluation', type: 'clinic',
    eventDates: { start: '2026-04-18', end: '2026-04-18' },
    keyDates: 'Apr 18, 2026',
    visibility: 'public', registrationStatus: 'closed', status: 'published',
    registrantCount: 134, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Jeff', lastName: 'Rodriguez', avatar: null },
    teamCount: 0, feePerPlayer: 35, outstandingAmount: 0, totalRevenue: 4_690, paidPercent: 100,
  },
  {
    id: 'mp-equip', title: 'Equipment Fitting Day', type: 'clinic',
    eventDates: { start: '2026-07-25', end: '2026-07-25' },
    keyDates: 'Jul 25, 2026',
    visibility: 'public', registrationStatus: 'open', status: 'published',
    registrantCount: 210, programValue: 0,
    createdBy: { id: 'user-maria', firstName: 'Jeff', lastName: 'Rodriguez', avatar: null },
    teamCount: 0, feePerPlayer: 0, outstandingAmount: 0, totalRevenue: 0, paidPercent: 100,
  },
];

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

function BookingListItem({ request, onReview, isOutgoing }: { request: BookingRequest; onReview: () => void; isOutgoing?: boolean }) {
  const statusLabel = request.status === 'pending'
    ? (isOutgoing ? 'Awaiting Response' : 'Pending Review')
    : request.status === 'approved' ? 'Approved' : 'Declined';

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
          {statusLabel}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </button>
  );
}

function CommunityPageContent({ sentNotifications, personaId, onContactMembers }: { sentNotifications: SentNotification[]; personaId: 'alex' | 'maria'; onContactMembers: (members: { name: string; email: string }[]) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
      <PageHeader title="Community" description="Manage athletes, coaches, and staff across your organization." actions={[{ label: 'Import', buttonStyle: 'minimal' }, { label: 'Add Member', buttonStyle: 'standard' }]} />
      <CommunityTable sentNotifications={sentNotifications} personaId={personaId} onContactMembers={onContactMembers} />
    </div>
  );
}

/* ProgramsPage is now rendered inline with persona-specific data */

interface NavigationWrapperProps {
  onBackToLanding?: () => void;
}

export default function NavigationWrapper({ onBackToLanding }: NavigationWrapperProps) {
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
  const [communityRecipients, setCommunityRecipients] = useState<{ name: string; email: string }[]>([]);
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
    fromOrg: 'Northwest Junior Football Club',
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

    switch (activeChapter) {
      case 'home':
        setActiveRoute('/');
        setImportedEvents([]);
        setFacilitiesTab('schedule');
        break;
      case 'schedule-ingest':
        setActiveRoute('/calendar');
        setImportedEvents([]);
        setFacilitiesTab('schedule');
        break;
      case 'communication':
        setActiveRoute('/');
        if (activePersona.id !== 'maria') {
          setImportedEvents(getFallScheduleEvents());
        } else {
          setImportedEvents([]);
        }
        setFacilitiesTab('schedule');
        break;
      case 'operations':
        setActiveRoute('/programs');
        setImportedEvents([]);
        setFacilitiesTab('schedule');
        break;
      case 'cameras':
        setActiveRoute('/cameras');
        setImportedEvents(getFallScheduleEvents());
        setFacilitiesTab('schedule');
        break;
      case 'camera-access-granted':
        setActiveRoute('/');
        setImportedEvents(getFallScheduleEvents());
        setFacilitiesTab('schedule');
        break;
      case 'booking-request':
        setActiveRoute('/facilities');
        setFacilitiesTab('bookings');
        setImportedEvents([]);
        break;
      default:
        setActiveRoute('/');
        setImportedEvents([]);
        setFacilitiesTab('schedule');
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
      title: 'Championship Saturday - Northwest Jr. Football',
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
    setCommunityRecipients([]);
    setShowComposePanel(true);
  };

  const handleContactCommunityMembers = (members: { name: string; email: string }[]) => {
    setCommunityRecipients(members);
    setComposeRecipients([]);
    setComposeOverduePrograms([]);
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
    setCommunityRecipients([]);
    showToast(`Message sent to ${payload.recipientCount} ${communityRecipients.length > 0 ? 'members' : 'families'}`, 'success');
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
      children: item.children
        .filter(child => child.is_active)
        .sort((a, b) => a.order - b.order)
        .map(child => ({
          id: child.id,
          label: child.label,
          route: child.route,
        })),
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
      case 'cameras': return new Date(2026, 10, 7); // Nov 7
      case 'camera-access-granted': return new Date(2026, 10, 7); // Nov 7
      case 'booking-request': return new Date(2026, 6, 16);  // Jul 16 (planning ahead)
      default: return undefined;
    }
  }, [activeChapter]);

  // Collect all events for facilities view
  // In Maria's chapter 4, her booking has been approved so events are no longer pending
  const isMariaChapter4 = activePersona.id === 'maria' && activeChapter === 'booking-request';
  const baseEvents = [...(EVENTS_BY_PERSONA[activePersona.id] || []), ...importedEvents];
  
  // For Maria's chapter 4, add the confirmed Championship Saturday event if not already in importedEvents
  const chapter4Event: CalendarEvent | null = isMariaChapter4 && importedEvents.length === 0 ? {
    id: 'confirmed-champ-saturday',
    title: 'Championship Saturday',
    date: new Date(2026, 10, 7),
    time: '8:00 AM',
    endTime: '9:00 PM',
    location: 'Spartan Field',
    sport: 'Football',
    type: 'other',
    color: '#16a34a', // Green for confirmed
    isExternal: true,
    isPending: false,
  } : null;
  
  const allEvents = isMariaChapter4
    ? [
        ...baseEvents.map(e => ({ ...e, isPending: false })), // Mark all as confirmed
        ...(chapter4Event ? [chapter4Event] : []),
      ]
    : baseEvents;

  // Build overlay based on active route or compose panel
  let overlay: React.ReactNode = null;
  const isBulkOverdue = showComposePanel && composeOverduePrograms.length > 0;
  const isRegistrantCompose = showComposePanel && selectedProgram && composeRecipients.length > 0;
  const isCommunityCompose = showComposePanel && communityRecipients.length > 0;
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
  } else if (isCommunityCompose) {
    overlay = (
      <MessageComposePanel
        isOpen
        onClose={() => { setShowComposePanel(false); setCommunityRecipients([]); }}
        senderName={`${activePersona.firstName} ${activePersona.lastName}`}
        onSend={handleMessageSend}
        communityMembers={communityRecipients}
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
    // Build the correct request object based on persona and chapter
    const panelRequest: BookingRequest = activePersona.id === 'maria'
      ? {
          ...mariaBookingRequest,
          status: activeChapter === 'booking-request' ? 'approved' : 'pending',
          fromOrg: 'Memorial Stadium',
          fromDirector: 'Alex Thompson',
          fromRole: 'Athletic Director',
        }
      : { ...mariaBookingRequest, status: bookingApproved ? 'approved' : 'pending' };

    overlay = (
      <BookingRequestPanel
        isOpen={showBookingPanel}
        onClose={() => setShowBookingPanel(false)}
        request={panelRequest}
        onApprove={handleBookingApprove}
        onDecline={() => setShowBookingPanel(false)}
        isOutgoing={activePersona.id === 'maria'}
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
    // For Maria's chapter 4, include the confirmed Championship Saturday event
    const calendarExtraEvents = isMariaChapter4
      ? [...importedEvents.map(e => ({ ...e, isPending: false })), ...(chapter4Event ? [chapter4Event] : [])]
      : importedEvents;

    pageContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
        <CalendarPageContent onOpenImport={() => setShowImportPanel(true)} />
        <CalendarView extraEvents={calendarExtraEvents} cancelledEventIds={cancelledEventIds} simulatedToday={simulatedToday} />
      </div>
    );
  } else if (activeRoute === '/facilities') {
    // Build bookings list
    const bookingRequests: BookingRequest[] = [];
    if (activePersona.id === 'alex' && activeChapter === 'cameras') {
      // Alex sees Maria's incoming request
      bookingRequests.push({ ...mariaBookingRequest, status: bookingApproved ? 'approved' : 'pending' });
    } else if (activePersona.id === 'maria' && (bookingRequestSubmitted || activeChapter === 'booking-request')) {
      // Maria sees her own outgoing request
      // In chapter 4 (booking-request), the booking has been approved by Alex
      const isApprovedInChapter4 = activeChapter === 'booking-request';
      bookingRequests.push({
        ...mariaBookingRequest,
        status: isApprovedInChapter4 ? 'approved' : 'pending',
        fromOrg: 'Memorial Stadium', // Flip perspective -- she requested FROM Memorial Stadium
        fromDirector: 'Alex Thompson',
        fromRole: 'Athletic Director',
      });
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
                <BookingListItem key={req.id} request={req} onReview={() => setShowBookingPanel(true)} isOutgoing={activePersona.id === 'maria'} />
              ))
            )}
          </div>
        )}
      </div>
    );
  } else if (activeRoute === '/community') {
    pageContent = <CommunityPageContent sentNotifications={sentNotifications} personaId={activePersona.id as 'alex' | 'maria'} onContactMembers={handleContactCommunityMembers} />;
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
  } else if (activeRoute === '/cameras') {
    pageContent = (
      <CamerasView venueName={activePersona.id === 'maria' ? 'Westside Fields' : 'Northwest High School'} />
    );
  } else if (activeRoute === '/tickets') {
    pageContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
        <PageHeader title="Tickets" description="Manage event tickets, sales, and admissions." />
        <ProgramsTable
          programs={[]}
          onProgramClick={() => {}}
          selectable={false}
        />
      </div>
    );
  } else if (activeRoute === '/') {
    const isAlex = activePersona.id === 'alex';
    const isMaria = activePersona.id === 'maria';

    // Build tasks from current alerts
    const dashboardTasks: TaskItem[] = [];

    // Alex: Storm alert (communication chapter)
    if (isAlex && activeChapter === 'communication') {
      dashboardTasks.push({
        id: 'storm-alert',
        category: 'facility',
        categoryLabel: 'Facility',
        timestamp: '2h ago',
        title: 'Severe Weather Alert',
        description: 'Thunderstorm warning for Friday, Sep 4. Consider closing outdoor facilities.',
        variant: 'warning',
        onClick: () => {
          setActiveRoute('/facilities');
          setShowClosurePanel(true);
        },
      });
    }

    // Alex: Cameras chapter - navigate to cameras
    if (isAlex && activeChapter === 'cameras') {
      setActiveRoute('/cameras');
    }

    // Maria: Payment alert (communication chapter)
    if (isMaria && activeChapter === 'communication') {
      dashboardTasks.push({
        id: 'payment-alert',
        category: 'programs',
        categoryLabel: 'Programs',
        timestamp: '40m ago',
        title: 'Overdue Payments',
        description: '$17,545 outstanding across 3 programs. 72 families need follow-up.',
        variant: 'warning',
        onClick: () => {
          setActiveRoute('/programs');
          const overduePrograms = mariaPrograms.filter(p => (p.outstandingAmount ?? 0) > 0);
          setComposeOverduePrograms(overduePrograms);
          setShowComposePanel(true);
        },
      });
    }

    // Maria: Registration tasks (non-home chapters)
    if (isMaria && activeChapter !== 'home') {
      dashboardTasks.push({
        id: 'new-signups',
        category: 'programs',
        categoryLabel: 'Programs',
        timestamp: '8m ago',
        title: 'New Signups',
        description: '7 new athletes registered overnight for the Summer Camp program.',
        onClick: () => setActiveRoute('/programs'),
      });
    }

    // Maria (Jeff): Camera access granted notification
    if (isMaria && activeChapter === 'camera-access-granted') {
      dashboardTasks.push({
        id: 'camera-access-granted',
        category: 'facility',
        categoryLabel: 'Facility',
        timestamp: '15m ago',
        title: 'Camera Access Granted',
        description: 'Northwest High School has granted you camera access to Memorial Stadium for Nov 7.',
        variant: 'success',
        onClick: () => {
          setActiveRoute('/schedule');
        },
      });
    }

    // Alex: Facility change task
    if (isAlex && activeChapter !== 'home') {
      dashboardTasks.push({
        id: 'facility-change',
        category: 'facility',
        categoryLabel: 'Facility',
        timestamp: '2h ago',
        title: 'Facility Change',
        description: 'Practice has moved from Field 2 to Field 4 for the week.',
        onClick: () => setActiveRoute('/facilities'),
      });
    }

    // Default generic tasks if none are set (for demo purposes)
    if (dashboardTasks.length === 0) {
      if (isAlex) {
        dashboardTasks.push(
          {
            id: 'alex-equipment',
            category: 'facility',
            categoryLabel: 'Facility',
            timestamp: '1h ago',
            title: 'Equipment Check',
            description: 'Varsity equipment inventory due before Friday practice.',
            onClick: () => setActiveRoute('/facilities'),
          },
          {
            id: 'alex-roster',
            category: 'programs',
            categoryLabel: 'Programs',
            timestamp: '3h ago',
            title: 'Roster Update',
            description: '3 athletes need medical clearance forms submitted.',
            onClick: () => setActiveRoute('/programs'),
          },
          {
            id: 'alex-film',
            category: 'programs',
            categoryLabel: 'Programs',
            timestamp: '5h ago',
            title: 'Film Review',
            description: 'Upload game film from last Saturday for team review session.',
            onClick: () => setActiveRoute('/programs'),
          }
        );
      } else if (isMaria) {
        dashboardTasks.push(
          {
            id: 'maria-registration',
            category: 'registration',
            categoryLabel: 'Registration',
            timestamp: '45m ago',
            title: 'Pending Approvals',
            description: '12 new registrations awaiting review for Fall Season.',
            onClick: () => setActiveRoute('/programs'),
          },
          {
            id: 'maria-volunteer',
            category: 'programs',
            categoryLabel: 'Programs',
            timestamp: '2h ago',
            title: 'Volunteer Signup',
            description: 'Need 4 more parent volunteers for Saturday concessions.',
            onClick: () => setActiveRoute('/community'),
          },
          {
            id: 'maria-uniform',
            category: 'programs',
            categoryLabel: 'Programs',
            timestamp: '4h ago',
            title: 'Uniform Distribution',
            description: '8U team uniforms arriving Wednesday - schedule pickup times.',
            onClick: () => setActiveRoute('/programs'),
          }
        );
      }
    }

    pageContent = (
      <DashboardHome
        personaId={activePersona.id as 'alex' | 'maria'}
        tasks={dashboardTasks}
        simulatedToday={simulatedToday}
        onNavigateToCalendar={() => setActiveRoute('/calendar')}
        events={allEvents}
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
      onLogout={onBackToLanding}
      overlay={overlay}
    >
      {pageContent}
    </LegacyNavigation>
  );
}
