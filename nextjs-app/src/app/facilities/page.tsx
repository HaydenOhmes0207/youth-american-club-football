import PageHeader from '@/components/PageHeader';

export default function FacilitiesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader 
        title="Facilities"
        description="Manage fields, gyms, and other facilities available for your organization."
        actions={[
          { label: 'Add Facility', buttonStyle: 'standard' }
        ]}
      />
    </div>
  );
}
