'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { ProgramWithStats } from '@/lib/actions/programs';
import Toolbar from './Toolbar';
import EmptyState from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';

function formatDateRange(eventDates: { start?: string; end?: string }) {
  if (!eventDates.start && !eventDates.end) return '\u2014';
  const startDateObj = eventDates.start ? new Date(eventDates.start) : null;
  const endDateObj = eventDates.end ? new Date(eventDates.end) : null;
  if (startDateObj && endDateObj) {
    const sameYear = startDateObj.getFullYear() === endDateObj.getFullYear();
    if (sameYear) return `${format(startDateObj, 'MMM d')} \u2013 ${format(endDateObj, 'MMM d, yyyy')}`;
    return `${format(startDateObj, 'MMM d, yyyy')} \u2013 ${format(endDateObj, 'MMM d, yyyy')}`;
  }
  if (startDateObj) return format(startDateObj, 'MMM d, yyyy');
  if (endDateObj) return format(endDateObj, 'MMM d, yyyy');
  return '\u2014';
}

function formatProgramType(type: string): string {
  const typeMap: Record<string, string> = { tryout: 'Tryout', season: 'Season', camp: 'Camp', clinic: 'Clinic', other: 'Other' };
  return typeMap[type.toLowerCase()] || type;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function formatDollars(dollars: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dollars);
}

function formatRegistrationStatus(status: string): string { return status === 'open' ? 'Open' : 'Closed'; }

function MoreOptionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="8" r="1.5" fill="var(--u-color-base-foreground, #36485c)" />
      <circle cx="8" cy="8" r="1.5" fill="var(--u-color-base-foreground, #36485c)" />
      <circle cx="13" cy="8" r="1.5" fill="var(--u-color-base-foreground, #36485c)" />
    </svg>
  );
}

function StatusBadge({ status, type }: { status: string; type: 'visibility' | 'registration' }) {
  const isPositive = type === 'registration' ? status === 'open' : status === 'public';
  const label = type === 'registration' ? formatRegistrationStatus(status) : (status === 'public' ? 'Public' : 'Private');
  return <span className={`status-badge ${isPositive ? 'positive' : 'neutral'}`}>{label}</span>;
}

function PaidBar({ percent }: { percent: number }) {
  const isLow = percent < 70;
  return (
    <div className="paid-bar-container">
      <div className="paid-bar-track">
        <div className="paid-bar-fill" style={{ width: `${percent}%`, background: isLow ? '#dc2626' : '#16a34a' }} />
      </div>
      <span className={`paid-bar-label ${isLow ? 'paid-bar-label--low' : ''}`}>{percent}%</span>
    </div>
  );
}

interface ProgramsTableProps {
  programs: ProgramWithStats[];
  onProgramClick?: (program: ProgramWithStats) => void;
}

