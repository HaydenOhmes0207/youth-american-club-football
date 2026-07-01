'use client';

import { useSearchParams } from 'next/navigation';
import NewProgramPageClient from './NewProgramPageClient';
import CreateSeasonPageClient from './CreateSeasonPageClient';

export default function ProgramPageRouter() {
  const searchParams = useSearchParams();
  const isCreateSeason = searchParams.get('createSeason') === 'true';

  return isCreateSeason ? <CreateSeasonPageClient /> : <NewProgramPageClient />;
}
