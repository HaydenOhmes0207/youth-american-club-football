import {
  mockOrganization,
  mockTeams,
  mockNavItems,
  mockUsers,
  mockTeamMembers,
} from './mock-data';

export function getOrganizationWithTeams() {
  return {
    ...mockOrganization,
    teams: mockTeams.sort((a, b) => {
      if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
      return a.title.localeCompare(b.title);
    }),
  };
}

export function getTeams() {
  return mockTeams.sort((a, b) => {
    if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
    return a.title.localeCompare(b.title);
  });
}

export function getNavItems(organizationId: string) {
  return mockNavItems
    .filter(item => item.organization_id === organizationId && item.parent_id === null && item.is_active)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      route: item.route,
      children: (item.children || [])
        .filter((child: { is_active?: boolean }) => child.is_active !== false)
        .sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0))
        .map((child: { id: string; label: string; route?: string }) => ({
          id: child.id,
          label: child.label,
          route: child.route || null,
        })),
    }));
}

export function getOrganizationWithNavItems() {
  const navItems = mockNavItems
    .filter(item => item.organization_id === mockOrganization.id && item.parent_id === null && item.is_active)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      route: item.route,
      children: (item.children || [])
        .filter((child: { is_active?: boolean }) => child.is_active !== false)
        .sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0))
        .map((child: { id: string; label: string; route?: string }) => ({
          id: child.id,
          label: child.label,
          route: child.route || null,
        })),
    }));

  const provisionedTeams = mockTeams
    .filter(team => team.status === 'provisioned')
    .sort((a, b) => {
      if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
      return a.title.localeCompare(b.title);
    });

  return {
    ...mockOrganization,
    teams: provisionedTeams,
    nav_items: navItems,
  };
}

// For prototype: Get the school administrator as the "logged in" user
export function getCurrentUser() {
  const user = mockUsers.find(u => u.role === 'school-administrator');
  if (!user) return null;

  const userTeamMembers = mockTeamMembers
    .filter(tm => tm.user_id === user.id && tm.role === 'admin')
    .map(tm => ({
      ...tm,
      teams: mockTeams.find(t => t.id === tm.team_id),
    }));

  return {
    ...user,
    team_members: userTeamMembers,
  };
}

export type OrganizationWithTeams = ReturnType<typeof getOrganizationWithTeams>;
export type OrganizationWithNavItems = ReturnType<typeof getOrganizationWithNavItems>;
export type Team = ReturnType<typeof getTeams>[number];
export type NavItem = ReturnType<typeof getNavItems>[number];
export type CurrentUser = ReturnType<typeof getCurrentUser>;
