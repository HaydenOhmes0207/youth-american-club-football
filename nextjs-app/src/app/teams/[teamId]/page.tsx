import { notFound } from 'next/navigation';
import { getTeamById, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import { getAllAthleteSubmissions, getAllCoaches } from '@/lib/actions/programs';
import TeamDetailPageClient from './TeamDetailPageClient';

export const dynamic = 'force-dynamic';

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const organizationId = await getOrganizationId();

  const [team, seasons, allAthletes, allCoaches] = await Promise.all([
    getTeamById(teamId),
    organizationId ? getSeasons(organizationId) : [],
    organizationId ? getAllAthleteSubmissions(organizationId) : [],
    organizationId ? getAllCoaches(organizationId) : [],
  ]);

  if (!team) notFound();

  const seasonName = seasons.find(s => s.id === team.seasonId)?.name ?? '';
  const athletes = allAthletes.filter(a => a.previousTeamTitle === team.title);
  const coaches = allCoaches.filter(c => c.teamTitle === team.title);

  return <TeamDetailPageClient team={team} seasonName={seasonName} athletes={athletes} coaches={coaches} />;
}
