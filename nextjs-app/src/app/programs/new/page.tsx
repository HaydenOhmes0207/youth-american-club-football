import { Suspense } from 'react';
import ProgramPageRouter from './ProgramPageRouter';

export default function NewProgramPage() {
  return (
    <Suspense>
      <ProgramPageRouter />
    </Suspense>
  );
}
