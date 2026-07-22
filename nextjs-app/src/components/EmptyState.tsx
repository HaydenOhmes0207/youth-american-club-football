'use client';

import React from 'react';

// Icon components
function PlusIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V16" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12H16" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 8V21H3V8" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 3H1V8H23V3Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 12H14" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21L16.65 16.65" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2V6" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2V6" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10H21" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V9" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 15V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V15" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 9C21.4696 9 20.9609 9.21071 20.5858 9.58579C20.2107 9.96086 20 10.4696 20 11C20 11.5304 20.2107 12.0391 20.5858 12.4142C20.9609 12.7893 21.4696 13 22 13V15" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 9C2.53043 9 3.03914 9.21071 3.41421 9.58579C3.78929 9.96086 4 10.4696 4 11C4 11.5304 3.78929 12.0391 3.41421 12.4142C3.03914 12.7893 2.53043 13 2 13V15" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 10H23" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export type EmptyStateVariant = 
  | 'programs'
  | 'programs-draft'
  | 'programs-archived'
  | 'teams'
  | 'teams-season'
  | 'teams-athletes'
  | 'teams-parents'
  | 'teams-staff'
  | 'tickets-events'
  | 'tickets-events-published'
  | 'tickets-events-non-ticketed'
  | 'tickets-events-draft'
  | 'tickets-events-past'
  | 'tickets-passes'
  | 'tickets-passes-current'
  | 'tickets-passes-draft'
  | 'tickets-passes-past'
  | 'search';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  searchQuery?: string;
  seasonName?: string;
  action?: { label: string; onClick: () => void };
}

const contentMap: Record<EmptyStateVariant, { title: string; description: string; icon: React.ReactNode }> = {
  'programs': {
    title: 'No programs yet',
    description: 'Create your first program to start managing registrations, tryouts, and events.',
    icon: <PlusIcon />,
  },
  'programs-draft': {
    title: 'No draft programs',
    description: "Programs you're still working on will appear here. Start a new program to save it as a draft.",
    icon: <DraftIcon />,
  },
  'programs-archived': {
    title: 'No archived programs',
    description: 'Completed or inactive programs will appear here when you archive them.',
    icon: <ArchiveIcon />,
  },
  'teams': {
    title: 'No teams yet',
    description: 'Add a team to get started. You can build out your roster before the season is confirmed.',
    icon: <UsersIcon />,
  },
  'teams-season': {
    title: 'No teams for this season yet',
    description: 'Add a team to get started. You can build out your roster before the season is confirmed.',
    icon: <CalendarIcon />,
  },
  'teams-athletes': {
    title: 'No athletes yet',
    description: 'Athletes will appear here once teams are provisioned. Use Team Assignments to assign athletes to draft teams, then contact your CSM.',
    icon: <UsersIcon />,
  },
  'teams-parents': {
    title: 'No family members yet',
    description: 'Family members will appear here once teams are provisioned. Use Team Assignments to assign athletes to draft teams, then contact your CSM.',
    icon: <UsersIcon />,
  },
  'teams-staff': {
    title: 'No staff yet',
    description: 'Staff members will appear here once they are added to your organization.',
    icon: <UsersIcon />,
  },
  'tickets-events': {
    title: 'No events yet',
    description: 'Create your first ticketed event to start selling tickets and tracking attendance.',
    icon: <TicketIcon />,
  },
  'tickets-events-published': {
    title: 'No published events',
    description: 'Published events with active ticket sales will appear here.',
    icon: <TicketIcon />,
  },
  'tickets-events-non-ticketed': {
    title: 'No non-ticketed events',
    description: 'Events without ticket sales enabled will appear here.',
    icon: <CalendarIcon />,
  },
  'tickets-events-draft': {
    title: 'No draft events',
    description: 'Events you\'re still setting up will appear here. Create a new event to get started.',
    icon: <DraftIcon />,
  },
  'tickets-events-past': {
    title: 'No past events',
    description: 'Completed events will appear here after their end date.',
    icon: <ArchiveIcon />,
  },
  'tickets-passes': {
    title: 'No passes yet',
    description: 'Create season passes or multi-game packages to offer fans flexible ticketing options.',
    icon: <CreditCardIcon />,
  },
  'tickets-passes-current': {
    title: 'No current passes',
    description: 'Active season passes and multi-game packages will appear here.',
    icon: <CreditCardIcon />,
  },
  'tickets-passes-draft': {
    title: 'No draft passes',
    description: 'Passes you\'re still setting up will appear here. Create a new pass to get started.',
    icon: <DraftIcon />,
  },
  'tickets-passes-past': {
    title: 'No past passes',
    description: 'Expired or completed passes will appear here.',
    icon: <ArchiveIcon />,
  },
  'search': {
    title: 'No results found',
    description: 'Try adjusting your search terms or check for typos.',
    icon: <SearchIcon />,
  },
};

export default function EmptyState({ variant, searchQuery, seasonName, action }: EmptyStateProps) {
  const content = contentMap[variant];
  
  // Override title for search with query or season
  const title = variant === 'search' && searchQuery 
    ? `No results for "${searchQuery}"`
    : variant === 'teams-season' && seasonName
    ? `You haven't added any teams this season`
    : content.title;

  return (
    <div className="empty-state">
      {/* <div className="empty-icon">
        {content.icon}
      </div> */}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{content.description}</p>
      {action && (
        <button className="empty-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--u-space-four, 64px) var(--u-space-one-and-half, 24px);
          text-align: center;
          background: var(--u-color-background-container, #fefefe);
          border-top: 1px solid var(--u-color-background-canvas, #eff0f0);
          gap: var(--u-space-quarter, 4px);
        }

        .empty-icon {
          margin-bottom: var(--u-space-one, 16px);
          opacity: 0.6;
        }

        .empty-title {
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-medium, 500);
          font-size: var(--u-font-size-250, 18px);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .empty-action {
          margin-top: var(--u-space-one, 16px);
          padding: var(--u-space-three-quarter, 12px) var(--u-space-one-and-half, 24px);
          background: var(--u-color-emphasis-background, #e7f3fd);
          border: 1px solid var(--u-color-emphasis-foreground, #085bb4);
          border-radius: var(--u-border-radius-medium, 4px);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: 600;
          color: var(--u-color-emphasis-foreground-contrast, #0d3673);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .empty-action:hover {
          background: var(--u-color-emphasis-background-hover, #c9e5f9);
        }

        .empty-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
          max-width: 456px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
