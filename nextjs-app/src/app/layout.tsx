import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import './globals.css';
import '@/components/components.css';
import NavigationWrapper from '@/components/NavigationWrapper';
import { ToastProvider } from '@/components/Toast';
import { getOrganizationWithNavItems, getCurrentUser } from '@/lib/data';

const barlow = Barlow({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'Youth American Club Football',
  description: 'Youth football club management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgData = getOrganizationWithNavItems();
  const userData = getCurrentUser();

  const organization = orgData ? {
    id: orgData.id,
    name: orgData.name,
    primary_sport: orgData.primary_sport,
    avatar: orgData.avatar,
    primary_color: orgData.primary_color,
    secondary_color: orgData.secondary_color,
  } : null;

  const teams = (orgData?.teams ?? []).map(team => ({
    id: team.id,
    title: team.title,
    sport: team.sport,
    gender: team.gender,
    avatar: team.avatar ?? null,
    primary_color: team.primary_color,
    secondary_color: team.secondary_color,
  }));

  const navItems = (orgData?.nav_items ?? []).map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    route: item.route,
    children: item.children.map(child => ({
      id: child.id,
      label: child.label,
      route: child.route,
    })),
  }));

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
        </ToastProvider>
      </body>
    </html>
  );
}
