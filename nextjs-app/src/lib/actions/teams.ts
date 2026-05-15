'use server';

import { revalidatePath } from 'next/cache';
import {
  mockOrganization,
  mockTeams,
  mockSeasons,
  mockUsers,
  mockTeamMembers,
  mockTeamAssignments,
  mockRegistrationSubmissions,
  mockAthletes,
  getTeamAssignmentCount,
} from '@/lib/mock-data';

// In-memory state for prototype mutations
let teams = [...mockTeams];
let teamAssignments = [...mockTeamAssignments];
let teamMembers = [...mockTeamMembers];

export interface TeamWithStats {
  id: string;
  title: string;
  sport: string;
  gender: string;
  grades: string | null;
  avatar: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  status: string;
  seasonId: string | null;
  rosterCount: number;
  maxRosterSize: number | null;
  ageMin: number | null;
  ageMax: number | null;
}

export interface CreateTeamInput {
  title: string;
  seasonId: string;
}

export interface CreateTeamResult {
  success: boolean;
  team?: { id: string; title: string };
  error?: string;
}

export interface UpdateTeamInput {
  id: string;
  title?: string;
  sport?: string;
  gender?: string;
  grades?: string | null;
  ageMin?: number | null;
  ageMax?: number | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  seasonId?: string | null;
  avatar?: string | null;
}

export interface UpdateTeamResult {
  success: boolean;
  error?: string;
}

export async function updateTeam(input: UpdateTeamInput): Promise<UpdateTeamResult> {
  try {
    // Validate required fields if provided
    if (input.title !== undefined && !input.title.trim()) {
      return { success: false, error: 'Team title is required' };
    }

    if (input.sport !== undefined && !input.sport.trim()) {
      return { success: false, error: 'Sport is required' };
    }

    if (input.gender !== undefined && !input.gender.trim()) {
      return { success: false, error: 'Gender is required' };
    }

    // Validate age range if both are provided
    if (input.ageMin !== undefined && input.ageMax !== undefined && input.ageMin !== null && input.ageMax !== null) {
      if (input.ageMin > input.ageMax) {
        return { success: false, error: 'Minimum age cannot be greater than maximum age' };
      }
    }

    // Validate color format if provided
    if (input.primaryColor !== undefined && input.primaryColor !== null && !/^#[0-9A-F]{6}$/i.test(input.primaryColor)) {
      return { success: false, error: 'Primary color must be a valid hex color (e.g., #FF0000)' };
    }

    if (input.secondaryColor !== undefined && input.secondaryColor !== null && !/^#[0-9A-F]{6}$/i.test(input.secondaryColor)) {
      return { success: false, error: 'Secondary color must be a valid hex color (e.g., #FF0000)' };
    }

    // Find and update team
    const teamIndex = teams.findIndex(t => t.id === input.id);
    if (teamIndex === -1) {
      return { success: false, error: 'Team not found' };
    }

    const team = teams[teamIndex];
    teams[teamIndex] = {
      ...team,
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.sport !== undefined && { sport: input.sport.trim() }),
      ...(input.gender !== undefined && { gender: input.gender.trim() }),
      ...(input.grades !== undefined && { grades: input.grades }),
      ...(input.ageMin !== undefined && { age_min: input.ageMin }),
      ...(input.ageMax !== undefined && { age_max: input.ageMax }),
      ...(input.primaryColor !== undefined && { primary_color: input.primaryColor }),
      ...(input.secondaryColor !== undefined && { secondary_color: input.secondaryColor }),
      ...(input.seasonId !== undefined && { season_id: input.seasonId }),
      ...(input.avatar !== undefined && { avatar: input.avatar }),
    };

    return { success: true };
  } catch (error) {
    console.error('Failed to update team:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to update team: ${errorMessage}` };
  }
}

export async function createTeam(input: CreateTeamInput): Promise<CreateTeamResult> {
  try {
    const currentUser = mockUsers.find(u => u.role === 'school-administrator');
    const teamId = `team-${Date.now()}`;

    const newTeam = {
      id: teamId,
      organization_id: mockOrganization.id,
      season_id: input.seasonId,
      title: input.title,
      sport: 'Football',
      gender: 'Male',
      grades: null,
      avatar: null,
      primary_color: null,
      secondary_color: null,
      status: 'draft',
      max_roster_size: null,
      age_min: null,
      age_max: null,
    };

    teams.push(newTeam);

    // Add current user as team admin
    if (currentUser) {
      teamMembers.push({
        team_id: teamId,
        user_id: currentUser.id,
        role: 'admin',
      });
    }

    revalidatePath('/teams');
    revalidatePath('/', 'layout');

    return {
      success: true,
      team: { id: teamId, title: input.title },
    };
  } catch (error) {
    console.error('Failed to create team:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to create team: ${errorMessage}` };
  }
}

export async function getAllTeams(organizationId: string): Promise<TeamWithStats[]> {
  return teams
    .filter(team => team.organization_id === organizationId)
    .map(team => ({
      id: team.id,
      title: team.title,
      sport: team.sport,
      gender: team.gender,
      grades: team.grades,
      avatar: team.avatar,
      primaryColor: team.primary_color,
      secondaryColor: team.secondary_color,
      status: team.status,
      seasonId: team.season_id,
      rosterCount: teamAssignments.filter(ta => ta.team_id === team.id).length,
      maxRosterSize: team.max_roster_size,
      ageMin: team.age_min,
      ageMax: team.age_max,
    }))
    .sort((a, b) => {
      if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
      return a.title.localeCompare(b.title);
    });
}

export async function getTeamsBySeason(organizationId: string, seasonId: string): Promise<TeamWithStats[]> {
  const allTeams = await getAllTeams(organizationId);
  return allTeams.filter(team => team.seasonId === seasonId);
}

// Keep for backwards compatibility
export async function getProvisionedTeams(organizationId: string): Promise<TeamWithStats[]> {
  const activeSeason = mockSeasons.find(s => s.organization_id === organizationId && s.is_active);
  if (!activeSeason) return [];
  return getTeamsBySeason(organizationId, activeSeason.id);
}

export async function getOrganizationId(): Promise<string | null> {
  return mockOrganization.id;
}

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
  teamRoles: string[];
}

