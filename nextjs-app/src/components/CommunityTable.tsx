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

// Name generation data
const firstNames = ['James', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Raymond', 'Gregory', 'Frank', 'Alexander', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen', 'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Catherine', 'Maria', 'Heather'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
const roles = ['Parent/Guardian', 'Parent/Guardian', 'Parent/Guardian', 'Parent/Guardian', 'Parent/Guardian', 'Parent/Guardian', 'Coach', 'Coach', 'Assistant Coach', 'Team Manager', 'Volunteer', 'Administrator', 'Athlete'];
const alexTeams = ['Varsity Football', 'JV Football', 'Freshman Football'];
const mariaTeams = ['Mustangs 14U', 'Mustangs 12U', 'Mustangs 10U', 'Mustangs 8U', 'Flag 6U', 'Flag 8U', 'Cheer Squad', 'Mini Cheer'];
const statuses: ('active' | 'pending' | 'inactive')[] = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'pending', 'inactive'];

function generateMembers(count: number, teams: string[], emailDomain: string): CommunityMember[] {
  const members: CommunityMember[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const memberTeams = role === 'Athlete' || role === 'Parent/Guardian' || role === 'Coach' || role === 'Assistant Coach'
      ? [teams[Math.floor(Math.random() * teams.length)]]
      : role === 'Administrator'
        ? teams.slice(0, Math.min(3, teams.length))
        : [teams[Math.floor(Math.random() * teams.length)]];
    
    members.push({
      id: `member-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${emailDomain}`,
      role,
      teams: memberTeams,
      status,
    });
  }
  return members;
}

// Generate 520 members for Alex (High School) and 540 for Maria (Youth)
const alexCommunityData = generateMembers(520, alexTeams, 'northwesths.edu');
const mariaCommunityData = generateMembers(540, mariaTeams, 'northwestyouthfootball.org');

// Add some specific notable members at the top
alexCommunityData.unshift(
  { id: 'alex-admin-1', name: 'David Mitchell', email: 'david.mitchell@northwesths.edu', role: 'Administrator', teams: ['Varsity Football', 'JV Football', 'Freshman Football'], status: 'active' },
  { id: 'alex-coach-1', name: 'Marcus Thompson', email: 'marcus.thompson@northwesths.edu', role: 'Head Coach', teams: ['Varsity Football'], status: 'active' },
  { id: 'alex-coach-2', name: 'Derek Williams', email: 'derek.williams@northwesths.edu', role: 'Coach', teams: ['JV Football'], status: 'active' },
  { id: 'alex-coach-3', name: 'Tony Rodriguez', email: 'tony.rodriguez@northwesths.edu', role: 'Coach', teams: ['Freshman Football'], status: 'active' },
);

mariaCommunityData.unshift(
  { id: 'maria-admin-1', name: 'Jeff Rodriguez', email: 'jeff.rodriguez@northwestyouthfootball.org', role: 'Administrator', teams: ['Mustangs 14U', 'Mustangs 12U', 'Mustangs 10U'], status: 'active' },
  { id: 'maria-admin-2', name: 'Carlos Mendez', email: 'carlos.mendez@northwestyouthfootball.org', role: 'Administrator', teams: ['Mustangs 8U', 'Flag 6U', 'Flag 8U'], status: 'active' },
  { id: 'maria-coach-1', name: 'Robert Jackson', email: 'robert.jackson@northwestyouthfootball.org', role: 'Head Coach', teams: ['Mustangs 14U'], status: 'active' },
  { id: 'maria-coach-2', name: 'Steve Patterson', email: 'steve.patterson@northwestyouthfootball.org', role: 'Head Coach', teams: ['Mustangs 12U'], status: 'active' },
  { id: 'maria-cheer-1', name: 'Lisa Anderson', email: 'lisa.anderson@northwestyouthfootball.org', role: 'Head Coach', teams: ['Cheer Squad'], status: 'active' },
);

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

interface TableContentProps {
  members: CommunityMember[];
  selectedIds: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
}

