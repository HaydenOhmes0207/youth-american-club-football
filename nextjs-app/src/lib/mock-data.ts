// Mock data for prototype - no database connection required

export const mockOrganization = {
  id: 'org-1',
  name: 'Lincoln Youth Football',
  slug: 'lincoln-youth-football',
  avatar: null,
  primary_sport: 'Football',
  primary_color: '#1e40af',
  secondary_color: '#fbbf24',
};

export const mockSeasons = [
  { id: 'season-1', organization_id: 'org-1', name: '2025-2026', is_active: true },
  { id: 'season-2', organization_id: 'org-1', name: '2026-2027', is_active: false },
];

export const mockTeams = [
  {
    id: 'team-1',
    organization_id: 'org-1',
    season_id: 'season-1',
    title: 'Lions Varsity',
    sport: 'Football',
    gender: 'Male',
    grades: '11,12',
    avatar: null,
    primary_color: '#1e40af',
    secondary_color: '#fbbf24',
    status: 'provisioned',
    max_roster_size: 45,
    age_min: 16,
    age_max: 18,
  },
  {
    id: 'team-2',
    organization_id: 'org-1',
    season_id: 'season-1',
    title: 'Lions JV',
    sport: 'Football',
    gender: 'Male',
    grades: '9,10',
    avatar: null,
    primary_color: '#1e40af',
    secondary_color: '#fbbf24',
    status: 'provisioned',
    max_roster_size: 40,
    age_min: 14,
    age_max: 16,
  },
  {
    id: 'team-3',
    organization_id: 'org-1',
    season_id: 'season-1',
    title: 'Cubs Freshman',
    sport: 'Football',
    gender: 'Male',
    grades: '9',
    avatar: null,
    primary_color: '#16a34a',
    secondary_color: '#ffffff',
    status: 'provisioned',
    max_roster_size: 35,
    age_min: 13,
    age_max: 15,
  },
  {
    id: 'team-4',
    organization_id: 'org-1',
    season_id: 'season-1',
    title: '8th Grade Eagles',
    sport: 'Football',
    gender: 'Male',
    grades: '8',
    avatar: null,
    primary_color: '#dc2626',
    secondary_color: '#000000',
    status: 'draft',
    max_roster_size: 30,
    age_min: 12,
    age_max: 14,
  },
];

export const mockUsers = [
  {
    id: 'user-1',
    first_name: 'David',
    last_name: 'Mitchell',
    email: 'david.mitchell@lincoln.edu',
    role: 'school-administrator',
    avatar: null,
  },
  {
    id: 'user-2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@lincoln.edu',
    role: 'team-admin',
    avatar: null,
  },
  {
    id: 'user-3',
    first_name: 'Mike',
    last_name: 'Thompson',
    email: 'mike.thompson@lincoln.edu',
    role: 'coach',
    avatar: null,
  },
];

export const mockNavItems = [
  {
    id: 'nav-1',
    organization_id: 'org-1',
    parent_id: null,
    label: 'Home',
    route: '/',
    icon: 'home',
    order: 1,
    is_active: true,
    children: [],
  },
  {
    id: 'nav-2',
    organization_id: 'org-1',
    parent_id: null,
    label: 'Calendar',
    route: '/calendar',
    icon: 'calendar',
    order: 2,
    is_active: true,
    children: [],
  },
  {
    id: 'nav-3',
    organization_id: 'org-1',
    parent_id: null,
    label: 'Facilities',
    route: '/facilities',
    icon: 'facilities',
    order: 3,
    is_active: true,
    children: [],
  },
  {
    id: 'nav-4',
    organization_id: 'org-1',
    parent_id: null,
    label: 'Community',
    route: '/community',
    icon: 'community',
    order: 4,
    is_active: true,
    children: [],
  },
  {
    id: 'nav-5',
    organization_id: 'org-1',
    parent_id: null,
    label: 'Programs',
    route: '/programs',
    icon: 'programs',
    order: 5,
    is_active: true,
    children: [],
  },
  {
    id: 'nav-6',
    organization_id: 'org-1',
    parent_id: null,
    label: 'Tickets',
    route: '/tickets',
    icon: 'tickets',
    order: 6,
    is_active: true,
    children: [],
  },
];

export const mockPrograms = [
  {
    id: 'program-1',
    organization_id: 'org-1',
    title: 'Fall 2025 Football Season',
    type: 'season',
    event_dates: { start: '2025-08-15', end: '2025-11-30' },
    fee_responsibility: 'organization',
    visibility: 'public',
    registration_status: 'open',
    status: 'published',
    default_season_price: 250,
    created_by: 'user-1',
    created_at: new Date('2025-03-01'),
    updated_at: new Date('2025-03-01'),
  },
  {
    id: 'program-2',
    organization_id: 'org-1',
    title: 'Summer Training Camp',
    type: 'camp',
    event_dates: { start: '2025-06-01', end: '2025-06-15' },
    fee_responsibility: 'participant',
    visibility: 'public',
    registration_status: 'closed',
    status: 'published',
    default_season_price: 150,
    created_by: 'user-1',
    created_at: new Date('2025-02-15'),
    updated_at: new Date('2025-02-15'),
  },
  {
    id: 'program-3',
    organization_id: 'org-1',
    title: 'Spring Conditioning',
    type: 'training',
    event_dates: { start: '2025-04-01', end: '2025-05-15' },
    fee_responsibility: 'organization',
    visibility: 'private',
    registration_status: 'open',
    status: 'draft',
    default_season_price: 0,
    created_by: 'user-2',
    created_at: new Date('2025-01-20'),
    updated_at: new Date('2025-01-20'),
  },
];

