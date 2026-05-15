import {
  mockOrganization,
  mockTeams,
  mockNavItems,
  mockUsers,
  mockTeamMembers,
} from './mock-data';

export async function getOrganizationWithTeams() {
  return {
    ...mockOrganization,
    teams: mockTeams.sort((a, b) => {
      if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
      return a.title.localeCompare(b.title);
    }),
  };
}

export async function getTeams() {
  return mockTeams.sort((a, b) => {
    if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
    return a.title.localeCompare(b.title);
  });
}

export async function getNavItems(organizationId: string) {
  return mockNavItems
    .filter(item => item.organization_id === organizationId && item.parent_id === null && item.is_active)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      ...item,
      children: (item.children || [])
        .filter(child => child.is_active)
        .sort((a, b) => a.order - b.order),
    }));
}

export async function getOrganizationWithNavItems() {
  const navItems = mockNavItems
    .filter(item => item.organization_id === mockOrganization.id && item.parent_id === null && item.is_active)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      ...item,
      children: (item.children || [])
        .filter(child => child.is_active)
        .sort((a, b) => a.order - b.order),
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
export async function getCurrentUser() {
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

export type OrganizationWithTeams = Awaited<ReturnType<typeof getOrganizationWithTeams>>;
export type OrganizationWithNavItems = Awaited<ReturnType<typeof getOrganizationWithNavItems>>;
export type Team = Awaited<ReturnType<typeof getTeams>>[number];
export type NavItem = Awaited<ReturnType<typeof getNavItems>>[number];
export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;
