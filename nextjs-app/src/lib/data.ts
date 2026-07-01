// Mock data — no database connection required

export async function getOrganizationWithTeams() {
  return mockOrg;
}

export async function getTeams() {
  return mockOrg.teams;
}

export async function getNavItems(_organizationId: string) {
  return mockOrg.nav_items;
}

export async function getOrganizationWithNavItems() {
  return mockOrg;
}

export async function getCurrentUser() {
  return mockUser;
}

const mockOrg = {
  id: 'org-1',
  name: 'Elevation Volleyball Club',
  primary_sport: 'volleyball',
  type: 'club',
  avatar: 'https://cdn1.sportngin.com/attachments/logo_graphic/63c1-184412604/400_pixels_Black_Red_Black_small.jpg',
  primary_color: '#1a1a2e',
  secondary_color: '#e94560',
  created_at: new Date(),
  updated_at: new Date(),
  teams: [
    {
      id: 'team-maryville',
      title: 'Maryville High School',
      sport: 'volleyball',
      gender: 'girls',
      avatar: 'https://www.figma.com/api/mcp/asset/53a75333-071b-4fdc-90cd-657d235ccbf3',
      primary_color: '#003087',
      secondary_color: '#FFD700',
      organization_id: 'org-1',
      season_id: null,
      age_min: null,
      age_max: null,
      grades: '9-12',
      max_roster_size: null,
      status: 'active',
      season_program_id: null,
      season_registration_id: null,
      season_price_override: null,
      finalized_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ] as {
    id: string; title: string; sport: string; gender: string;
    avatar: string | null; primary_color: string | null; secondary_color: string | null;
    organization_id: string; season_id: string | null; age_min: number | null;
    age_max: number | null; grades: string | null; max_roster_size: number | null;
    status: string; season_program_id: string | null; season_registration_id: string | null;
    season_price_override: unknown; finalized_at: Date | null; created_at: Date; updated_at: Date;
  }[],
  nav_items: [
    {
      id: 'nav-1',
      label: 'Home',
      icon: 'home',
      route: '/',
      order: 0,
      parent_id: null,
      is_active: true,
      organization_id: 'org-1',
      created_at: new Date(),
      updated_at: new Date(),
      children: [],
    },
    {
      id: 'nav-2',
      label: 'Programs',
      icon: 'programs',
      route: '/programs',
      order: 1,
      parent_id: null,
      is_active: true,
      organization_id: 'org-1',
      created_at: new Date(),
      updated_at: new Date(),
      children: [],
    },
    {
      id: 'nav-3',
      label: 'Teams',
      icon: 'teams',
      route: '/teams',
      order: 2,
      parent_id: null,
      is_active: true,
      organization_id: 'org-1',
      created_at: new Date(),
      updated_at: new Date(),
      children: [],
    },
  ],
};

const mockUser = {
  id: 'user-1',
  email: 'admin@elevationvbc.com',
  first_name: 'Admin',
  last_name: 'User',
  role: 'school-administrator',
  avatar: null,
  created_at: new Date(),
  team_members: [],
};

export type OrganizationWithTeams = typeof mockOrg;
export type OrganizationWithNavItems = typeof mockOrg;
export type Team = typeof mockOrg.teams[number];
export type NavItem = typeof mockOrg.nav_items[number];
export type CurrentUser = typeof mockUser;
