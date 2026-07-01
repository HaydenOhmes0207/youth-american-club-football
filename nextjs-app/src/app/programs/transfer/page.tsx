import { Suspense } from 'react';
import TransferPageClient from './TransferPageClient';

export default function TransferPage() {
  return (
    <Suspense>
      <TransferPageClient />
    </Suspense>
  );
}
