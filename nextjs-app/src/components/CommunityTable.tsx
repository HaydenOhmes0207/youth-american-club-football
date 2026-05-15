'use client';

import { useState } from 'react';
import Toolbar from './Toolbar';
import type { SentNotification } from './NavigationWrapper';

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

// Tab types
type CommunityTab = 'directory' | 'inbox' | 'sent';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

function SentNotificationsView({ notifications }: { notifications: SentNotification[] }) {
  if (notifications.length === 0) {
    return (
      <div className="community-sent-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="community-sent-empty-text">No notifications sent yet</span>
        <span className="community-sent-empty-desc">When you send notifications from facility closures, they will appear here.</span>
      </div>
    );
  }

  return (
    <div className="community-sent-list">
      {notifications.map(notif => {
        const recipientLabels: string[] = [];
        if (notif.recipients.coaches) recipientLabels.push('Coaches');
        if (notif.recipients.parents) recipientLabels.push('Parents & guardians');
        if (notif.recipients.fans) recipientLabels.push('Ticket holders');

        const channelLabels: string[] = [];
        if (notif.channels.email) channelLabels.push('Email');
        if (notif.channels.sms) channelLabels.push('SMS');
        if (notif.channels.push) channelLabels.push('Push');

        return (
          <div key={notif.id} className="community-sent-card">
            <div className="community-sent-card-header">
              <div className="community-sent-card-title">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2.667L7.333 9.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2.667l-4.667 13.333-2.666-6-6-2.667L14 2.667z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Facility Closure Notification
              </div>
              <span className="community-sent-card-date">{formatDate(notif.sentAt)}</span>
            </div>
            <div className="community-sent-card-body">
              <div className="community-sent-card-row">
                <span className="community-sent-card-label">Facilities</span>
                <span className="community-sent-card-value">{notif.facilities.join(', ')}</span>
              </div>
              <div className="community-sent-card-row">
                <span className="community-sent-card-label">Events cancelled</span>
                <span className="community-sent-card-value">{notif.events.length}</span>
              </div>
              <div className="community-sent-card-row">
                <span className="community-sent-card-label">Recipients</span>
                <span className="community-sent-card-value">{recipientLabels.join(', ')} ({notif.recipientCount} people)</span>
              </div>
              <div className="community-sent-card-row">
                <span className="community-sent-card-label">Channels</span>
                <div className="community-sent-channels">
                  {channelLabels.map(ch => (
                    <span key={ch} className="community-sent-channel-badge">{ch}</span>
                  ))}
                </div>
              </div>
              <div className="community-sent-card-row community-sent-card-row--message">
                <span className="community-sent-card-label">Message</span>
                <span className="community-sent-card-message">{notif.message}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface CommunityTableProps {
  sentNotifications?: SentNotification[];
}

export default function CommunityTable({ sentNotifications = [] }: CommunityTableProps) {
  const [activeTab, setActiveTab] = useState<CommunityTab>('directory');
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

  const tabs: { id: CommunityTab; label: string; count?: number }[] = [
    { id: 'directory', label: 'Directory' },
    { id: 'inbox', label: 'Inbox' },
    { id: 'sent', label: 'Sent', count: sentNotifications.length > 0 ? sentNotifications.length : undefined },
  ];

  return (
    <div className="community-content">
      {/* Tab bar */}
      <div className="community-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`community-tab ${activeTab === tab.id ? 'community-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && <span className="community-tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'directory' && (
        <>
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
        </>
      )}

      {activeTab === 'inbox' && (
        <div className="community-sent-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="#9ca3af" strokeWidth="1.5"/><path d="M2 8l10 6 10-6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span className="community-sent-empty-text">No messages</span>
          <span className="community-sent-empty-desc">Your inbox is empty.</span>
        </div>
      )}

      {activeTab === 'sent' && (
        <SentNotificationsView notifications={sentNotifications} />
      )}
    </div>
  );
}
