'use client';

import { createContext, useContext, useState } from 'react';

export type WorkspaceType = 'club' | 'highschool';

interface WorkspaceContextValue {
  workspaceType: WorkspaceType;
  setWorkspaceType: (type: WorkspaceType) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaceType: 'club',
  setWorkspaceType: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>('club');
  return (
    <WorkspaceContext.Provider value={{ workspaceType, setWorkspaceType }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