export async function getStaffUsers(organizationId: string): Promise<StaffUser[]> {
  const adminUsers = mockUsers.filter(u => 
    u.role === 'school-administrator' || 
    u.role === 'school administrator' ||
    u.role === 'team-admin' ||
    u.role === 'team admin'
  );

  const teamMemberUserIds = new Set(
    teamMembers
      .filter(tm => ['admin', 'coach'].includes(tm.role))
      .map(tm => tm.user_id)
  );

  const teamMemberUsers = mockUsers.filter(u => teamMemberUserIds.has(u.id));

  const allUserIds = new Set<string>();
  const staffUsers: StaffUser[] = [];

  for (const user of adminUsers) {
    if (!allUserIds.has(user.id)) {
      allUserIds.add(user.id);
      staffUsers.push({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        teamRoles: [],
      });
    }
  }

  for (const user of teamMemberUsers) {
    if (!allUserIds.has(user.id)) {
      allUserIds.add(user.id);
      const userTeamRoles = Array.from(new Set(
        teamMembers
          .filter(tm => tm.user_id === user.id)
          .map(tm => tm.role)
      ));
      staffUsers.push({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        teamRoles: userTeamRoles,
      });
    }
  }

  return staffUsers;
}

export interface Season {
  id: string;
  name: string;
  isActive: boolean;
}

export async function getSeasons(organizationId: string): Promise<Season[]> {
  return mockSeasons
    .filter(s => s.organization_id === organizationId)
    .map(s => ({
      id: s.id,
      name: s.name,
      isActive: s.is_active,
    }))
    .sort((a, b) => b.name.localeCompare(a.name));
}

export interface CopyOptions {
  name: boolean;
  colors: boolean;
  avatar: boolean;
  sport: boolean;
  gender: boolean;
  grade: boolean;
}

export interface CopyTeamsInput {
  sourceTeamIds: string[];
  targetSeasonId: string;
  copyOptions: CopyOptions;
}

export interface CopyTeamsResult {
  success: boolean;
  copiedCount?: number;
  teams?: TeamWithStats[];
  error?: string;
}

export async function copyTeams(input: CopyTeamsInput): Promise<CopyTeamsResult> {
  try {
    const currentUser = mockUsers.find(u => u.role === 'school-administrator');
    const targetSeason = mockSeasons.find(s => s.id === input.targetSeasonId);

    if (!targetSeason) {
      return { success: false, error: 'Target season not found' };
    }

    const sourceTeams = teams.filter(t => input.sourceTeamIds.includes(t.id));

    if (sourceTeams.length === 0) {
      return { success: false, error: 'No teams found to copy' };
    }

    const copiedTeams: TeamWithStats[] = [];

    for (const sourceTeam of sourceTeams) {
      const newTeamId = `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newTeam = {
        id: newTeamId,
        organization_id: mockOrganization.id,
        season_id: input.targetSeasonId,
        title: sourceTeam.title,
        sport: sourceTeam.sport,
        gender: sourceTeam.gender,
        grades: input.copyOptions.grade ? sourceTeam.grades : null,
        avatar: input.copyOptions.avatar ? sourceTeam.avatar : null,
        primary_color: input.copyOptions.colors ? sourceTeam.primary_color : null,
        secondary_color: input.copyOptions.colors ? sourceTeam.secondary_color : null,
        status: 'draft',
        max_roster_size: sourceTeam.max_roster_size,
        age_min: sourceTeam.age_min,
        age_max: sourceTeam.age_max,
      };

      teams.push(newTeam);

      if (currentUser) {
        teamMembers.push({
          team_id: newTeamId,
          user_id: currentUser.id,
          role: 'admin',
        });
      }

      copiedTeams.push({
        id: newTeam.id,
        title: newTeam.title,
        sport: newTeam.sport,
        gender: newTeam.gender,
        grades: newTeam.grades,
        avatar: newTeam.avatar,
        primaryColor: newTeam.primary_color,
        secondaryColor: newTeam.secondary_color,
        status: newTeam.status,
        seasonId: newTeam.season_id,
        rosterCount: 0,
        maxRosterSize: newTeam.max_roster_size,
        ageMin: newTeam.age_min,
        ageMax: newTeam.age_max,
      });
    }

    revalidatePath('/teams');
    revalidatePath('/', 'layout');

    return {
      success: true,
      copiedCount: copiedTeams.length,
      teams: copiedTeams,
    };
  } catch (error) {
    console.error('Failed to copy teams:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to copy teams: ${errorMessage}` };
  }
}

