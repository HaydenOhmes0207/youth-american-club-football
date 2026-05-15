import PageHeader from '@/components/PageHeader';
import CommunityTable from '@/components/CommunityTable';

export default function CommunityPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader
        title="Community"
        description="Manage athletes, coaches, and staff across your organization."
        actions={[
          { label: 'Import', buttonStyle: 'minimal' },
          { label: 'Add Member', buttonStyle: 'standard' }
        ]}
      />
      <CommunityTable />
    </div>
  );
}
