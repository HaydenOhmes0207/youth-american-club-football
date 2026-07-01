'use client';

import type { TeamWithStats, Season } from '@/lib/actions/teams';

// ─── Sport icon ───────────────────────────────────────────────────────────────
function SportIcon({ sport }: { sport: string }) {
  const s = sport.toLowerCase();

  if (s === 'volleyball') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8.5" stroke="#36485c" strokeWidth="1.25"/>
        <path d="M4.2 6.5C5.8 5.5 7.8 5.2 9.7 5.8" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M15.8 6.5C14.2 5.5 12.2 5.2 10.3 5.8" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M10 5.8C10 7.8 11.2 9.6 13 10.5" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M10 5.8C10 7.8 8.8 9.6 7 10.5" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M4.2 13.5C5.5 12 6 10 5.5 8.2" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M15.8 13.5C14.5 12 14 10 14.5 8.2" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M4.2 13.5C6.5 14.8 9.5 14.8 11.5 13.2" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    );
  }

  if (s === 'football') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="10" cy="10" rx="7" ry="4.5" stroke="#36485c" strokeWidth="1.25" transform="rotate(-35 10 10)"/>
        <line x1="10" y1="4" x2="10" y2="16" stroke="#36485c" strokeWidth="1" strokeLinecap="round"/>
        <line x1="7.5" y1="7.5" x2="12.5" y2="7.5" stroke="#36485c" strokeWidth="1" strokeLinecap="round"/>
        <line x1="7" y1="10" x2="13" y2="10" stroke="#36485c" strokeWidth="1" strokeLinecap="round"/>
        <line x1="7.5" y1="12.5" x2="12.5" y2="12.5" stroke="#36485c" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    );
  }

  if (s === 'basketball') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8.5" stroke="#36485c" strokeWidth="1.25"/>
        <path d="M1.5 10h17" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M10 1.5v17" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M4 4.5C6 6 6.5 8.5 6 10" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M16 4.5C14 6 13.5 8.5 14 10" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M4 15.5C6 14 6.5 11.5 6 10" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M16 15.5C14 14 13.5 11.5 14 10" stroke="#36485c" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    );
  }

  if (s === 'soccer') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8.5" stroke="#36485c" strokeWidth="1.25"/>
        <polygon points="10,5 12,8.5 10,9.5 8,8.5" stroke="#36485c" strokeWidth="1" fill="none"/>
        <polygon points="10,9.5 12,8.5 13.5,11.5 10,13 6.5,11.5 8,8.5" stroke="#36485c" strokeWidth="1" fill="none"/>
      </svg>
    );
  }

  // Generic — first letter
  const initial = sport.charAt(0).toUpperCase();
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      background: '#e0e1e1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--u-font-body)', fontSize: 10, fontWeight: 700, color: '#36485c',
    }}>
      {initial}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatGender(gender: string) {
  const map: Record<string, string> = { male: 'Male', female: 'Female', boys: 'Boys', girls: 'Girls', coed: 'Coed' };
  return map[gender?.toLowerCase()] ?? gender;
}

function getStatusColor(status: string): { bg: string; color: string } {
  switch (status) {
    case 'active':   return { bg: '#e3f9e5', color: '#1a6831' };
    case 'archived': return { bg: '#e8eaec', color: '#607081' };
    case 'draft':    return { bg: '#fff7e6', color: '#92400e' };
    default:         return { bg: '#e8eaec', color: '#607081' };
  }
}

// ─── Single card ─────────────────────────────────────────────────────────────
function TeamCard({
  team,
  seasonName,
  onClick,
}: {
  team: TeamWithStats;
  seasonName: string;
  onClick?: () => void;
}) {
  const { bg: statusBg, color: statusColor } = getStatusColor(team.status);
  const statusLabel = team.status.charAt(0).toUpperCase() + team.status.slice(1);

  return (
    <button className="tg-card" onClick={onClick} type="button">
      <div className="tg-card-context">
        {formatGender(team.gender)} · {seasonName}
      </div>
      <div className="tg-card-title-row">
        <div className="tg-card-sport-icon">
          <SportIcon sport={team.sport} />
        </div>
        <span className="tg-card-name">{team.title}</span>
        <span className="tg-card-status" style={{ background: statusBg, color: statusColor }}>
          {statusLabel}
        </span>
      </div>
      <div className="tg-card-tags">
        <span className="tg-tag">{formatGender(team.gender)}</span>
        <span className="tg-tag">{team.rosterCount} Athletes</span>
        <span className="tg-tag">{team.coachCount} Coaches</span>
      </div>

      <style jsx>{`
        .tg-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .tg-card:hover {
          border-color: var(--u-color-base-foreground-subtle, #607081);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .tg-card-context {
          font-family: var(--u-font-body);
          font-size: 11px;
          color: var(--u-color-base-foreground-subtle, #607081);
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tg-card-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tg-card-sport-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .tg-card-name {
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.3;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tg-card-status {
          font-family: var(--u-font-body);
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tg-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .tg-tag {
          font-family: var(--u-font-body);
          font-size: 11px;
          color: var(--u-color-base-foreground, #36485c);
          background: var(--u-color-background-canvas, #eff0f0);
          border-radius: 4px;
          padding: 2px 7px;
          white-space: nowrap;
        }
      `}</style>
    </button>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
interface TeamsGridProps {
  teams: TeamWithStats[];
  seasons: Season[];
  onTeamClick?: (teamId: string) => void;
}

export default function TeamsGrid({ teams, seasons, onTeamClick }: TeamsGridProps) {
  function getSeasonName(seasonId: string | null) {
    if (!seasonId) return '';
    const s = seasons.find(s => s.id === seasonId);
    return s ? `${s.name} Season` : '';
  }

  if (teams.length === 0) {
    return (
      <div className="tg-empty">No teams found.</div>
    );
  }

  return (
    <div className="tg-grid">
      {teams.map(team => (
        <TeamCard
          key={team.id}
          team={team}
          seasonName={getSeasonName(team.seasonId)}
          onClick={() => onTeamClick?.(team.id)}
        />
      ))}

      <style jsx>{`
        .tg-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
        }
        .tg-empty {
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground-subtle, #607081);
          padding: 48px 0;
          text-align: center;
          width: 100%;
        }
        @media (max-width: 1100px) {
          .tg-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 800px) {
          .tg-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
