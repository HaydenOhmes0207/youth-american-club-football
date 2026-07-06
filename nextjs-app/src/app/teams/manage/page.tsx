import { getAllTeams, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import { maryvilleTeams } from '@/lib/mockHighSchoolData';
import ManageTeamsPageClient from './ManageTeamsPageClient';

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';

interface ManageTeamsPageProps {
  searchParams: Promise<{ season?: string; workspace?: string }>;
}

export default async function ManageTeamsPage({ searchParams }: ManageTeamsPageProps) {
  const params = await searchParams;
  const isHighSchool = params.workspace === 'highschool';
  const organizationId = await getOrganizationId();

  const seasons = organizationId ? await getSeasons(organizationId) : [];

  // High school uses static mock data; club uses the mock store
  const teams = isHighSchool
    ? maryvilleTeams
    : organizationId ? await getAllTeams(organizationId) : [];

  // Use season from URL params, fall back to active season, then first season
  const seasonFromUrl = params.season ? seasons.find(s => s.id === params.season) : null;
  const activeSeason = seasonFromUrl || seasons.find(s => s.isActive) || seasons[0];

  return (
    <ManageTeamsPageClient
      teams={teams}
      seasons={seasons}
      initialSeasonId={activeSeason?.id || ''}
    />
  );
}
