'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Select from '@/components/Select';
import type { ProgramWithStats } from '@/lib/actions/programs';

// ─── Mock roster (prototype) ─────────────────────────────────────────────────

interface Athlete {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  primaryContact: string;
  dateAdded: string;
}

const MOCK_ROSTER: Athlete[] = [
  { id: 'a1', name: 'Caroline Murray', birthDate: 'August 19, 2006', gender: 'Female', primaryContact: 'Mary Murray', dateAdded: 'Nov 1, 2025 at 9:15 AM' },
  { id: 'a2', name: 'Shannon Dohrman', birthDate: 'August 7, 2006', gender: 'Female', primaryContact: 'Julie Dohrman', dateAdded: 'Nov 3, 2025 at 11:30 AM' },
  { id: 'a3', name: 'Taylor Smith', birthDate: 'August 10, 2006', gender: 'Female', primaryContact: 'Alexis Smith', dateAdded: 'Nov 5, 2025 at 2:20 PM' },
  { id: 'a4', name: 'Alexis Chen', birthDate: 'August 9, 2006', gender: 'Female', primaryContact: 'Taylor Chen', dateAdded: 'Nov 7, 2025 at 4:10 PM' },
  { id: 'a5', name: 'Kayla Johnson', birthDate: 'August 23, 2006', gender: 'Female', primaryContact: 'Tammy Johnson', dateAdded: 'Nov 12, 2025 at 10:45 AM' },
  { id: 'a6', name: 'Jamie Wong', birthDate: 'August 4, 2006', gender: 'Female', primaryContact: 'Chen Wong', dateAdded: 'Nov 15, 2025 at 3:35 PM' },
  { id: 'a7', name: 'Riley Thompson', birthDate: 'August 10, 2006', gender: 'Female', primaryContact: 'Morgan Thompson', dateAdded: 'Nov 18, 2025 at 1:25 PM' },
  { id: 'a8', name: 'Morgan Patel', birthDate: 'August 6, 2006', gender: 'Female', primaryContact: 'Jordan Patel', dateAdded: 'Nov 18, 2025 at 1:25 PM' },
  { id: 'a9', name: 'Sydney Kim', birthDate: 'August 8, 2006', gender: 'Female', primaryContact: 'Pam Kim', dateAdded: 'Nov 18, 2025 at 1:25 PM' },
  { id: 'a10', name: 'Dakota Rivers', birthDate: 'August 19, 2006', gender: 'Female', primaryContact: 'Jamie Rivers', dateAdded: 'Nov 18, 2025 at 1:25 PM' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'outstanding', label: 'Outstanding' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'refunded', label: 'Refunded' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateRange(eventDates: { start?: string; end?: string }) {
  const s = eventDates.start ? new Date(eventDates.start) : null;
  const e = eventDates.end ? new Date(eventDates.end) : null;
  if (s && e) return `${format(s, 'MMM d, yyyy')} - ${format(e, 'MMM d, yyyy')}`;
  if (s) return format(s, 'MMM d, yyyy');
  if (e) return format(e, 'MMM d, yyyy');
  return '—';
}

function formatType(type: string) {
  const map: Record<string, string> = {
    'tryout': 'Tryout',
    'team-dues': 'Team-Dues',
    'team dues': 'Team-Dues',
    'season': 'Season',
    'camp': 'Camp',
    'clinic': 'Clinic',
    'tournament': 'Tournament',
  };
  return map[type.toLowerCase()] || type;
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7.25v3.25M8 5.4h.006" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SortArrow() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4, color: 'var(--u-color-base-foreground-subtle, #85909e)' }}>
      <path d="M5 1v10M1 4l4-3 4 3M1 8l4 3 4-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`pd-toggle${checked ? ' pd-toggle--on' : ''}`}>
      <span className="pd-knob" />
      <style jsx>{`
        .pd-toggle {
          width: 40px;
          height: 22px;
          border-radius: 9999px;
          padding: 3px;
          border: none;
          background: var(--u-color-line-default, #85909e);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .pd-toggle--on {
          background: var(--u-color-emphasis-background-contrast, #0273e3);
          justify-content: flex-end;
        }
        .pd-knob {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #fff;
          flex-shrink: 0;
        }
      `}</style>
    </button>
  );
}

// ─── Stat group ──────────────────────────────────────────────────────────────

function StatGroup({
  label,
  value,
  labelInfo,
  rows,
}: {
  label: string;
  value: string;
  labelInfo?: boolean;
  rows: { label: string; value: string; info?: boolean }[];
}) {
  return (
    <div className="sg">
      <div className="sg-head">
        <span className="sg-label">{label}</span>
        {labelInfo && <span className="sg-info"><InfoIcon /></span>}
      </div>
      <span className="sg-value">{value}</span>
      <div className="sg-rows">
        {rows.map((r, i) => (
          <div key={i} className="sg-row">
            <span className="sg-row-label">
              {r.label}
              {r.info && <span className="sg-info"><InfoIcon /></span>}
            </span>
            <span className="sg-dots" />
            <span className="sg-row-value">{r.value}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .sg {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sg-head {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sg-label {
          font-family: var(--u-font-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .sg-info {
          display: inline-flex;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .sg-value {
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: 44px;
          font-weight: 700;
          font-style: italic;
          line-height: 1.1;
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin-bottom: 8px;
        }
        .sg-rows {
          display: flex;
          flex-direction: column;
        }
        .sg-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 10px 0;
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
        }
        .sg-row-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
          white-space: nowrap;
        }
        .sg-dots {
          flex: 1;
          border-bottom: 1px dotted var(--u-color-line-default, #c4c6c8);
          transform: translateY(-3px);
        }
        .sg-row-value {
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProgramDetailPageClient({
  programId,
  programs,
}: {
  programId: string;
  programs: ProgramWithStats[];
}) {
  const router = useRouter();
  const [program, setProgram] = useState<ProgramWithStats | null>(
    () => programs.find(p => p.id === programId) ?? null
  );
  const [openRegistration, setOpenRegistration] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'teams'>('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  // Resolve builder-created programs stored locally when not found server-side
  useEffect(() => {
    if (program) {
      setOpenRegistration(program.registrationStatus === 'open');
      return;
    }
    try {
      const raw = localStorage.getItem('createdPrograms');
      const created = raw ? (JSON.parse(raw) as ProgramWithStats[]) : [];
      const found = created.find(p => p.id === programId) ?? null;
      if (found) {
        setProgram(found);
        setOpenRegistration(found.registrationStatus === 'open');
      }
    } catch {
      // ignore
    }
  }, [program, programId]);

  const rows = MOCK_ROSTER.filter(a => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return a.name.toLowerCase().includes(q) || a.primaryContact.toLowerCase().includes(q);
  });

  const allSelected = rows.length > 0 && rows.every(r => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : rows.map(r => r.id));
  const toggleOne = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const title = program?.title ?? 'Program';
  const type = program ? formatType(program.type) : '—';
  const dateRange = program ? formatDateRange(program.eventDates) : '—';
  const registrants = program?.registrantCount ?? 0;
  const value = program ? formatCurrency(program.programValue) : '$0.00';
  const isTryout = (program?.type ?? '').toLowerCase() === 'tryout';

  const regOptions = [
    {
      id: 'r1',
      name: isTryout ? 'Tryout Registration' : 'Full Season Dues',
      price: isTryout ? 5000 : 45000,
      registered: registrants,
      status: openRegistration ? 'Open' : 'Closed',
    },
    ...(isTryout
      ? []
      : [
          {
            id: 'r2',
            name: 'Monthly Payment Plan',
            price: 9000,
            registered: 0,
            status: openRegistration ? 'Open' : 'Closed',
          },
        ]),
  ];

  const programTeams = [
    { id: 't1', name: '8U Black', status: 'Draft', athletes: 12, coaches: 2 },
    { id: 't2', name: '10U Gold', status: 'Draft', athletes: 12, coaches: 3 },
    { id: 't3', name: '12U Blue', status: 'Draft', athletes: 10, coaches: 2 },
    { id: 't4', name: '14U Red', status: 'Active', athletes: 11, coaches: 1 },
  ];

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <button className="pd-crumb" onClick={() => router.push('/programs')}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Programs</span>
        <span className="pd-crumb-sep">/</span>
      </button>

      {/* Header */}
      <div className="pd-header">
        <div className="pd-header-left">
          <h1 className="pd-title">{title}</h1>
          <p className="pd-subtitle">{type} · {dateRange}</p>
        </div>
        <div className="pd-header-right">
          <span className="pd-reg-info"><InfoIcon /></span>
          <span className="pd-reg-label">Open Registration</span>
          <Toggle checked={openRegistration} onChange={setOpenRegistration} />
          <button className="pd-more" aria-label="More options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="3" cy="8" r="1.5" fill="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <circle cx="13" cy="8" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="pd-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`pd-tab${activeTab === 'overview' ? ' pd-tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'registrations'}
          className={`pd-tab${activeTab === 'registrations' ? ' pd-tab--active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          Registration Options
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'teams'}
          className={`pd-tab${activeTab === 'teams' ? ' pd-tab--active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams
        </button>
      </div>

      {activeTab === 'overview' && (
      <>
      {/* Draft teams nudge (tryout only) */}
      {isTryout && (
        <div className="pd-banner" role="status">
          <div className="pd-banner-main">
            <span className="pd-banner-icon"><InfoIcon /></span>
            <span className="pd-banner-text">
              All done with tryouts? Create your draft teams now to assign athletes
            </span>
          </div>
          <button className="pd-banner-btn" onClick={() => router.push('/teams/manage')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Add Teams
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="pd-stats">
        <StatGroup
          label="Registrants"
          value={String(registrants)}
          rows={[
            { label: 'Overdue', value: '0' },
            { label: 'Overdue Amount', value: '$0.00' },
            { label: 'Completed', value: String(registrants), info: true },
          ]}
        />
        <StatGroup
          label="Registration Value"
          labelInfo
          value={value}
          rows={[
            { label: 'Paid to Date', value },
            { label: 'Outstanding', value: '$0.00' },
            { label: 'Refunded', value: '$0.00' },
          ]}
        />
      </div>

      {/* Toolbar */}
      <div className="pd-toolbar">
        <div className="pd-status">
          <Select options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className="pd-toolbar-right">
          <div className="pd-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="pd-search-input"
              placeholder="Search for…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="pd-download">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="pd-table">
        <div className="pd-row pd-row--head">
          <div className="pd-cell pd-cell--check">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
          </div>
          <div className="pd-cell pd-cell--name">Athlete Name <SortArrow /></div>
          <div className="pd-cell pd-cell--birth">Birth Date <SortArrow /></div>
          <div className="pd-cell pd-cell--gender">Gender <SortArrow /></div>
          <div className="pd-cell pd-cell--contact">Primary Contact <SortArrow /></div>
          <div className="pd-cell pd-cell--added">Date Added <SortArrow /></div>
        </div>
        {rows.map(a => {
          const isSel = selected.includes(a.id);
          return (
            <div key={a.id} className={`pd-row${isSel ? ' pd-row--selected' : ''}`}>
              <div className="pd-cell pd-cell--check">
                <input type="checkbox" checked={isSel} onChange={() => toggleOne(a.id)} aria-label={`Select ${a.name}`} />
              </div>
              <div className="pd-cell pd-cell--name pd-cell--emphasis">{a.name}</div>
              <div className="pd-cell pd-cell--birth">{a.birthDate}</div>
              <div className="pd-cell pd-cell--gender">{a.gender}</div>
              <div className="pd-cell pd-cell--contact">{a.primaryContact}</div>
              <div className="pd-cell pd-cell--added">{a.dateAdded}</div>
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* Registration Options tab */}
      {activeTab === 'registrations' && (
        <div className="pd-reg-panel">
          <div className="pd-reg-list">
            {regOptions.map(opt => (
              <div key={opt.id} className="pd-reg-card">
                <div className="pd-reg-card-main">
                  <div className="pd-reg-card-top">
                    <span className="pd-reg-name">{opt.name}</span>
                    <span className={`pd-reg-pill pd-reg-pill--${opt.status.toLowerCase()}`}>{opt.status}</span>
                  </div>
                  <div className="pd-reg-meta">
                    <span>{dateRange}</span>
                    <span className="pd-reg-dot" />
                    <span>{opt.registered} registered</span>
                  </div>
                </div>
                <span className="pd-reg-price">{formatCurrency(opt.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams tab */}
      {activeTab === 'teams' && (
        <div className="pd-reg-panel">
          <div className="pd-teams-head">
            <span className="pd-teams-count">{programTeams.length} teams</span>
            <button className="pd-teams-manage" onClick={() => router.push('/teams/manage')}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Add Teams
            </button>
          </div>
          <div className="pd-reg-list">
            {programTeams.map(team => (
              <button
                key={team.id}
                className="pd-team-card"
                onClick={() => router.push(team.status === 'Draft' ? '/teams/assignments' : '/teams')}
              >
                <div className="pd-reg-card-main">
                  <div className="pd-reg-card-top">
                    <span className="pd-reg-name">{team.name}</span>
                    <span className={`pd-team-pill pd-team-pill--${team.status.toLowerCase()}`}>{team.status}</span>
                  </div>
                  <div className="pd-reg-meta">
                    <span>{team.athletes} {team.athletes === 1 ? 'athlete' : 'athletes'}</span>
                    <span className="pd-reg-dot" />
                    <span>{team.coaches} {team.coaches === 1 ? 'coach' : 'coaches'}</span>
                  </div>
                </div>
                <svg className="pd-team-chevron" width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .pd-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        /* Breadcrumb */
        .pd-crumb {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 700;
          color: var(--u-color-base-foreground, #36485c);
          align-self: flex-start;
        }
        .pd-crumb:hover { color: var(--u-color-base-foreground-contrast, #071c31); }
        .pd-crumb-sep { color: var(--u-color-base-foreground-subtle, #607081); font-weight: 400; }

        /* Header */
        .pd-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
        }
        .pd-header-left { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .pd-title {
          font-family: var(--u-font-body);
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: 0.25px;
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
        }
        .pd-subtitle {
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground-subtle, #607081);
          margin: 0;
        }
        .pd-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .pd-reg-info { display: inline-flex; color: var(--u-color-base-foreground-subtle, #607081); }
        .pd-reg-label {
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .pd-more {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 4px;
          background: var(--u-color-background-canvas, #eff0f0);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          margin-left: 4px;
          transition: background 0.15s ease;
        }
        .pd-more:hover { background: #e0e1e1; }

        /* Stats */
        .pd-stats {
          display: flex;
          gap: 48px;
          width: 100%;
        }

        /* Toolbar */
        .pd-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
        }
        .pd-status { width: 200px; flex-shrink: 0; }
        .pd-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          padding: 12px 12px 12px 16px;
          background: rgba(2, 115, 227, 0.06);
          border: 1px solid rgba(2, 115, 227, 0.35);
          border-radius: 6px;
        }
        .pd-banner-main {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .pd-banner-icon {
          display: inline-flex;
          color: var(--u-color-emphasis-background-contrast, #0273e3);
          flex-shrink: 0;
        }
        .pd-banner-text {
          font-family: var(--u-font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .pd-banner-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 32px;
          padding: 0 12px;
          border: none;
          border-radius: 4px;
          background: var(--u-color-emphasis-background-contrast, #0273e3);
          color: #fff;
          font-family: var(--u-font-body);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .pd-banner-btn:hover { background: #005bbf; }
        .pd-toolbar-right { display: flex; align-items: center; gap: 8px; }
        .pd-search {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          width: 260px;
          padding: 0 12px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 4px;
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .pd-search:focus-within {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          box-shadow: 0 0 0 3px rgba(2, 115, 227, 0.15);
        }
        .pd-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
          min-width: 0;
        }
        .pd-search-input::placeholder { color: var(--u-color-base-foreground-subtle, #607081); }
        .pd-download {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          border: none;
          border-radius: 4px;
          background: var(--u-color-background-canvas, #e0e1e1);
          color: var(--u-color-base-foreground, #36485c);
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .pd-download:hover { background: #d0d1d2; }

        /* Table */
        .pd-table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .pd-row {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
        }
        .pd-row--head {
          border-bottom: 2px solid var(--u-color-line-default, #85909e);
        }
        .pd-row:not(.pd-row--head) { height: 52px; }
        .pd-row:not(.pd-row--head):hover { background: var(--u-color-background-subtle, #f5f6f7); }
        .pd-row--selected { background: rgba(2, 115, 227, 0.04); }
        .pd-cell {
          padding: 10px 16px;
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
        }
        .pd-row--head .pd-cell {
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
          white-space: nowrap;
        }
        .pd-cell--emphasis {
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .pd-cell--check {
          width: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 8px;
          padding-right: 0;
        }
        .pd-cell--check input {
          width: 16px;
          height: 16px;
          accent-color: var(--u-color-emphasis-background-contrast, #0273e3);
          cursor: pointer;
        }
        .pd-cell--name { flex: 1; min-width: 180px; }
        .pd-cell--birth { width: 190px; flex-shrink: 0; }
        .pd-cell--gender { width: 200px; flex-shrink: 0; }
        .pd-cell--contact { width: 240px; flex-shrink: 0; }
        .pd-cell--added { width: 220px; flex-shrink: 0; }

        /* Tabs */
        .pd-tabs {
          display: flex;
          gap: 24px;
          width: 100%;
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }
        .pd-tab {
          position: relative;
          background: none;
          border: none;
          padding: 4px 0 12px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 700;
          color: var(--u-color-base-foreground-subtle, #607081);
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .pd-tab:hover { color: var(--u-color-base-foreground-contrast, #071c31); }
        .pd-tab--active { color: var(--u-color-base-foreground-contrast, #071c31); }
        .pd-tab--active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: var(--u-color-emphasis-background-contrast, #0273e3);
          border-radius: 2px 2px 0 0;
        }

        /* Registration options */
        .pd-reg-panel { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .pd-reg-list { display: flex; flex-direction: column; gap: 12px; width: 100%; }
        .pd-reg-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 8px;
        }
        .pd-reg-card-main { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .pd-reg-card-top { display: flex; align-items: center; gap: 10px; }
        .pd-reg-name {
          font-family: var(--u-font-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
        .pd-reg-pill {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 9999px;
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: 700;
        }
        .pd-reg-pill--open { background: #e3f9e5; color: #1a6831; }
        .pd-reg-pill--closed { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground-subtle, #607081); }
        .pd-reg-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--u-font-body);
          font-size: 13px;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .pd-reg-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--u-color-base-foreground-subtle, #607081);
          display: inline-block;
          flex-shrink: 0;
        }
        .pd-reg-price {
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: 28px;
          font-weight: 700;
          font-style: italic;
          color: var(--u-color-base-foreground-contrast, #071c31);
          flex-shrink: 0;
        }

        /* Teams tab */
        .pd-teams-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
        }
        .pd-teams-count {
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 700;
          color: var(--u-color-base-foreground-subtle, #607081);
        }
        .pd-teams-manage {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 14px;
          border: none;
          border-radius: 4px;
          background: var(--u-color-emphasis-background-contrast, #0273e3);
          color: #fff;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .pd-teams-manage:hover { background: #005bbf; }
        .pd-team-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          padding: 16px 20px;
          text-align: left;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .pd-team-card:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }
        .pd-team-pill {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 9999px;
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: 700;
        }
        .pd-team-pill--draft { background: #fef3c7; color: #92400e; }
        .pd-team-pill--active { background: #e3f9e5; color: #1a6831; }
        .pd-team-pill--pending { background: #dbeafe; color: #1e40af; }
        .pd-team-pill--archived { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground-subtle, #607081); }
        .pd-team-chevron {
          color: var(--u-color-base-foreground-subtle, #607081);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
