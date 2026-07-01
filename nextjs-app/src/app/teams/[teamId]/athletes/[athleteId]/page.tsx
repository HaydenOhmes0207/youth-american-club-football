import { notFound } from 'next/navigation';
import { getTeamById, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import { getAthleteBySubmissionId } from '@/lib/actions/programs';
import AthleteDetailPageClient from './AthleteDetailPageClient';

export const dynamic = 'force-dynamic';

export default async function AthleteDetailPage({
  params,
}: {
  params: Promise<{ teamId: string; athleteId: string }>;
}) {
  const { teamId, athleteId } = await params;
  const organizationId = await getOrganizationId();

  const [team, seasons, athlete] = await Promise.all([
    getTeamById(teamId),
    organizationId ? getSeasons(organizationId) : [],
    getAthleteBySubmissionId(athleteId),
  ]);

  if (!team || !athlete) notFound();

  const seasonName = seasons.find(s => s.id === team.seasonId)?.name ?? '';

  return <AthleteDetailPageClient team={team} seasonName={seasonName} athlete={athlete} />;
}
