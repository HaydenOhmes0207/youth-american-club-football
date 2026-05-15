'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import LegacyNavigation from './LegacyNavigation';

interface Organization {
  id: string;
  name: string;
  primary_sport: string | null;
  avatar: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface Team {
  id: string;
  title: string;
  sport: string | null;
  gender: string | null;
  avatar: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface NavItemChild {
  id: string;
  label: string;
  route: string | null;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string | null;
  children: NavItemChild[];
}

interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface NavigationWrapperProps {
  organization: Organization | null;
  teams: Team[];
  navItems: NavItem[];
  currentUser: CurrentUser | null;
  children: React.ReactNode;
}

export default function NavigationWrapper({ 
  organization, 
  teams,
  navItems,
  currentUser,
  children 
}: NavigationWrapperProps) {
  const pathname = usePathname();
  
  // Full-screen pages that hide navigation
  const isFullScreenPage = pathname === '/teams/manage' || pathname === '/teams/assignments';

  // If on a full-screen page, render children without navigation
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
