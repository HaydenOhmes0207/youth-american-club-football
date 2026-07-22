import { Suspense } from 'react';
import { getAllTeams, getOrganizationId } from '@/lib/actions/teams';
import RegistrationsPageClient from './RegistrationsPageClient';

// Always read the latest teams so ones just built in the team builder show up
export const dynamic = 'force-dynamic';

export default async function RegistrationsPage() {
  const organizationId = await getOrganizationId();
  const teams = organizationId ? await getAllTeams(organizationId) : [];

  return (
    <Suspense>
      <RegistrationsPageClient initialTeams={teams} />
    </Suspense>
  );
}