export interface DeleteTeamsResult {
  success: boolean;
  deletedCount?: number;
  error?: string;
}

export async function deleteTeams(teamIds: string[]): Promise<DeleteTeamsResult> {
  try {
    if (teamIds.length === 0) {
      return { success: false, error: 'No teams to delete' };
    }

    const teamsToDelete = teams.filter(t => teamIds.includes(t.id));
    if (teamsToDelete.length === 0) {
      return { success: false, error: 'No teams found to delete' };
    }

    // Remove teams
    teams = teams.filter(t => !teamIds.includes(t.id));

    // Remove related team assignments
    teamAssignments = teamAssignments.filter(ta => !teamIds.includes(ta.team_id));

    // Remove related team members
    teamMembers = teamMembers.filter(tm => !teamIds.includes(tm.team_id));

    revalidatePath('/teams');

    return {
      success: true,
      deletedCount: teamsToDelete.length,
    };
  } catch (error) {
    console.error('Failed to delete teams:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to delete teams: ${errorMessage}` };
  }
}

export async function revalidateTeamsData() {
  revalidatePath('/teams');
  revalidatePath('/teams/manage');
}

export interface AssignAthletesInput {
  teamId: string;
  submissionIds: string[];
}

export interface AssignAthletesResult {
  success: boolean;
  assignedCount?: number;
  error?: string;
}

export async function assignAthletesToTeam(input: AssignAthletesInput): Promise<AssignAthletesResult> {
  try {
    const { teamId, submissionIds } = input;

    if (submissionIds.length === 0) {
      return { success: false, error: 'No athletes to assign' };
    }

    let assignedCount = 0;

    for (const submissionId of submissionIds) {
      const existing = teamAssignments.find(
        ta => ta.team_id === teamId && ta.submission_id === submissionId
      );

      if (existing) {
        existing.status = 'assigned';
        existing.updated_at = new Date();
      } else {
        teamAssignments.push({
          team_id: teamId,
          submission_id: submissionId,
          status: 'assigned',
          updated_at: new Date(),
        });
      }
      assignedCount++;
    }

    revalidatePath('/teams');
    revalidatePath('/teams/assignments');

    return {
      success: true,
      assignedCount,
    };
  } catch (error) {
    console.error('Failed to assign athletes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to assign athletes: ${errorMessage}` };
  }
}

export async function unassignAthleteFromTeam(teamId: string, submissionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const index = teamAssignments.findIndex(
      ta => ta.team_id === teamId && ta.submission_id === submissionId
    );

    if (index !== -1) {
      teamAssignments.splice(index, 1);
    }

    revalidatePath('/teams');
    revalidatePath('/teams/assignments');

    return { success: true };
  } catch (error) {
    console.error('Failed to unassign athlete:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to unassign athlete: ${errorMessage}` };
  }
}

export interface RosterAthlete {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  grade: number;
  teamId: string;
  teamName: string;
  teamAvatar: string | null;
  teamSeasonId: string | null;
  primaryContact: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
}

export async function getAthletesOnProvisionedTeams(organizationId: string): Promise<RosterAthlete[]> {
  const provisionedTeams = teams.filter(
    t => t.organization_id === organizationId && t.status === 'provisioned'
  );

  const provisionedTeamIds = provisionedTeams.map(t => t.id);

  const relevantAssignments = teamAssignments.filter(ta => provisionedTeamIds.includes(ta.team_id));

  const rosterAthletes: RosterAthlete[] = [];

  for (const assignment of relevantAssignments) {
    const team = provisionedTeams.find(t => t.id === assignment.team_id);
    const submission = mockRegistrationSubmissions.find(s => s.id === assignment.submission_id);
    
    if (!team || !submission) continue;

    const athlete = mockAthletes.find(a => a.id === submission.athlete_id);
    const user = mockUsers.find(u => u.id === submission.user_id);

    if (!athlete) continue;

    rosterAthletes.push({
      id: athlete.id,
      firstName: athlete.first_name,
      lastName: athlete.last_name,
      birthdate: athlete.birthdate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      gender: athlete.gender,
      grade: athlete.grade,
      teamId: team.id,
      teamName: team.title,
      teamAvatar: team.avatar,
      teamSeasonId: team.season_id,
      primaryContact: user ? {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
      } : null,
    });
  }

  return rosterAthletes.sort((a, b) => {
    if (a.teamName !== b.teamName) return a.teamName.localeCompare(b.teamName);
    return a.lastName.localeCompare(b.lastName);
  });
}