function TableContent({ members, selectedIds, allSelected, someSelected, onToggleAll, onToggleOne }: TableContentProps) {
  return (
    <div className="community-table">
      <div className="table-row table-header">
        <div className="table-cell cell-checkbox">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => { if (input) input.indeterminate = !allSelected && someSelected; }}
            onChange={onToggleAll}
            aria-label="Select all members"
          />
        </div>
        <div className="table-cell cell-name"><span className="header-label">Name</span></div>
        <div className="table-cell cell-email"><span className="header-label">Email</span></div>
        <div className="table-cell cell-role"><span className="header-label">Role</span></div>
        <div className="table-cell cell-teams"><span className="header-label">Teams</span></div>
        <div className="table-cell cell-status"><span className="header-label">Status</span></div>
        <div className="table-cell cell-actions" />
      </div>
      {members.map((member) => (
        <div key={member.id} className={`table-row table-data ${selectedIds.has(member.id) ? 'table-row--selected' : ''}`}>
          <div className="table-cell cell-checkbox">
            <input
              type="checkbox"
              checked={selectedIds.has(member.id)}
              onChange={() => onToggleOne(member.id)}
              aria-label={`Select ${member.name}`}
            />
          </div>
          <div className="table-cell cell-name"><MemberAvatar name={member.name} /></div>
          <div className="table-cell cell-email"><span className="cell-email-text">{member.email}</span></div>
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
        <span className="community-sent-empty-desc">When you send messages or notifications, they will appear here.</span>
      </div>
    );
  }

  return (
    <div className="community-sent-list">
      {[...notifications].reverse().map(notif => {
        const channelLabels: string[] = [];
        if (notif.channels.email) channelLabels.push('Email');
        if (notif.channels.sms) channelLabels.push('SMS');
        if (notif.channels.push) channelLabels.push('Push');

        const isProgramMessage = notif.type === 'program-message';

        const recipientLabels: string[] = [];
        if (!isProgramMessage) {
          if (notif.recipients.coaches) recipientLabels.push('Coaches');
          if (notif.recipients.parents) recipientLabels.push('Parents & guardians');
          if (notif.recipients.fans) recipientLabels.push('Ticket holders');
        }

        return (
          <div key={notif.id} className="community-sent-card">
            <div className="community-sent-card-header">
              <div className="community-sent-card-title">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2.667L7.333 9.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2.667l-4.667 13.333-2.666-6-6-2.667L14 2.667z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {isProgramMessage ? (notif.subject || 'Program Message') : 'Facility Closure Notification'}
              </div>
              <span className="community-sent-card-date">{formatDate(notif.sentAt)}</span>
            </div>
            <div className="community-sent-card-body">
              <div className="community-sent-card-row">
                <span className="community-sent-card-label">Sent by</span>
                <span className="community-sent-card-value">{notif.sentBy}</span>
              </div>
              {isProgramMessage && notif.programTitle && (
                <div className="community-sent-card-row">
                  <span className="community-sent-card-label">{notif.programTitle.includes(',') ? 'Programs' : 'Program'}</span>
                  <span className="community-sent-card-value">{notif.programTitle}</span>
                </div>
              )}
              {!isProgramMessage && (
                <>
                  <div className="community-sent-card-row">
                    <span className="community-sent-card-label">Facilities</span>
                    <span className="community-sent-card-value">{notif.facilities.join(', ')}</span>
                  </div>
                  <div className="community-sent-card-row">
                    <span className="community-sent-card-label">Events canceled</span>
                    <span className="community-sent-card-value">{notif.events.length}</span>
                  </div>
                </>
              )}
              <div className="community-sent-card-row">
                <span className="community-sent-card-label">Recipients</span>
                <span className="community-sent-card-value">
                  {isProgramMessage
                    ? `${notif.recipientCount} families`
                    : `${recipientLabels.join(', ')} (${notif.recipientCount} people)`
                  }
                </span>
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
  personaId?: 'alex' | 'maria';
  onContactMembers?: (members: { name: string; email: string }[]) => void;
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1 5l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function CommunityTable({ sentNotifications = [], personaId = 'alex', onContactMembers }: CommunityTableProps) {
  const mockCommunityData = personaId === 'maria' ? mariaCommunityData : alexCommunityData;
  const [activeTab, setActiveTab] = useState<CommunityTab>('directory');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Selection logic
  const allFilteredSelected = filteredMembers.length > 0 && filteredMembers.every(m => selectedIds.has(m.id));
  const someSelected = filteredMembers.some(m => selectedIds.has(m.id));
  
  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map(m => m.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleContactClick = () => {
    const selectedMembers = mockCommunityData.filter(m => selectedIds.has(m.id));
    onContactMembers?.(selectedMembers.map(m => ({ name: m.name, email: m.email })));
  };

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
          
          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="bulk-action-bar">
              <span className="bulk-action-count">{selectedIds.size} selected</span>
              <button className="bulk-action-btn" onClick={handleContactClick}>
                <MailIcon />
                Contact Members
              </button>
              <button className="bulk-action-clear" onClick={() => setSelectedIds(new Set())}>Clear</button>
            </div>
          )}
          
          <div className="table-scroll-container">
            <TableContent 
              members={filteredMembers}
              selectedIds={selectedIds}
              allSelected={allFilteredSelected}
              someSelected={someSelected}
              onToggleAll={toggleAll}
              onToggleOne={toggleOne}
            />
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
