'use client';

import { useState, useMemo } from 'react';
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
  selectable?: boolean;
  onMessageOverdue?: (programs: ProgramWithStats[]) => void;
}

export default function ProgramsTable({ programs, onProgramClick, selectable, onMessageOverdue }: ProgramsTableProps) {
  const [statusFilter, setStatusFilter] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allSelected = filteredPrograms.length > 0 && filteredPrograms.every(p => selectedIds.has(p.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPrograms.map(p => p.id)));
    }
  };

  const selectedPrograms = useMemo(
    () => filteredPrograms.filter(p => selectedIds.has(p.id)),
    [filteredPrograms, selectedIds]
  );

  const selectedOverdueCount = useMemo(
    () => selectedPrograms.reduce((sum, p) => sum + (p.outstandingAmount ?? 0), 0),
    [selectedPrograms]
  );

  const hasOverdue = selectedPrograms.some(p => (p.outstandingAmount ?? 0) > 0);

  return (
    <div className="programs-content">
      <Toolbar segments={segments} searchPlaceholder="Search programs..." onSearch={(query) => setSearchQuery(query)} onFilter={() => {}} onExport={() => {}} />

      {/* Bulk action bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-count">{selectedIds.size} program{selectedIds.size !== 1 ? 's' : ''} selected</span>
          {hasOverdue && onMessageOverdue && (
            <button className="bulk-action-btn" onClick={() => onMessageOverdue(selectedPrograms)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M1.5 4.5L8 9l6.5-4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
              Message Overdue Contacts ({formatDollars(selectedOverdueCount)} outstanding)
            </button>
          )}
          <button className="bulk-action-clear" onClick={() => setSelectedIds(new Set())}>Clear</button>
        </div>
      )}

      {filteredPrograms.length > 0 ? (
        <div className="table-scroll-container">
          <div className="programs-table" style={{ minWidth: showFinancials ? '1200px' : '1100px' }}>
            {/* Header */}
            <div className="table-row table-header">
              {selectable && (
                <div className="table-cell cell-checkbox">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all programs" />
                </div>
              )}
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

            {/* Rows */}
            {filteredPrograms.map((program) => {
              const isSelected = selectedIds.has(program.id);
              return (
                <div
                  key={program.id}
                  className={`table-row table-data${isSelected ? ' table-row--selected' : ''}`}
                  onClick={() => onProgramClick?.(program)}
                  role={onProgramClick ? 'button' : undefined}
                  tabIndex={onProgramClick ? 0 : undefined}
                  onKeyDown={(e) => { if (onProgramClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onProgramClick(program); } }}
                >
                  {selectable && (
                    <div className="table-cell cell-checkbox" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(program.id)}
                        aria-label={`Select ${program.title}`}
                      />
                    </div>
                  )}
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
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState variant={getEmptyStateVariant()} searchQuery={searchQuery} />
      )}
    </div>
  );
}
