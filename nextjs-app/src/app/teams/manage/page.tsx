import { getAllTeams, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import ManageTeamsPageClient from './ManageTeamsPageClient';

export default function ManageTeamsPage() {
  const organizationId = getOrganizationId();

  const teams = organizationId ? getAllTeams(organizationId) : [];
  const seasons = organizationId ? getSeasons(organizationId) : [];
  
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];

  return (
    <ManageTeamsPageClient 
      teams={teams} 
      seasons={seasons}
      initialSeasonId={activeSeason?.id || ''}
    />
  );
}
