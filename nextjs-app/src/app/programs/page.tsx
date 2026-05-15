import PageHeader from '@/components/PageHeader';
import ProgramsTable from '@/components/ProgramsTable';
import type { ProgramWithStats } from '@/lib/actions/programs';

const mockPrograms: ProgramWithStats[] = [
  {
    id: 'program-1',
    title: 'Fall 2025 Football Season',
    type: 'season',
    eventDates: { start: '2025-08-15', end: '2025-11-30' },
    visibility: 'public',
    registrationStatus: 'open',
    status: 'published',
    registrantCount: 45,
    programValue: 1125000,
    createdBy: {
      firstName: 'David',
      lastName: 'Mitchell',
      avatar: null,
    },
  },
];

export default function ProgramsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader
        title="Programs"
        description="Manage your registration programs, seasons, and events."
      />
      <ProgramsTable programs={mockPrograms} />
    </div>
  );
}
