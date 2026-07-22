import { getPrograms, getOrganizationId } from '@/lib/actions/programs';
import ProgramDetailPageClient from './ProgramDetailPageClient';

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  const organizationId = await getOrganizationId();
  const programs = organizationId ? await getPrograms(organizationId) : [];

  return <ProgramDetailPageClient programId={params.id} programs={programs} />;
}
