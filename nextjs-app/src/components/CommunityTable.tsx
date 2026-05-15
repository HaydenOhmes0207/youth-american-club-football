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
  return <span className={`status-badge ${config.className}`}>{config.label}</span>;
}

function MemberAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="member-info">
      <div className="member-avatar">{initials}</div>
      <span className="member-name">{name}</span>
    </div>
  );
}

function TableContent({ members }: { members: CommunityMember[] }) {
  return (
    <div className="community-table">
      <div className="table-row table-header">
        <div className="table-cell cell-name"><span className="header-label">Name</span></div>
        <div className="table-cell cell-email"><span className="header-label">Email</span></div>
        <div className="table-cell cell-role"><span className="header-label">Role</span></div>
        <div className="table-cell cell-teams"><span className="header-label">Teams</span></div>
        <div className="table-cell cell-status"><span className="header-label">Status</span></div>
        <div className="table-cell cell-actions" />
      </div>
      {members.map((member) => (
        <div key={member.id} className="table-row table-data">
          <div className="table-cell cell-name"><MemberAvatar name={member.name} /></div>
          <div className="table-cell cell-email">{member.email}</div>
          <div className="table-cell cell-role">{member.role}</div>
          <div className="table-cell cell-teams">{member.teams.join(', ')}</div>
          <div className="table-cell cell-status"><StatusBadge status={member.status} /></div>
          <div className="table-cell cell-actions">
            <button className="more-options-btn" aria-label="More options"><MoreOptionsIcon /></button>
          </div>
        </div>
      ))}
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
      return member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query) || member.role.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="community-content">
      <Toolbar 
        segments={segments}
        searchPlaceholder="Search members..."
        onSearch={(query) => setSearchQuery(query)}
        onFilter={() => {}}
        onExport={() => {}}
      />
      <div className="table-scroll-container">
        <TableContent members={filteredMembers} />
      </div>
    </div>
  );
}
