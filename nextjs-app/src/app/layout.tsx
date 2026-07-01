import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import NavigationWrapper from '@/components/NavigationWrapper';
import { ToastProvider } from '@/components/Toast';
import { getOrganizationWithNavItems, getCurrentUser } from '@/lib/data';
import VersionBadge from '@/components/VersionBadge';

const barlow = Barlow({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'Elevation Volleyball Club',
  description: 'Volleyball club management platform',
};

// Force dynamic rendering to ensure fresh data for workspace switcher
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch organization, teams, and nav items from database
  const orgData = await getOrganizationWithNavItems();
  
  // Transform to the format expected by LegacyNavigation
  const organization = orgData ? {
    id: orgData.id,
    name: orgData.name,
    primary_sport: orgData.primary_sport,
    avatar: orgData.avatar,
    primary_color: orgData.primary_color,
    secondary_color: orgData.secondary_color,
  } : null;

  const teams = orgData?.teams.map(team => ({
    id: team.id,
    title: team.title,
    sport: team.sport,
    gender: team.gender,
    avatar: team.avatar,
    primary_color: team.primary_color,
    secondary_color: team.secondary_color,
  })) || [];

  // Transform nav items for the navigation component
  const navItems = orgData?.nav_items.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    route: item.route,
    children: item.children.map(child => ({
      id: child.id,
      label: child.label,
      route: child.route,
    })),
  })) || [];

  // Get current logged-in user (school administrator for prototype)
  const userData = await getCurrentUser();
  const currentUser = userData ? {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role,
  } : null;

  return (
    <html lang="en">
      <body className={`${barlow.className} ${barlow.variable}`}>
        <ToastProvider>
          <NavigationWrapper
            organization={organization}
            teams={teams}
            navItems={navItems}
            currentUser={currentUser}
          >
            {children}
          </NavigationWrapper>
          <Suspense>
            <VersionBadge />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
