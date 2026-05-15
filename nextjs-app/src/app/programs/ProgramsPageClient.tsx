'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ProgramsTable from '@/components/ProgramsTable';
import CreateProgramModal from '@/components/CreateProgramModal';
import type { ProgramWithStats } from '@/lib/actions/programs';

interface ProgramsPageClientProps {
  programs: ProgramWithStats[];
}

export default function ProgramsPageClient({ programs }: ProgramsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader 
        title="Programs"
        description="Manage your registration programs, seasons, and events."
        actions={[
          { label: 'Import', buttonStyle: 'minimal' },
          { label: 'New Program', buttonStyle: 'standard', onClick: () => setIsModalOpen(true) }
        ]}
      />
      <ProgramsTable programs={programs} />
      
      <CreateProgramModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
