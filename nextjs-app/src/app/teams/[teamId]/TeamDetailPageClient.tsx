'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamWithStats } from '@/lib/actions/teams';
import type { RegisteredAthlete, TeamCoach } from '@/lib/actions/programs';
import PageHeader from '@/components/PageHeader';
import Checkbox from '@/components/Checkbox';

interface TeamDetailPageClientProps {
  team: TeamWithStats;
  seasonName: string;
  athletes: RegisteredAthlete[];
  coaches: TeamCoach[];
}

function formatGrade(grade: number): string {
  if (grade === -1) return 'Pre-K';
  if (grade === 0) return 'K';
  const suffix = grade === 1 ? 'st' : grade === 2 ? 'nd' : grade === 3 ? 'rd' : 'th';
  return `${grade}${suffix}`;
}

function formatGrades(grades: string | null): string {
  if (!grades) return '—';
  return grades.split(',').map(g => formatGrade(parseInt(g.trim(), 10))).join(', ');
}


function SortIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
      <path d="M6 2L8 4.5H4L6 2Z" fill="currentColor"/>
      <path d="M6 10L4 7.5H8L6 10Z" fill="currentColor"/>
    </svg>
  );
}

const sportIconPaths: Record<string, React.ReactNode> = {
  volleyball: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
      <path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9M12 3c-3 3-4 6-4 9s1 6 4 9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  baseball: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
      <path d="M7.5 5C9.5 7 10 9.5 10 12s-.5 5-2.5 7M16.5 5C14.5 7 14 9.5 14 12s.5 5 2.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  basketball: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
      <path d="M3 12h18M12 3v18M5.5 5.5C7 7 8 9.5 8 12s-1 5-2.5 6.5M18.5 5.5C17 7 16 9.5 16 12s1 5 2.5 6.5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  football: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="8" ry="5" stroke="white" strokeWidth="1.5" transform="rotate(-30 12 12)"/>
      <path d="M6.5 9l11 6M8 6.5l8 11" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  lacrosse: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 18l12-12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 6c1.5-1.5 3-.5 3 1s-1.5 2-3 2h-3c-1.5 0-2-1.5-2-3s1.5-2 3-2" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="6.5" cy="17.5" r="1.5" fill="white"/>
    </svg>
  ),
  swimming: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 17c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="12" cy="7" r="2" fill="white"/>
      <path d="M12 9v3" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
};

function SportAvatar({ sport }: { sport: string }) {
  const icon = sportIconPaths[sport.toLowerCase()] ?? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5"/>
      <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  return <>{icon}</>;
}

type Tab = 'All Team' | 'Athletes' | 'Coaches';

