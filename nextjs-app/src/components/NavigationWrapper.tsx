'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import LegacyNavigation from './LegacyNavigation';
import { usePersona } from '@/lib/persona-context';
import { mockNavItems } from '@/lib/mock-data';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activePersona } = usePersona();

  // Full-screen pages that hide navigation
  const isFullScreenPage = pathname === '/teams/manage' || pathname === '/teams/assignments';

  const organization = {
    id: activePersona.orgId,
    name: activePersona.orgName,
    primary_sport: 'Football',
    avatar: null as string | null,
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
        { id: 'team-cl-1', title: 'U14 Lions', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#16a34a', secondary_color: '#ffffff' },
        { id: 'team-cl-2', title: 'U12 Cubs', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#16a34a', secondary_color: '#ffffff' },
        { id: 'team-cl-3', title: 'U10 Bears', sport: 'Football', gender: 'Male', avatar: null, primary_color: '#16a34a', secondary_color: '#ffffff' },
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

  if (isFullScreenPage) {
    return <>{children}</>;
  }

  return (
    <LegacyNavigation 
      organization={organization} 
      teams={teams} 
      navItems={navItems}
      currentUser={currentUser}
    >
      {children}
    </LegacyNavigation>
  );
}
