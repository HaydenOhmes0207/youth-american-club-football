'use server';

import { revalidatePath } from 'next/cache';
import {
  mockOrganization,
  mockPrograms,
  mockUsers,
  mockRegistrations,
  mockRegistrationSubmissions,
  mockAthletes,
  mockTeams,
  mockTeamAssignments,
  getProgramSubmissionCount,
  getRegistrationSubmissionCount,
} from '@/lib/mock-data';

// In-memory state for prototype mutations
let programs = [...mockPrograms];

export interface ProgramCreator {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export type ProgramStatus = 'draft' | 'published' | 'archived';

export interface ProgramWithStats {
  id: string;
  title: string;
  type: string;
  eventDates: {
    start?: string;
    end?: string;
  };
  visibility: 'public' | 'private';
  registrationStatus: 'open' | 'closed';
  status: ProgramStatus;
  registrantCount: number;
  programValue: number; // In cents, $0.00 if no payments
  createdBy: ProgramCreator | null;
}

export interface CreateProgramInput {
  title: string;
  status: 'draft' | 'published';
}

export interface CreateProgramResult {
  success: boolean;
  program?: { id: string; title: string };
  error?: string;
}

export async function createProgram(input: CreateProgramInput): Promise<CreateProgramResult> {
  try {
    // Get David Mitchell as creator (for prototype - would use auth in production)
    const user = mockUsers.find(u => u.first_name === 'David' && u.last_name === 'Mitchell');

    const newProgram = {
      id: `program-${Date.now()}`,
      organization_id: mockOrganization.id,
      title: input.title,
      type: 'season',
      event_dates: {},
      fee_responsibility: 'organization',
      visibility: 'public' as const,
      registration_status: 'open' as const,
      status: input.status,
      default_season_price: 0,
      created_by: user?.id ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    programs.push(newProgram);

    revalidatePath('/programs');

    return {
      success: true,
      program: { id: newProgram.id, title: newProgram.title },
    };
  } catch (error) {
    console.error('Failed to create program:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to create program: ${errorMessage}` };
  }
}

export async function getPrograms(organizationId: string): Promise<ProgramWithStats[]> {
  const orgPrograms = programs.filter(p => p.organization_id === organizationId);
  
  return orgPrograms.map(program => {
    const registrantCount = getProgramSubmissionCount(program.id);
    const defaultSeasonPrice = program.default_season_price || 0;
    const programValue = Math.round(registrantCount * defaultSeasonPrice * 100);
    
    const creator = program.created_by 
      ? mockUsers.find(u => u.id === program.created_by)
      : null;
    
    return {
      id: program.id,
      title: program.title,
      type: program.type,
      eventDates: program.event_dates as { start?: string; end?: string },
      visibility: program.visibility as 'public' | 'private',
      registrationStatus: (program.registration_status || 'open') as 'open' | 'closed',
      status: (program.status || 'published') as ProgramStatus,
      registrantCount,
      programValue,
      createdBy: creator ? {
        id: creator.id,
        firstName: creator.first_name,
        lastName: creator.last_name,
        avatar: creator.avatar,
      } : null
    };
  }).sort((a, b) => b.registrantCount - a.registrantCount);
}

export async function getOrganizationId(): Promise<string | null> {
  return mockOrganization.id;
}

export interface Registration {
  id: string;
  programId: string;
  title: string;
  sport: string;
  submissionCount: number;
}

export async function getRegistrationsByProgram(programId: string): Promise<Registration[]> {
  return mockRegistrations
    .filter(reg => reg.program_id === programId)
    .map(reg => ({
      id: reg.id,
      programId: reg.program_id,
      title: reg.title,
      sport: reg.sport,
      submissionCount: getRegistrationSubmissionCount(reg.id),
    }));
}

export async function getAllRegistrations(organizationId: string): Promise<Registration[]> {
  const orgProgramIds = programs
    .filter(p => p.organization_id === organizationId)
    .map(p => p.id);

  return mockRegistrations
    .filter(reg => orgProgramIds.includes(reg.program_id))
    .map(reg => ({
      id: reg.id,
      programId: reg.program_id,
      title: reg.title,
      sport: reg.sport,
      submissionCount: getRegistrationSubmissionCount(reg.id),
    }));
}

export interface TeamAssignment {
  teamId: string;
  teamSeasonId: string | null;
  status: string;
}

export interface RegisteredAthlete {
  id: string;
  submissionId: string;
  registrationId: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  teamId: string | null;
  teamSeasonId: string | null;
  teamAssignments: TeamAssignment[];
}

export async function getAthletesByRegistration(registrationId: string): Promise<RegisteredAthlete[]> {
  const submissions = mockRegistrationSubmissions.filter(sub => sub.registration_id === registrationId);

  return submissions.map(sub => {
    const athlete = mockAthletes.find(a => a.id === sub.athlete_id);
    const team = sub.team_id ? mockTeams.find(t => t.id === sub.team_id) : null;
    const teamAssignments = mockTeamAssignments
      .filter(ta => ta.submission_id === sub.id)
      .map(ta => {
        const assignedTeam = mockTeams.find(t => t.id === ta.team_id);
        return {
          teamId: ta.team_id,
          teamSeasonId: assignedTeam?.season_id || null,
          status: ta.status,
        };
      });

    return {
      id: sub.athlete_id,
      submissionId: sub.id,
      registrationId: sub.registration_id,
      firstName: athlete?.first_name || 'Unknown',
      lastName: athlete?.last_name || 'Unknown',
      birthdate: athlete?.birthdate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) || '',
      teamId: sub.team_id,
      teamSeasonId: team?.season_id || null,
      teamAssignments,
    };
  });
}

export async function getAllAthleteSubmissions(organizationId: string): Promise<RegisteredAthlete[]> {
  const orgProgramIds = programs
    .filter(p => p.organization_id === organizationId)
    .map(p => p.id);

  const submissions = mockRegistrationSubmissions.filter(sub => orgProgramIds.includes(sub.program_id));

  return submissions.map(sub => {
    const athlete = mockAthletes.find(a => a.id === sub.athlete_id);
    const team = sub.team_id ? mockTeams.find(t => t.id === sub.team_id) : null;
    const teamAssignments = mockTeamAssignments
      .filter(ta => ta.submission_id === sub.id)
      .map(ta => {
        const assignedTeam = mockTeams.find(t => t.id === ta.team_id);
        return {
          teamId: ta.team_id,
          teamSeasonId: assignedTeam?.season_id || null,
          status: ta.status,
        };
      });

    return {
      id: sub.athlete_id,
      submissionId: sub.id,
      registrationId: sub.registration_id,
      firstName: athlete?.first_name || 'Unknown',
      lastName: athlete?.last_name || 'Unknown',
      birthdate: athlete?.birthdate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) || '',
      teamId: sub.team_id,
      teamSeasonId: team?.season_id || null,
      teamAssignments,
    };
  });
}