export default function TeamDetailPageClient({ team, seasonName, athletes, coaches }: TeamDetailPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('All Team');
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const tabs: Tab[] = ['All Team', 'Athletes', 'Coaches'];

  const displayedAthletes = activeTab === 'Coaches' ? [] : athletes;

  return (
    <div className="detail-page">
      <PageHeader
        title={team.title}
        description={[capitalize(team.sport), capitalize(team.gender), seasonName ? `${seasonName} Season` : ''].filter(Boolean).join(' • ')}
        breadcrumbs={[{ label: 'Teams', href: '/teams' }]}
        headerAvatar={<SportAvatar sport={team.sport} />}
        titleBadges={[
          { label: capitalize(team.status), variant: (team.status === 'active' ? 'status-active' : team.status === 'archived' ? 'status-archived' : 'status-draft') },
        ]}
        actions={[
          ...(team.status !== 'archived' ? [{
            label: 'Message All Team',
            buttonStyle: 'standard' as const,
            buttonType: 'dark' as const,
            onClick: () => {},
          }] : []),
          {
            label: 'Export',
            buttonStyle: 'standard' as const,
            buttonType: 'subtle' as const,
            onClick: () => {},
            iconSvg: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0}}>
                <path d="M14 10v2.6667A1.3333 1.3333 0 0112.6667 14H3.3333A1.3333 1.3333 0 012 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.6667 6.6667L8 10l3.3333-3.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
          },
        ]}
        tabs={tabs.map(tab => ({
          label: tab,
          isActive: activeTab === tab,
          onClick: () => setActiveTab(tab),
        }))}
      />

      {/* Controls row */}
      <div className="controls-row">
        <div className="controls-left">
          <div className="season-pill">
            <span>{seasonName || '2025-2026'}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="controls-right">
          <button className="btn-create-group">Create Group</button>
          <button className="btn-removed-members">Removed Members</button>
        </div>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'Coaches' ? (
          coaches.length === 0 ? (
            <div className="empty-state">No coaches assigned to this team.</div>
          ) : (
            <div className="roster-table">
              {/* Coaches header */}
              <div className="roster-row roster-row--header">
                <div className="roster-cell coach-cell-name">Coach Name <SortIcon /></div>
                <div className="roster-cell coach-cell-role">Role <SortIcon /></div>
                <div className="roster-cell coach-cell-viewtime">Viewing Time <SortIcon /></div>
              </div>
              {coaches.map((coach) => (
                <div key={coach.id} className="roster-row roster-row--coach">
                  <div className="roster-cell coach-cell-name">
                    <span className="coach-name">{coach.firstName} {coach.lastName}</span>
                  </div>
                  <div className="roster-cell coach-cell-role">{coach.role}</div>
                  <div className="roster-cell coach-cell-viewtime">
                    <span className="coach-viewtime-dash">—</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : displayedAthletes.length === 0 ? (
          <div className="empty-state">No athletes assigned to this team.</div>
        ) : (
          <div className="roster-table">
            <div className="roster-row roster-row--header">
              <div className="roster-cell cell-checkbox">
                <Checkbox
                  checked={displayedAthletes.length > 0 && displayedAthletes.every(a => selectedAthleteIds.includes(a.submissionId))}
                  indeterminate={displayedAthletes.some(a => selectedAthleteIds.includes(a.submissionId)) && !displayedAthletes.every(a => selectedAthleteIds.includes(a.submissionId))}
                  onChange={(checked) => setSelectedAthleteIds(checked ? displayedAthletes.map(a => a.submissionId) : [])}
                />
              </div>
              <div className="roster-cell cell-name">Athlete <SortIcon /></div>
              <div className="roster-cell cell-role">Role <SortIcon /></div>
              <div className="roster-cell cell-gradyear">Grad Year <SortIcon /></div>
              <div className="roster-cell cell-position">Position <SortIcon /></div>
              <div className="roster-cell cell-season">Season <SortIcon /></div>
              <div className="roster-cell cell-viewtime">
                Viewing Time
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0, opacity: 0.5}}>
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
                </svg>
                <SortIcon />
              </div>
              <div className="roster-cell cell-recruitable">
                Recruitable
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0, opacity: 0.5}}>
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
                </svg>
                <SortIcon />
              </div>
            </div>
            {displayedAthletes.map((athlete) => {
              const isSelected = selectedAthleteIds.includes(athlete.submissionId);
              return (
                <div key={athlete.submissionId} className={`roster-row${isSelected ? ' roster-row--selected' : ''}`} onClick={() => router.push(`/teams/${team.id}/athletes/${athlete.submissionId}`)}>
                  <div className="roster-cell cell-checkbox" onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked) => setSelectedAthleteIds(prev => checked ? [...prev, athlete.submissionId] : prev.filter(id => id !== athlete.submissionId))}
                    />
                  </div>
                  <div className="roster-cell cell-name">
                    <span className="athlete-name">{athlete.firstName} {athlete.lastName}</span>
                  </div>
                  <div className="roster-cell cell-role">Athlete</div>
                  <div className="roster-cell cell-gradyear">{athlete.gradYear}</div>
                  <div className="roster-cell cell-position">—</div>
                  <div className="roster-cell cell-season">{seasonName ? `${seasonName.replace('-', ' - ')}` : '—'}</div>
                  <div className="roster-cell cell-viewtime">—</div>
                  <div className="roster-cell cell-recruitable">—</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .detail-page {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 9999px;
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
        }

        .badge--status-draft { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground, #36485c); }
        .badge--status-active { background: #e8f5e9; color: #2e7d32; }
        .badge--status-archived { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground-subtle, #607081); }
        .badge--tier-performance { background: #e8f0fe; color: #1a56db; }
        .badge--tier-free { background: #e8f5e9; color: #2e7d32; }
        .badge--tier-none { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground, #36485c); }

        /* Tab content */
        .tab-content {
          width: 100%;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground-subtle, #607081);
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
        }

        /* Roster table */
        .roster-table {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: var(--u-color-background-container, #fefefe);
        }

        .roster-row {
          display: flex;
          align-items: center;
          height: 52px;
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
        }

        .roster-row--header {
          height: 40px;
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .roster-row:last-child { border-bottom: none; }

        .roster-row:not(.roster-row--header):hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: pointer;
        }

        .roster-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          padding: 0 var(--u-space-one, 16px);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
          height: 100%;
          box-sizing: border-box;
        }

        .roster-row--header .roster-cell {
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .cell-checkbox {
          width: 40px;
          flex-shrink: 0;
          justify-content: center;
          padding: 0 4px 0 12px;
        }

        /* Coaches table columns */
        .coach-cell-name {
          flex: 1;
          min-width: 200px;
          padding: 0 var(--u-space-one, 16px) 0 var(--u-space-half, 8px);
        }

        .coach-cell-role {
          width: 140px;
          flex-shrink: 0;
        }

        .coach-cell-viewtime {
          flex: 1;
          min-width: 160px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .roster-row--coach:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: default;
        }

        .coach-name {
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .coach-viewtime-dash {
          color: var(--u-color-base-foreground, #36485c);
        }

.roster-row--selected {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .cell-name {
          flex: 1;
          min-width: 160px;
        }

        .cell-role { width: 100px; flex-shrink: 0; }
        .cell-gradyear { width: 100px; flex-shrink: 0; }
        .cell-position { width: 110px; flex-shrink: 0; }
        .cell-season { width: 130px; flex-shrink: 0; }
        .cell-viewtime { width: 140px; flex-shrink: 0; gap: 4px; }
        .cell-recruitable { width: 130px; flex-shrink: 0; gap: 4px; }

        /* Controls row */
        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--u-space-one, 16px);
          padding: var(--u-space-half, 8px) 0;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: var(--u-space-one, 16px);
        }

        .season-pill {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          height: 40px;
          padding: 0 var(--u-space-three-quarter, 12px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: var(--u-font-size-200, 14px);
          font-weight: 500;
          color: var(--u-color-base-foreground-contrast, #071c31);
          cursor: pointer;
          user-select: none;
        }

        .btn-create-group {
          height: 40px;
          padding: 0 var(--u-space-one, 16px);
          background: #4a5568;
          color: #fefefe;
          border: none;
          border-radius: var(--u-border-radius-medium, 4px);
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: var(--u-font-size-200, 14px);
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-create-group:hover {
          background: #38434f;
        }

        .btn-removed-members {
          background: none;
          border: none;
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: var(--u-font-size-200, 14px);
          font-weight: 500;
          color: var(--u-color-base-foreground-contrast, #071c31);
          cursor: pointer;
          padding: 0;
          white-space: nowrap;
        }

        .btn-removed-members:hover {
          text-decoration: underline;
        }

        .athlete-name {
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

      `}</style>
    </div>
  );
}
