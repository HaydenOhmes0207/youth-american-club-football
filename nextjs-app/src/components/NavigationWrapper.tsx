'use client';

import React, { useState } from 'react';
import LegacyNavigation from './LegacyNavigation';
import { usePersona } from '@/lib/persona-context';
import { mockNavItems } from '@/lib/mock-data';
import PageHeader from './PageHeader';
import ProgramsTable from './ProgramsTable';
import CommunityTable from './CommunityTable';
import CalendarView from './CalendarView';
import type { ProgramWithStats } from '@/lib/actions/programs';

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

function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader title="Home" description="Welcome to your organization overview and quick actions." />
    </div>
  );
}

function CalendarPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', flex: 1, minHeight: 0 }}>
      <PageHeader title="Calendar" description="View and manage camps, clinics, and events across your organization." actions={[{ label: 'Add Event', buttonStyle: 'standard' }]} />
      <CalendarView />
    </div>
  );
}

function FacilitiesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader title="Facilities" description="Manage fields, gyms, and other facilities available for your organization." actions={[{ label: 'Add Facility', buttonStyle: 'standard' }]} />
    </div>
  );
}

function CommunityPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader title="Community" description="Manage athletes, coaches, and staff across your organization." actions={[{ label: 'Import', buttonStyle: 'minimal' }, { label: 'Add Member', buttonStyle: 'standard' }]} />
      <CommunityTable />
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

const PAGE_MAP: Record<string, React.FC> = {
  '/': HomePage,
  '/calendar': CalendarPage,
  '/facilities': FacilitiesPage,
  '/community': CommunityPage,
  '/programs': ProgramsPage,
};

export default function NavigationWrapper() {
  const { activePersona } = usePersona();
  const [activeRoute, setActiveRoute] = useState('/');

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

  const ActivePage = PAGE_MAP[activeRoute] || HomePage;

  return (
    <LegacyNavigation
      key={activePersona.id}
      organization={organization}
      teams={teams}
      navItems={navItems}
      currentUser={currentUser}
      activeRoute={activeRoute}
      onNavigate={(route) => setActiveRoute(route)}
    >
      <ActivePage />
    </LegacyNavigation>
  );
}
