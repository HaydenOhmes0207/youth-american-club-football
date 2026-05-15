import { getAllTeams, getOrganizationId, getSeasons, getStaffUsers, getAthletesOnProvisionedTeams } from '@/lib/actions/teams';
import { getCurrentUser } from '@/lib/data';
import TeamsPageClient from './TeamsPageClient';

export default function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const organizationId = getOrganizationId();

  const teams = organizationId ? getAllTeams(organizationId) : [];
  const seasons = organizationId ? getSeasons(organizationId) : [];
  const staff = organizationId ? getStaffUsers(organizationId) : [];
  const rosterAthletes = organizationId ? getAthletesOnProvisionedTeams(organizationId) : [];
  const currentUserData = getCurrentUser();
  const currentUser = currentUserData ? {
    id: currentUserData.id,
    firstName: currentUserData.first_name,
    lastName: currentUserData.last_name,
  } : null;

  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  const initialSeasonId = activeSeason?.id;

  return <TeamsPageClient teams={teams} seasons={seasons} staff={staff} rosterAthletes={rosterAthletes} currentUser={currentUser} initialSeasonId={initialSeasonId} />;
}
