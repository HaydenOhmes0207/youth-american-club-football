'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Select from '@/components/Select';

// ─── Types ───────────────────────────────────────────────────────────────────

type View = 'naming' | 'mapping' | 'complete';
type PlayerStatus = 'returning' | 'graduated' | 'quit';

interface RosterPlayer {
  id: string;
  name: string;
  currentAge: number;
  status: PlayerStatus;
}

interface OldTeam {
  id: string;
  name: string;
  suggestedNewName: string;
  roster: RosterPlayer[];
}

interface TeamState {
  newTeamSelection: string;
  expanded: boolean;
  playerReturning: Record<string, boolean>;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const OLD_PROGRAM_NAME = '2026 Fall Season';

const OLD_TEAMS: OldTeam[] = [
  {
    id: 'u14-matrix',
    name: 'U14 Girls Matrix',
    suggestedNewName: 'Create New U15 Girls Matrix',
    roster: [
      { id: 'p1', name: 'Madison Brown', currentAge: 13, status: 'returning' },
      { id: 'p2', name: 'Olivia Taylor', currentAge: 13, status: 'returning' },
      { id: 'p3', name: 'Emma Wilson', currentAge: 14, status: 'returning' },
      { id: 'p4', name: 'Sophia Martinez', currentAge: 13, status: 'graduated' },
    ],
  },
  {
    id: 'u15-shock',
    name: 'U15 Girls Shock',
    suggestedNewName: 'Create New U16 Girls Shock',
    roster: [
      { id: 'p5', name: 'Ashley Johnson', currentAge: 14, status: 'returning' },
      { id: 'p6', name: 'Rachel Davis', currentAge: 15, status: 'returning' },
      { id: 'p7', name: 'Kayla Martinez', currentAge: 14, status: 'quit' },
      { id: 'p8', name: 'Brianna Lee', currentAge: 14, status: 'returning' },
    ],
  },
  {
    id: 'u17-bolts',
    name: 'U17 Girls Bolts',
    suggestedNewName: 'Create New U18 Girls Bolts',
    roster: [
      { id: 'p9', name: 'Sarah Smith', currentAge: 17, status: 'returning' },
      { id: 'p10', name: 'Jessica Jones', currentAge: 17, status: 'returning' },
      { id: 'p11', name: 'Emily Davis', currentAge: 17, status: 'graduated' },
      { id: 'p12', name: 'Lauren Wilson', currentAge: 16, status: 'returning' },
    ],
  },
  {
    id: 'u18-thunder',
    name: 'U18 Girls Thunder',
    suggestedNewName: 'No Corresponding Team',
    roster: [
      { id: 'p13', name: 'Megan Clark', currentAge: 18, status: 'graduated' },
      { id: 'p14', name: 'Hannah Lee', currentAge: 17, status: 'returning' },
      { id: 'p15', name: 'Brittany Walker', currentAge: 18, status: 'graduated' },
    ],
  },
];

function initTeamStates(): Record<string, TeamState> {
  const states: Record<string, TeamState> = {};
  for (const team of OLD_TEAMS) {
    const playerReturning: Record<string, boolean> = {};
    for (const player of team.roster) {
      playerReturning[player.id] = player.status === 'returning';
    }
    states[team.id] = {
      newTeamSelection: team.suggestedNewName,
      expanded: false,
      playerReturning,
    };
  }
  return states;
}

function getReturningCount(team: OldTeam, state: TeamState): number {
  return team.roster.filter((p) => state.playerReturning[p.id]).length;
}

// ─── Mock target programs ─────────────────────────────────────────────────────

const TARGET_PROGRAM_OPTIONS = [
  { value: '2026 Spring Season', label: '2026 Spring Season' },
  { value: '2026-2027 Season', label: '2026-2027 Season' },
  { value: '2027 Fall Season', label: '2027 Fall Season' },
  { value: '2027 Spring Season', label: '2027 Spring Season' },
];

// ─── Naming view ──────────────────────────────────────────────────────────────

function NamingView({
  onSubmit,
  onBack,
}: {
  onSubmit: (name: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState('2026 Spring Season');

  return (
    <div className="naming-page">
      <header className="page-topbar">
        <button className="back-link" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Programs
        </button>
      </header>

      <div className="naming-content">
        <div className="naming-card">
          <div className="naming-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M8 14a6 6 0 0 1 9.8-4.7M20 14a6 6 0 0 1-9.8 4.7" stroke="var(--u-color-emphasis-background-contrast, #0273e3)" strokeWidth="1.75" strokeLinecap="round" />
              <path d="M17.8 7l2.2 2.3-2.5 1.5" stroke="var(--u-color-emphasis-background-contrast, #0273e3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.2 21l-2.2-2.3 2.5-1.5" stroke="var(--u-color-emphasis-background-contrast, #0273e3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="naming-header">
            <h1 className="naming-title">Start Season Rollover</h1>
            <p className="naming-desc">
              Your system will duplicate all pricing, settings, and registration forms from{' '}
              <strong>{OLD_PROGRAM_NAME}</strong> into a new program container for the upcoming year.
            </p>
          </div>

          <div className="source-row">
            <div className="source-info">
              <span className="source-label">Source program</span>
              <span className="source-value">{OLD_PROGRAM_NAME}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 5l5 5-5 5" stroke="var(--u-color-emphasis-background-contrast, #0273e3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="source-info source-info--new">
              <span className="source-label">New program</span>
              <span className="source-value">{name || '—'}</span>
            </div>
          </div>

          <div className="naming-field">
            <label className="field-label">
              Select target program <span className="required">*</span>
            </label>
            <Select
              options={TARGET_PROGRAM_OPTIONS}
              value={name}
              onChange={setName}
              placeholder="Choose a program"
              fullWidth
            />
          </div>

          <div className="naming-actions">
            <Button
              buttonStyle="standard"
              buttonType="primary"
              size="medium"
              onClick={() => name && onSubmit(name)}
            >
              Continue →
            </Button>
            <Button buttonStyle="minimal" buttonType="secondary" size="medium" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .naming-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--u-color-background-canvas, #eff0f0);
        }
        .page-topbar {
          height: 48px;
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          display: flex;
          align-items: center;
          padding: 0 24px;
          flex-shrink: 0;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--u-color-base-foreground, #36485c);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }
        .back-link:hover {
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .naming-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .naming-card {
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 12px;
          padding: 48px;
          max-width: 540px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .naming-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: var(--u-color-emphasis-background-subtle, #e8f0fb);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .naming-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .naming-title {
          font-family: var(--u-font-body);
          font-size: 22px;
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
          line-height: 1.25;
        }
        .naming-desc {
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
          line-height: 1.6;
        }
        .source-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--u-color-background-canvas, #eff0f0);
          border-radius: 8px;
        }
        .source-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .source-label {
          font-family: var(--u-font-body);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .source-value {
          font-family: var(--u-font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .source-info--new .source-label {
          color: var(--u-color-emphasis-background-contrast, #0273e3);
        }
        .source-value--placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
          font-style: italic;
          font-weight: 400;
        }
        .naming-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .field-label {
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--u-color-base-foreground, #36485c);
        }
        .required {
          color: var(--u-color-alert-foreground, #bb1700);
        }
        .naming-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

// ─── Team row ─────────────────────────────────────────────────────────────────

function TeamRow({
  team,
  state,
  onToggleExpand,
  onSelectionChange,
  onPlayerToggle,
}: {
  team: OldTeam;
  state: TeamState;
  onToggleExpand: () => void;
  onSelectionChange: (value: string) => void;
  onPlayerToggle: (playerId: string) => void;
}) {
  const returningCount = getReturningCount(team, state);
  const isNoMapping = state.newTeamSelection === 'No Corresponding Team';
  const newTeamLabel = state.newTeamSelection.replace('Create New ', '');

  // Build dropdown options
  const defaultOption = team.suggestedNewName !== 'No Corresponding Team'
    ? team.suggestedNewName
    : null;

  return (
    <div className={`team-wrap ${state.expanded ? 'team-wrap--expanded' : ''}`}>
      {/* ── Row ── */}
      <div
        className={`team-row ${state.expanded ? 'team-row--active' : ''} ${isNoMapping ? 'team-row--none' : ''}`}
        onClick={!isNoMapping ? onToggleExpand : undefined}
        style={{ cursor: isNoMapping ? 'default' : 'pointer' }}
      >
        {/* Old team */}
        <div className="old-team">
          <span className="team-name">{team.name}</span>
          {!isNoMapping && (
            <span className={`returning-badge ${returningCount < team.roster.length ? 'returning-badge--partial' : ''}`}>
              {returningCount}/{team.roster.length} returning
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="row-arrow">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 9h12M11 4l5 5-5 5"
              stroke={isNoMapping ? '#c4c6c8' : 'var(--u-color-emphasis-background-contrast, #0273e3)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* New team dropdown */}
        <div className="new-team" onClick={(e) => e.stopPropagation()}>
          <select
            className={`team-select ${isNoMapping ? 'team-select--none' : ''}`}
            value={state.newTeamSelection}
            onChange={(e) => onSelectionChange(e.target.value)}
          >
            {defaultOption && (
              <option value={defaultOption}>{defaultOption}</option>
            )}
            <option value="No Corresponding Team">No Corresponding Team</option>
          </select>
        </div>

        {/* Chevron */}
        {!isNoMapping && (
          <div className={`row-chevron ${state.expanded ? 'row-chevron--open' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="var(--u-color-base-foreground-subtle, #607081)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Roster checklist ── */}
      {state.expanded && !isNoMapping && (
        <div className="roster-panel">
          <div className="roster-panel-header">
            <span className="roster-panel-title">
              Select players returning to <strong>{newTeamLabel}</strong>
            </span>
            <span className="roster-count-label">
              {returningCount} of {team.roster.length} selected
            </span>
          </div>

          <div className="roster-list">
            {team.roster.map((player) => {
              const checked = state.playerReturning[player.id];
              const isGraduated = player.status === 'graduated';
              const isQuit = player.status === 'quit';

              return (
                <label key={player.id} className={`roster-item ${!checked ? 'roster-item--unchecked' : ''}`}>
                  <input
                    type="checkbox"
                    className="roster-checkbox"
                    checked={checked}
                    onChange={() => onPlayerToggle(player.id)}
                  />
                  <div className="roster-player">
                    <span className={`player-name ${!checked ? 'player-name--struck' : ''}`}>
                      {player.name}
                    </span>
                    <div className="player-meta">
                      <span className="age-transition">
                        Age {player.currentAge} → {player.currentAge + 1}
                      </span>
                      {isGraduated && (
                        <span className="status-tag status-tag--graduated">Graduated</span>
                      )}
                      {isQuit && (
                        <span className="status-tag status-tag--quit">Not Returning</span>
                      )}
                    </div>
                  </div>
                  <span className={`player-outcome ${checked ? 'player-outcome--moving' : 'player-outcome--dropped'}`}>
                    {checked
                      ? `→ Moves to new ${newTeamLabel} roster`
                      : 'Dropped from upcoming roster'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .team-wrap {
          border-radius: 8px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          background: var(--u-color-background-container, #fefefe);
          overflow: hidden;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .team-wrap:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
        }
        .team-wrap--expanded {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          box-shadow: 0 2px 12px rgba(2, 115, 227, 0.1);
        }

        .team-row {
          display: grid;
          grid-template-columns: 1fr 36px 1fr 28px;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          transition: background 0.1s ease;
        }
        .team-row:hover:not(.team-row--none) {
          background: var(--u-color-background-canvas, #eff0f0);
        }
        .team-row--active {
          background: #eef4fc;
        }
        .team-row--active:hover {
          background: #eef4fc;
        }
        .team-row--none {
          opacity: 0.6;
        }

        .old-team {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .team-name {
          font-family: var(--u-font-body);
          font-size: 15px;
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.3;
        }
        .returning-badge {
          font-family: var(--u-font-body);
          font-size: 12px;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .returning-badge--partial {
          color: #b45309;
        }

        .row-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .new-team {
          width: 100%;
        }
        .team-select {
          width: 100%;
          height: 34px;
          padding: 0 8px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 4px;
          background: var(--u-color-background-container, #fefefe);
          font-family: var(--u-font-body);
          font-size: 13px;
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .team-select:focus {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          box-shadow: 0 0 0 2px rgba(2, 115, 227, 0.15);
        }
        .team-select--none {
          color: var(--u-color-base-foreground-subtle, #607081);
          font-style: italic;
        }

        .row-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .row-chevron--open {
          transform: rotate(180deg);
        }

        /* Roster panel */
        .roster-panel {
          border-top: 1px solid #d0e4f7;
          background: #f4f8fe;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .roster-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .roster-panel-title {
          font-family: var(--u-font-body);
          font-size: 13px;
          color: var(--u-color-base-foreground, #36485c);
        }
        .roster-count-label {
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: 600;
          color: var(--u-color-emphasis-background-contrast, #0273e3);
          white-space: nowrap;
        }

        .roster-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .roster-item {
          display: grid;
          grid-template-columns: 18px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--u-color-background-container, #fefefe);
          border-radius: 6px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          cursor: pointer;
          transition: border-color 0.1s ease;
        }
        .roster-item:hover {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }
        .roster-item--unchecked {
          background: #fafafa;
          opacity: 0.7;
        }
        .roster-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--u-color-emphasis-background-contrast, #0273e3);
          cursor: pointer;
          flex-shrink: 0;
          margin: 0;
        }
        .roster-player {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .player-name {
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.3;
        }
        .player-name--struck {
          text-decoration: line-through;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .player-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .age-transition {
          font-family: var(--u-font-body);
          font-size: 11px;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .status-tag {
          font-family: var(--u-font-body);
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .status-tag--graduated {
          background: #fef3c7;
          color: #92400e;
        }
        .status-tag--quit {
          background: #fee2e2;
          color: #991b1b;
        }
        .player-outcome {
          font-family: var(--u-font-body);
          font-size: 11px;
          white-space: nowrap;
        }
        .player-outcome--moving {
          color: #15803d;
        }
        .player-outcome--dropped {
          color: var(--u-color-alert-foreground, #bb1700);
        }
      `}</style>
    </div>
  );
}

// ─── Mapping view ─────────────────────────────────────────────────────────────

function MappingView({
  newProgramName,
  teamStates,
  onToggleExpand,
  onSelectionChange,
  onPlayerToggle,
  onComplete,
  onBack,
}: {
  newProgramName: string;
  teamStates: Record<string, TeamState>;
  onToggleExpand: (teamId: string) => void;
  onSelectionChange: (teamId: string, value: string) => void;
  onPlayerToggle: (teamId: string, playerId: string) => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const mappedCount = OLD_TEAMS.filter(
    (t) => teamStates[t.id]?.newTeamSelection !== 'No Corresponding Team',
  ).length;

  return (
    <div className="mapping-page">
      <header className="page-topbar">
        <button className="back-link" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Programs
        </button>
        <span className="topbar-progress">
          {mappedCount} of {OLD_TEAMS.length} teams mapped
        </span>
      </header>

      <div className="mapping-scroll">
        <div className="mapping-inner">

          {/* Column headers */}
          <div className="col-headers">
            <div className="col-header">
              <span className="col-kicker">OLD PROGRAM</span>
              <span className="col-name">{OLD_PROGRAM_NAME}</span>
            </div>
            <div className="col-arrow-space" />
            <div className="col-header col-header--new">
              <span className="col-kicker col-kicker--new">NEW PROGRAM</span>
              <span className="col-name col-name--new">{newProgramName}</span>
            </div>
            <div style={{ width: 28 }} />
          </div>

          {/* Team rows */}
          <div className="team-list">
            {OLD_TEAMS.map((team) => (
              <TeamRow
                key={team.id}
                team={team}
                state={teamStates[team.id]}
                onToggleExpand={() => onToggleExpand(team.id)}
                onSelectionChange={(v) => onSelectionChange(team.id, v)}
                onPlayerToggle={(pid) => onPlayerToggle(team.id, pid)}
              />
            ))}
          </div>

          <p className="mapping-hint">
            Click a team row to review and confirm its returning roster before completing the turnover.
          </p>

        </div>
      </div>

      <footer className="page-footer">
        <Button buttonStyle="minimal" buttonType="secondary" size="medium" onClick={onBack}>
          Back
        </Button>
        <Button buttonStyle="standard" buttonType="primary" size="medium" onClick={onComplete}>
          Complete Turnover
        </Button>
      </footer>

      <style jsx>{`
        .mapping-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--u-color-background-canvas, #eff0f0);
          overflow: hidden;
        }
        .page-topbar {
          height: 48px;
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          flex-shrink: 0;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--u-color-base-foreground, #36485c);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }
        .back-link:hover {
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .topbar-progress {
          font-family: var(--u-font-body);
          font-size: 13px;
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .mapping-scroll {
          flex: 1;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 32px 48px 48px;
        }
        .mapping-inner {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .col-headers {
          display: grid;
          grid-template-columns: 1fr 36px 1fr 28px;
          gap: 8px;
          padding: 0 16px;
          align-items: flex-end;
        }
        .col-header {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .col-kicker {
          font-family: var(--u-font-body);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .col-kicker--new {
          color: var(--u-color-emphasis-background-contrast, #0273e3);
        }
        .col-name {
          font-family: var(--u-font-body);
          font-size: 15px;
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .col-name--new {
          color: var(--u-color-emphasis-background-contrast, #0273e3);
        }
        .col-arrow-space {
          width: 36px;
        }

        .team-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mapping-hint {
          font-family: var(--u-font-body);
          font-size: 12px;
          color: var(--u-color-base-foreground-subtle, #607081);
          text-align: center;
          margin: 0;
          padding-top: 4px;
        }

        .page-footer {
          height: 64px;
          background: var(--u-color-background-container, #fefefe);
          border-top: 1px solid var(--u-color-line-subtle, #c4c6c8);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

// ─── Complete view ────────────────────────────────────────────────────────────

function CompleteView({
  newProgramName,
  teamStates,
  onDone,
}: {
  newProgramName: string;
  teamStates: Record<string, TeamState>;
  onDone: () => void;
}) {
  const newTeamsCount = OLD_TEAMS.filter(
    (t) => teamStates[t.id]?.newTeamSelection !== 'No Corresponding Team',
  ).length;

  const totalTransferred = OLD_TEAMS.reduce((sum, team) => {
    const state = teamStates[team.id];
    if (state.newTeamSelection === 'No Corresponding Team') return sum;
    return sum + getReturningCount(team, state);
  }, 0);

  return (
    <div className="complete-page">
      <header className="page-topbar">
        <button className="back-link" onClick={onDone}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Programs
        </button>
      </header>

      <div className="complete-content">
        <div className="complete-card">
          <div className="success-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M5 14l7 7 11-13" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="complete-header">
            <h1 className="complete-title">Turnover Complete!</h1>
            <p className="complete-desc">
              <strong>{newProgramName}</strong> has been created. Your team structure and roster selections have been applied.
            </p>
          </div>

          <div className="summary-row">
            <div className="summary-stat">
              <span className="stat-number">{newTeamsCount}</span>
              <span className="stat-label">New teams created</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="stat-number">{totalTransferred}</span>
              <span className="stat-label">Athletes transferred</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="stat-number">
                {OLD_TEAMS.filter((t) => teamStates[t.id]?.newTeamSelection === 'No Corresponding Team').length}
              </span>
              <span className="stat-label">Teams not carried over</span>
            </div>
          </div>

          <div className="complete-team-list">
            {OLD_TEAMS.filter((t) => teamStates[t.id]?.newTeamSelection !== 'No Corresponding Team').map((team) => {
              const state = teamStates[team.id];
              const rc = getReturningCount(team, state);
              return (
                <div key={team.id} className="complete-team-row">
                  <span className="complete-check">✓</span>
                  <span className="complete-team-name">{state.newTeamSelection.replace('Create New ', '')}</span>
                  <span className="complete-team-count">{rc} athlete{rc !== 1 ? 's' : ''}</span>
                </div>
              );
            })}
          </div>

          <div className="complete-actions">
            <Button buttonStyle="standard" buttonType="primary" size="medium" onClick={onDone}>
              Go to Programs
            </Button>
            <Button buttonStyle="standard" buttonType="secondary" size="medium" onClick={onDone}>
              View New Program
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .complete-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--u-color-background-canvas, #eff0f0);
        }
        .page-topbar {
          height: 48px;
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          display: flex;
          align-items: center;
          padding: 0 24px;
          flex-shrink: 0;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--u-color-base-foreground, #36485c);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }
        .back-link:hover {
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .complete-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .complete-card {
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 12px;
          padding: 48px;
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .success-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .complete-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .complete-title {
          font-family: var(--u-font-body);
          font-size: 22px;
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
        }
        .complete-desc {
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
          line-height: 1.6;
        }
        .summary-row {
          display: flex;
          align-items: stretch;
          gap: 0;
          padding: 16px 20px;
          background: var(--u-color-background-canvas, #eff0f0);
          border-radius: 8px;
        }
        .summary-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          align-items: center;
          text-align: center;
        }
        .stat-number {
          font-family: var(--u-font-body);
          font-size: 26px;
          font-weight: 700;
          color: var(--u-color-emphasis-background-contrast, #0273e3);
          line-height: 1;
        }
        .stat-label {
          font-family: var(--u-font-body);
          font-size: 11px;
          color: var(--u-color-base-foreground-subtle, #607081);
          line-height: 1.3;
        }
        .summary-divider {
          width: 1px;
          background: var(--u-color-line-subtle, #c4c6c8);
          margin: 0 16px;
          flex-shrink: 0;
        }
        .complete-team-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .complete-team-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f0fdf4;
          border-radius: 6px;
          border: 1px solid #bbf7d0;
        }
        .complete-check {
          font-size: 13px;
          color: #15803d;
          flex-shrink: 0;
        }
        .complete-team-name {
          font-family: var(--u-font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
          flex: 1;
        }
        .complete-team-count {
          font-family: var(--u-font-body);
          font-size: 12px;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .complete-actions {
          display: flex;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TransferPageClient() {
  const router = useRouter();
  const [view, setView] = useState<View>('naming');
  const [newProgramName, setNewProgramName] = useState('');
  const [teamStates, setTeamStates] = useState<Record<string, TeamState>>(initTeamStates);

  const handleNamingSubmit = useCallback((name: string) => {
    setNewProgramName(name);
    setView('mapping');
  }, []);

  const handleToggleExpand = useCallback((teamId: string) => {
    setTeamStates((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], expanded: !prev[teamId].expanded },
    }));
  }, []);

  const handleSelectionChange = useCallback((teamId: string, value: string) => {
    setTeamStates((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], newTeamSelection: value, expanded: false },
    }));
  }, []);

  const handlePlayerToggle = useCallback((teamId: string, playerId: string) => {
    setTeamStates((prev) => {
      const teamState = prev[teamId];
      return {
        ...prev,
        [teamId]: {
          ...teamState,
          playerReturning: {
            ...teamState.playerReturning,
            [playerId]: !teamState.playerReturning[playerId],
          },
        },
      };
    });
  }, []);

  if (view === 'naming') {
    return (
      <NamingView
        onSubmit={handleNamingSubmit}
        onBack={() => router.push('/programs')}
      />
    );
  }

  if (view === 'mapping') {
    return (
      <MappingView
        newProgramName={newProgramName}
        teamStates={teamStates}
        onToggleExpand={handleToggleExpand}
        onSelectionChange={handleSelectionChange}
        onPlayerToggle={handlePlayerToggle}
        onComplete={() => setView('complete')}
        onBack={() => setView('naming')}
      />
    );
  }

  return (
    <CompleteView
      newProgramName={newProgramName}
      teamStates={teamStates}
      onDone={() => router.push('/programs')}
    />
  );
}
