'use client';

import { useState } from 'react';
import Toolbar from './Toolbar';

interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: string;
  teams: string[];
  status: 'active' | 'pending' | 'inactive';
}

const mockCommunityData: CommunityMember[] = [
  {
    id: 'member-1',
    name: 'David Mitchell',
    email: 'david.mitchell@lincoln.edu',
    role: 'Administrator',
    teams: ['Lions Varsity', 'Lions JV'],
    status: 'active',
  },
];

function MoreOptionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="8" r="1.5" fill="var(--u-color-base-foreground, #36485c)" />
      <circle cx="8" cy="8" r="1.5" fill="var(--u-color-base-foreground, #36485c)" />
      <circle cx="13" cy="8" r="1.5" fill="var(--u-color-base-foreground, #36485c)" />
    </svg>
  );
}

function StatusBadge({ status }: { status: CommunityMember['status'] }) {
  const statusConfig = {
    active: { label: 'Active', className: 'positive' },
    pending: { label: 'Pending', className: 'warning' },
    inactive: { label: 'Inactive', className: 'neutral' },
  };

  const config = statusConfig[status];

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
      <style jsx>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--u-space-quarter, 4px) var(--u-space-half, 8px);
          border-radius: var(--u-border-radius-medium, 4px);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          font-weight: var(--u-font-weight-medium, 500);
          line-height: 1.4;
        }
        
        .positive {
          background: #E7F3FD;
          color: #085BB4;
        }

        .warning {
          background: #FEF3C7;
          color: #92400E;
        }
        
        .neutral {
          background: var(--u-color-background-default, #e8eaec);
          color: var(--u-color-base-foreground, #36485c);
        }
      `}</style>
    </span>
  );
}

function MemberAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="member-info">
      <div className="member-avatar">{initials}</div>
      <span className="member-name">{name}</span>
      <style jsx>{`
        .member-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .member-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--u-color-background-default, #e8eaec);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--u-color-base-foreground, #36485c);
          flex-shrink: 0;
        }
        .member-name {
          white-space: nowrap;
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
      `}</style>
    </div>
  );
}

function TableContent({ members }: { members: CommunityMember[] }) {
  return (
    <div className="community-table">
      {/* Header Row */}
      <div className="table-row table-header">
        <div className="table-cell cell-name">
          <span className="header-label">Name</span>
        </div>
        <div className="table-cell cell-email">
          <span className="header-label">Email</span>
        </div>
        <div className="table-cell cell-role">
          <span className="header-label">Role</span>
        </div>
        <div className="table-cell cell-teams">
          <span className="header-label">Teams</span>
        </div>
        <div className="table-cell cell-status">
          <span className="header-label">Status</span>
        </div>
        <div className="table-cell cell-actions">
          {/* Empty header for actions column */}
        </div>
      </div>

      {/* Data Rows */}
      {members.map((member) => (
        <div key={member.id} className="table-row table-data">
          <div className="table-cell cell-name">
            <MemberAvatar name={member.name} />
          </div>
          <div className="table-cell cell-email">
            {member.email}
          </div>
          <div className="table-cell cell-role">
            {member.role}
          </div>
          <div className="table-cell cell-teams">
            {member.teams.join(', ')}
          </div>
          <div className="table-cell cell-status">
            <StatusBadge status={member.status} />
          </div>
          <div className="table-cell cell-actions">
            <button className="more-options-btn" aria-label="More options">
              <MoreOptionsIcon />
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        .community-table {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 900px;
        }

        .table-row {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .table-header {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .table-data {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          height: 52px;
          box-sizing: border-box;
        }

        .table-data:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: pointer;
        }

        .table-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-quarter, 4px);
          padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-medium, 500);
          font-size: var(--u-font-size-200, 14px);
          line-height: 1.4;
          color: var(--u-color-base-foreground, #36485c);
        }

        .table-header .table-cell {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .cell-name {
          flex: 1;
          min-width: 180px;
        }

        .cell-email {
          width: 240px;
          flex-shrink: 0;
        }

        .cell-role {
          width: 140px;
          flex-shrink: 0;
        }

        .cell-teams {
          width: 200px;
          flex-shrink: 0;
        }

        .cell-status {
          width: 100px;
          flex-shrink: 0;
        }

        .cell-actions {
          width: 48px;
          flex-shrink: 0;
          justify-content: center;
        }

        .header-label {
          white-space: nowrap;
        }

        .more-options-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: var(--u-border-radius-medium, 4px);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .more-options-btn:hover {
          background: var(--u-color-background-default, #e8eaec);
        }
      `}</style>
    </div>
  );
}

export default function CommunityTable() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const segments = [
    {
      placeholder: 'Role',
      value: roleFilter,
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'administrator', label: 'Administrators' },
        { value: 'coach', label: 'Coaches' },
        { value: 'athlete', label: 'Athletes' },
      ],
      onChange: (value: string) => setRoleFilter(value),
    },
  ];

  const filteredMembers = mockCommunityData.filter(member => {
    if (roleFilter !== 'all' && member.role.toLowerCase() !== roleFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="community-content">
      <Toolbar 
        segments={segments}
        searchPlaceholder="Search members..."
        onSearch={(query) => setSearchQuery(query)}
        onFilter={() => console.log('Filter clicked')}
        onExport={() => console.log('Export clicked')}
      />
      
      <div className="table-scroll-container">
        <TableContent members={filteredMembers} />
      </div>

      <style jsx>{`
        .community-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          width: 100%;
        }

        .table-scroll-container {
          width: 100%;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
