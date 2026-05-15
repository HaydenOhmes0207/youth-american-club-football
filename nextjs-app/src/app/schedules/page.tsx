import PageHeader from '@/components/PageHeader';

export default function SchedulesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader 
        title="Schedules"
        description="View and manage game schedules, practices, and events across all teams."
        actions={[
          { label: 'Import', buttonStyle: 'minimal' },
          { label: 'Add Event', buttonStyle: 'standard' }
        ]}
      />
    </div>
  );
}