export const mockAthletes = [
  { id: 'athlete-1', first_name: 'James', last_name: 'Wilson', birthdate: new Date('2008-03-15'), gender: 'Male', grade: 11 },
  { id: 'athlete-2', first_name: 'Michael', last_name: 'Brown', birthdate: new Date('2008-07-22'), gender: 'Male', grade: 11 },
  { id: 'athlete-3', first_name: 'Tyler', last_name: 'Davis', birthdate: new Date('2009-01-10'), gender: 'Male', grade: 10 },
  { id: 'athlete-4', first_name: 'Chris', last_name: 'Martinez', birthdate: new Date('2009-05-28'), gender: 'Male', grade: 10 },
  { id: 'athlete-5', first_name: 'Ryan', last_name: 'Anderson', birthdate: new Date('2010-02-14'), gender: 'Male', grade: 9 },
  { id: 'athlete-6', first_name: 'Jake', last_name: 'Thomas', birthdate: new Date('2010-09-03'), gender: 'Male', grade: 9 },
  { id: 'athlete-7', first_name: 'Ethan', last_name: 'Garcia', birthdate: new Date('2011-04-17'), gender: 'Male', grade: 8 },
  { id: 'athlete-8', first_name: 'Noah', last_name: 'Robinson', birthdate: new Date('2011-11-25'), gender: 'Male', grade: 8 },
];

export const mockRegistrations = [
  { id: 'reg-1', program_id: 'program-1', title: 'Varsity Football Registration', sport: 'Football', created_at: new Date('2025-03-01') },
  { id: 'reg-2', program_id: 'program-1', title: 'JV Football Registration', sport: 'Football', created_at: new Date('2025-03-01') },
  { id: 'reg-3', program_id: 'program-2', title: 'Summer Camp Registration', sport: 'Football', created_at: new Date('2025-02-15') },
];

export const mockRegistrationSubmissions = [
  { id: 'sub-1', registration_id: 'reg-1', program_id: 'program-1', athlete_id: 'athlete-1', user_id: 'user-1', team_id: 'team-1', created_at: new Date('2025-03-15') },
  { id: 'sub-2', registration_id: 'reg-1', program_id: 'program-1', athlete_id: 'athlete-2', user_id: 'user-1', team_id: 'team-1', created_at: new Date('2025-03-16') },
  { id: 'sub-3', registration_id: 'reg-2', program_id: 'program-1', athlete_id: 'athlete-3', user_id: 'user-2', team_id: 'team-2', created_at: new Date('2025-03-17') },
  { id: 'sub-4', registration_id: 'reg-2', program_id: 'program-1', athlete_id: 'athlete-4', user_id: 'user-2', team_id: 'team-2', created_at: new Date('2025-03-18') },
  { id: 'sub-5', registration_id: 'reg-2', program_id: 'program-1', athlete_id: 'athlete-5', user_id: 'user-3', team_id: null, created_at: new Date('2025-03-19') },
  { id: 'sub-6', registration_id: 'reg-2', program_id: 'program-1', athlete_id: 'athlete-6', user_id: 'user-3', team_id: null, created_at: new Date('2025-03-20') },
  { id: 'sub-7', registration_id: 'reg-3', program_id: 'program-2', athlete_id: 'athlete-7', user_id: 'user-1', team_id: null, created_at: new Date('2025-03-21') },
  { id: 'sub-8', registration_id: 'reg-3', program_id: 'program-2', athlete_id: 'athlete-8', user_id: 'user-2', team_id: null, created_at: new Date('2025-03-22') },
];

export const mockTeamAssignments = [
  { team_id: 'team-1', submission_id: 'sub-1', status: 'assigned', updated_at: new Date('2025-03-15') },
  { team_id: 'team-1', submission_id: 'sub-2', status: 'assigned', updated_at: new Date('2025-03-16') },
  { team_id: 'team-2', submission_id: 'sub-3', status: 'assigned', updated_at: new Date('2025-03-17') },
  { team_id: 'team-2', submission_id: 'sub-4', status: 'assigned', updated_at: new Date('2025-03-18') },
];

export const mockTeamMembers = [
  { team_id: 'team-1', user_id: 'user-1', role: 'admin' },
  { team_id: 'team-1', user_id: 'user-3', role: 'coach' },
  { team_id: 'team-2', user_id: 'user-2', role: 'admin' },
  { team_id: 'team-2', user_id: 'user-3', role: 'coach' },
  { team_id: 'team-3', user_id: 'user-2', role: 'admin' },
];

// Helper to get team assignment count
export function getTeamAssignmentCount(teamId: string): number {
  return mockTeamAssignments.filter(ta => ta.team_id === teamId).length;
}

// Helper to get registration submission count
export function getRegistrationSubmissionCount(registrationId: string): number {
  return mockRegistrationSubmissions.filter(rs => rs.registration_id === registrationId).length;
}

// Helper to get program submission count
export function getProgramSubmissionCount(programId: string): number {
  return mockRegistrationSubmissions.filter(rs => rs.program_id === programId).length;
}
