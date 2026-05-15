import PageHeader from '@/components/PageHeader';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader 
        title="Home"
        description="Welcome to Lincoln Youth Football. View your organization overview and quick actions."
      />
    </div>
  );
}
