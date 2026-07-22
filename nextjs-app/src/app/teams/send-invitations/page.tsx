import { Suspense } from 'react';
import SendInvitationsPageClient from './SendInvitationsPageClient';

export default function SendInvitationsPage() {
  return (
    <Suspense>
      <SendInvitationsPageClient />
    </Suspense>
  );
}