function TableContent({ programs, showFinancials, onProgramClick }: { programs: ProgramWithStats[]; showFinancials: boolean; onProgramClick?: (program: ProgramWithStats) => void }) {
  return (
    <div className="programs-table" style={{ minWidth: showFinancials ? '1200px' : '1100px' }}>
      <div className="table-row table-header">
        <div className="table-cell cell-title"><span className="header-label">Program</span></div>
        <div className="table-cell cell-registration"><span className="header-label">Registration</span></div>
        <div className="table-cell cell-type"><span className="header-label">Type</span></div>
        <div className="table-cell cell-dates"><span className="header-label">Key Dates</span></div>
        <div className="table-cell cell-registrants align-right"><span className="header-label">Registrants</span></div>
        {showFinancials && (
          <>
            <div className="table-cell cell-teams align-right" style={{ width: '80px' }}><span className="header-label">Teams</span></div>
            <div className="table-cell cell-paid"><span className="header-label">Paid</span></div>
            <div className="table-cell cell-outstanding align-right"><span className="header-label">Outstanding</span></div>
            <div className="table-cell cell-revenue align-right"><span className="header-label">Revenue</span></div>
          </>
        )}
        {!showFinancials && (
          <div className="table-cell cell-value align-right"><span className="header-label">Program Value</span></div>
        )}
        <div className="table-cell cell-actions" />
      </div>
      {programs.map((program) => (
        <div
          key={program.id}
          className="table-row table-data"
          onClick={() => onProgramClick?.(program)}
          role={onProgramClick ? 'button' : undefined}
          tabIndex={onProgramClick ? 0 : undefined}
          onKeyDown={(e) => { if (onProgramClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onProgramClick(program); } }}
        >
          <div className="table-cell cell-title emphasized">{program.title}</div>
          <div className="table-cell cell-registration"><StatusBadge status={program.registrationStatus} type="registration" /></div>
          <div className="table-cell cell-type">{formatProgramType(program.type)}</div>
          <div className="table-cell cell-dates">{program.keyDates || formatDateRange(program.eventDates)}</div>
          <div className="table-cell cell-registrants align-right">{program.registrantCount}</div>
          {showFinancials && (
            <>
              <div className="table-cell cell-teams align-right" style={{ width: '80px' }}>{program.teamCount ?? '\u2014'}</div>
              <div className="table-cell cell-paid">{program.paidPercent != null ? <PaidBar percent={program.paidPercent} /> : '\u2014'}</div>
              <div className="table-cell cell-outstanding align-right">
                {program.outstandingAmount != null ? (
                  <span className={program.outstandingAmount > 0 ? 'outstanding-amount' : ''}>{formatDollars(program.outstandingAmount)}</span>
                ) : '\u2014'}
              </div>
              <div className="table-cell cell-revenue align-right">{program.totalRevenue != null ? formatDollars(program.totalRevenue) : '\u2014'}</div>
            </>
          )}
          {!showFinancials && (
            <div className="table-cell cell-value align-right">{formatCurrency(program.programValue)}</div>
          )}
          <div className="table-cell cell-actions"><button className="more-options-btn" aria-label="More options" onClick={(e) => e.stopPropagation()}><MoreOptionsIcon /></button></div>
        </div>
      ))}
    </div>
  );
}

export default function ProgramsTable({ programs, onProgramClick }: ProgramsTableProps) {
  const [statusFilter, setStatusFilter] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');

  // Detect whether to show financial columns based on data presence
  const showFinancials = programs.some(p => p.paidPercent != null || p.totalRevenue != null);

  const segments = [
    {
      placeholder: 'Status',
      value: statusFilter,
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' },
        { value: 'archive', label: 'Archived' },
      ],
      onChange: (value: string) => setStatusFilter(value),
    },
  ];

  const statusFilteredPrograms = programs.filter(program => {
    if (statusFilter === 'published') return program.status === 'published';
    if (statusFilter === 'draft') return program.status === 'draft';
    if (statusFilter === 'archive') return program.status === 'archived';
    return true;
  });

  const filteredPrograms = searchQuery.trim()
    ? statusFilteredPrograms.filter(program => {
        const query = searchQuery.toLowerCase().trim();
        return program.title.toLowerCase().includes(query) || program.type.toLowerCase().includes(query);
      })
    : statusFilteredPrograms;

  const isSearchEmpty = searchQuery.trim() && statusFilteredPrograms.length > 0 && filteredPrograms.length === 0;
  const getEmptyStateVariant = (): EmptyStateVariant => {
    if (isSearchEmpty) return 'search';
    if (statusFilter === 'draft') return 'programs-draft';
    if (statusFilter === 'archive') return 'programs-archived';
    return 'programs';
  };

  return (
    <div className="programs-content">
      <Toolbar segments={segments} searchPlaceholder="Search programs..." onSearch={(query) => setSearchQuery(query)} onFilter={() => {}} onExport={() => {}} />
      {filteredPrograms.length > 0 ? (
        <div className="table-scroll-container"><TableContent programs={filteredPrograms} showFinancials={showFinancials} onProgramClick={onProgramClick} /></div>
      ) : (
        <EmptyState variant={getEmptyStateVariant()} searchQuery={searchQuery} />
      )}
    </div>
  );
}
