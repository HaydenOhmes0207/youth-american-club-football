import { getAllTeams, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import { getPrograms, getAllRegistrations, getAllAthleteSubmissions } from '@/lib/actions/programs';
import AssignmentsPageClient from './AssignmentsPageClient';

export default function AssignmentsPage() {
  const organizationId = getOrganizationId();

  const teams = organizationId ? getAllTeams(organizationId) : [];
  const seasons = organizationId ? getSeasons(organizationId) : [];
  const programs = organizationId ? getPrograms(organizationId) : [];
  const registrations = organizationId ? getAllRegistrations(organizationId) : [];
  const athletes = organizationId ? getAllAthleteSubmissions(organizationId) : [];
  
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];

  return (
    <AssignmentsPageClient 
      teams={teams} 
      seasons={seasons}
      programs={programs}
      registrations={registrations}
      athletes={athletes}
      initialSeasonId={activeSeason?.id || ''}
    />
  );
}
