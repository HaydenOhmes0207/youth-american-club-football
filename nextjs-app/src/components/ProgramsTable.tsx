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

function formatVisibility(visibility: string): string { return visibility === 'public' ? 'Public' : 'Private'; }
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
  const isPositive = type === 'visibility' ? status === 'public' : status === 'open';
  const label = type === 'visibility' ? formatVisibility(status) : formatRegistrationStatus(status);
  return <span className={`status-badge ${isPositive ? 'positive' : 'neutral'}`}>{label}</span>;
}

function CreatorAvatar({ creator }: { creator: ProgramWithStats['createdBy'] }) {
  if (!creator) return <span className="no-creator">{'\u2014'}</span>;
  const initials = `${creator.firstName.charAt(0)}${creator.lastName.charAt(0)}`;
  const fullName = `${creator.firstName} ${creator.lastName}`;
  return (
    <div className="creator-info">
      {creator.avatar ? (
        <img src={creator.avatar} alt={fullName} className="creator-avatar" crossOrigin="anonymous" />
      ) : (
        <div className="creator-avatar-placeholder">{initials}</div>
      )}
      <span className="creator-name">{fullName}</span>
    </div>
  );
}

function TableContent({ programs }: { programs: ProgramWithStats[] }) {
  return (
    <div className="programs-table">
      <div className="table-row table-header">
        <div className="table-cell cell-title"><span className="header-label">Title</span></div>
        <div className="table-cell cell-registration"><span className="header-label">Registration</span></div>
        <div className="table-cell cell-visibility"><span className="header-label">Visibility</span></div>
        <div className="table-cell cell-type"><span className="header-label">Type</span></div>
        <div className="table-cell cell-dates"><span className="header-label">Event Dates</span></div>
        <div className="table-cell cell-created-by"><span className="header-label">Created By</span></div>
        <div className="table-cell cell-registrants align-right"><span className="header-label">Registrants</span></div>
        <div className="table-cell cell-value align-right"><span className="header-label">Program Value</span></div>
        <div className="table-cell cell-actions" />
      </div>
      {programs.map((program) => (
        <div key={program.id} className="table-row table-data">
          <div className="table-cell cell-title emphasized">{program.title}</div>
          <div className="table-cell cell-registration"><StatusBadge status={program.registrationStatus} type="registration" /></div>
          <div className="table-cell cell-visibility"><StatusBadge status={program.visibility} type="visibility" /></div>
          <div className="table-cell cell-type">{formatProgramType(program.type)}</div>
          <div className="table-cell cell-dates">{formatDateRange(program.eventDates)}</div>
          <div className="table-cell cell-created-by"><CreatorAvatar creator={program.createdBy} /></div>
          <div className="table-cell cell-registrants align-right">{program.registrantCount}</div>
          <div className="table-cell cell-value align-right">{formatCurrency(program.programValue)}</div>
          <div className="table-cell cell-actions"><button className="more-options-btn" aria-label="More options"><MoreOptionsIcon /></button></div>
        </div>
      ))}
    </div>
  );
}

export default function ProgramsTable({ programs }: { programs: ProgramWithStats[] }) {
  const [statusFilter, setStatusFilter] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');

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
        return program.title.toLowerCase().includes(query) || program.type.toLowerCase().includes(query) || program.visibility.toLowerCase().includes(query);
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
        <div className="table-scroll-container"><TableContent programs={filteredPrograms} /></div>
      ) : (
        <EmptyState variant={getEmptyStateVariant()} searchQuery={searchQuery} />
      )}
    </div>
  );
}
