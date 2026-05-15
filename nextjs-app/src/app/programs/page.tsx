import ProgramsPageClient from './ProgramsPageClient';
import type { ProgramWithStats } from '@/lib/actions/programs';

// Minimal mock data - just one row for the prototype
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
  return <ProgramsPageClient programs={mockPrograms} />;
}
