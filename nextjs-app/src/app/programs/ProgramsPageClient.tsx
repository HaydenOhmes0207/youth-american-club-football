import PageHeader from '@/components/PageHeader';
import ProgramsTable from '@/components/ProgramsTable';
import type { ProgramWithStats } from '@/lib/actions/programs';

interface ProgramsPageClientProps {
  programs: ProgramWithStats[];
}

export default function ProgramsPageClient({ programs }: ProgramsPageClientProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader 
        title="Programs"
        description="Manage your registration programs, seasons, and events."
      />
      <ProgramsTable programs={programs} />
    </div>
  );
}
