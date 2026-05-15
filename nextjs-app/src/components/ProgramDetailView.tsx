'use client';

import React, { useState } from 'react';
import type { ProgramWithStats } from '@/lib/actions/programs';

/* ── Mock registrant data per program ── */
interface Registrant {
  id: string;
  name: string;
  grade: string;
  team: string | null;
  fee: number;
  paid: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  parentEmail: string;
}

const FIRST_NAMES = ['Aiden', 'Brayden', 'Carter', 'Devin', 'Ethan', 'Finn', 'Gavin', 'Hunter', 'Isaac', 'Jayden', 'Kaden', 'Landon', 'Mason', 'Noah', 'Owen', 'Parker', 'Quinn', 'Ryan', 'Sam', 'Tyler', 'Victor', 'Wyatt', 'Xavier', 'Zach', 'Logan', 'Caleb', 'Luke', 'Dylan', 'Eli', 'Jack'];
const LAST_NAMES = ['Anderson', 'Baker', 'Clark', 'Davis', 'Edwards', 'Foster', 'Garcia', 'Harris', 'Irving', 'Johnson', 'Kelly', 'Lopez', 'Martinez', 'Nelson', 'Ortiz', 'Patel', 'Quinn', 'Robinson', 'Smith', 'Thompson', 'Upton', 'Vasquez', 'Williams', 'Young', 'Zimmerman'];
const TEAMS_8U_12U = ['8U Wildcats', '8U Tigers', '10U Eagles', '10U Panthers', '12U Falcons', '12U Bears'];
const TEAMS_FLAG = ['K-1 Red', 'K-1 Blue', '2-3 Gold', '2-3 Silver', '4-5 Green', '4-5 Orange'];
const GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateRegistrants(program: ProgramWithStats): Registrant[] {
  const count = program.registrantCount;
  const fee = program.feePerPlayer || 0;
  const rand = seededRandom(program.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const teamList = program.title.toLowerCase().includes('flag') ? TEAMS_FLAG : TEAMS_8U_12U;
  const registrants: Registrant[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const grade = GRADES[Math.floor(rand() * GRADES.length)];
    const team = program.teamCount ? teamList[Math.floor(rand() * Math.min(teamList.length, program.teamCount || 6))] : null;

    const roll = rand();
    let paid: number;
    let status: Registrant['status'];
    if (roll < (program.paidPercent || 80) / 100) {
      paid = fee;
      status = 'Paid';
    } else if (roll < ((program.paidPercent || 80) / 100) + 0.08) {
      paid = Math.round(fee * 0.5);
      status = 'Partial';
    } else {
      paid = 0;
      status = 'Unpaid';
    }

    registrants.push({
      id: `${program.id}-reg-${i}`,
      name: `${firstName} ${lastName}`,
      grade,
      team,
      fee,
      paid,
      status,
      parentEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    });
  }

  return registrants;
}

function formatDollars(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface ProgramDetailViewProps {
  program: ProgramWithStats;
  onBack: () => void;
}

export default function ProgramDetailView({ program, onBack }: ProgramDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Partial' | 'Unpaid'>('all');
  const registrants = React.useMemo(() => generateRegistrants(program), [program]);

  const filtered = registrants.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.parentEmail.toLowerCase().includes(q) || (r.team || '').toLowerCase().includes(q);
    }
    return true;
  });

  const totalPaid = registrants.reduce((s, r) => s + r.paid, 0);
  const totalFees = registrants.reduce((s, r) => s + r.fee, 0);
  const totalOutstanding = totalFees - totalPaid;
  const unpaidCount = registrants.filter(r => r.status === 'Unpaid').length;
  const partialCount = registrants.filter(r => r.status === 'Partial').length;

  return (
    <div className="program-detail">
      {/* Back + Title */}
      <div className="program-detail-header">
        <button className="program-detail-back" onClick={onBack}>
          <BackIcon />
          <span>All Programs</span>
        </button>
        <h2 className="program-detail-title">{program.title}</h2>
        <div className="program-detail-meta">
          <span className={`status-badge ${program.registrationStatus === 'open' ? 'positive' : 'neutral'}`}>
            {program.registrationStatus === 'open' ? 'Open' : 'Closed'}
          </span>
          {program.keyDates && <span className="program-detail-dates">{program.keyDates}</span>}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="program-detail-cards">
        <div className="program-detail-card">
          <span className="program-detail-card-label">Registrants</span>
          <span className="program-detail-card-value">{program.registrantCount}</span>
        </div>
        {program.teamCount != null && (
          <div className="program-detail-card">
            <span className="program-detail-card-label">Teams</span>
            <span className="program-detail-card-value">{program.teamCount}</span>
          </div>
        )}
        <div className="program-detail-card">
          <span className="program-detail-card-label">Revenue</span>
          <span className="program-detail-card-value">{formatDollars(totalPaid)}</span>
        </div>
        <div className="program-detail-card program-detail-card--alert">
          <span className="program-detail-card-label">Outstanding</span>
          <span className="program-detail-card-value program-detail-card-value--alert">{formatDollars(totalOutstanding)}</span>
          <span className="program-detail-card-sub">{unpaidCount} unpaid, {partialCount} partial</span>
        </div>
      </div>

      {/* Filters */}
      <div className="program-detail-toolbar">
        <div className="program-detail-search">
          <SearchIcon />
          <input type="text" placeholder="Search registrants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="program-detail-filters">
          {(['all', 'Paid', 'Partial', 'Unpaid'] as const).map(s => (
            <button key={s} className={`program-detail-filter-btn ${statusFilter === s ? 'program-detail-filter-btn--active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : s}
              {s !== 'all' && <span className="program-detail-filter-count">{registrants.filter(r => r.status === s).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Registrants Table */}
      <div className="table-scroll-container">
        <div className="programs-table" style={{ minWidth: '900px' }}>
          <div className="table-row table-header">
            <div className="table-cell cell-title"><span className="header-label">Athlete</span></div>
            <div className="table-cell cell-type"><span className="header-label">Grade</span></div>
            <div className="table-cell" style={{ width: '160px', flexShrink: 0 }}><span className="header-label">Team</span></div>
            <div className="table-cell" style={{ width: '200px', flexShrink: 0 }}><span className="header-label">Parent Email</span></div>
            <div className="table-cell cell-value align-right"><span className="header-label">Fee</span></div>
            <div className="table-cell cell-value align-right"><span className="header-label">Paid</span></div>
            <div className="table-cell cell-registration"><span className="header-label">Status</span></div>
          </div>
          {filtered.map(r => (
            <div key={r.id} className="table-row table-data">
              <div className="table-cell cell-title emphasized">{r.name}</div>
              <div className="table-cell cell-type">{r.grade}</div>
              <div className="table-cell" style={{ width: '160px', flexShrink: 0 }}>{r.team || '\u2014'}</div>
              <div className="table-cell" style={{ width: '200px', flexShrink: 0, fontSize: '13px', color: 'var(--u-color-base-foreground-subtle, #607081)' }}>{r.parentEmail}</div>
              <div className="table-cell cell-value align-right">{formatDollars(r.fee)}</div>
              <div className="table-cell cell-value align-right">{formatDollars(r.paid)}</div>
              <div className="table-cell cell-registration">
                <span className={`status-badge ${r.status === 'Paid' ? 'positive' : r.status === 'Partial' ? 'warning' : 'negative'}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="table-row table-data" style={{ justifyContent: 'center', color: 'var(--u-color-base-foreground-subtle, #607081)', padding: '24px' }}>
              No registrants match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
