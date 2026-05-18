'use client';

import React, { useState } from 'react';
import SubNavItem from './SubNavigation';
import './LegacyNavigation.css';

// Icon paths for public folder
const HomeIcon = '/icons/home.svg';
const ProgramsIcon = '/icons/programs.svg';
const TicketsIcon = '/icons/tickets.svg';
const FinancesIcon = '/icons/finances.svg';
const TeamsIcon = '/icons/teams.svg';
const CommunityIcon = '/icons/community.svg';
const SettingsIcon = '/icons/settings.svg';
const CalendarIcon = '/icons/calendar.svg';
const MessagesIcon = '/icons/messages.svg';
const NotificationsIcon = '/icons/notifications.svg';
const ExpandCollapseIcon = '/icons/expand-collapse.svg';
const ExpandDownIcon = '/icons/expand-down.svg';
const HudlLogoIcon = '/icons/hudl-logo.svg';
const PersonalWorkspaceAvatar = '/icons/personal-workspace-avatar.png';
const PlaceholderIcon = '/icons/placeholder.svg';
const FacilitiesIcon = '/icons/facilities.svg';

interface NavChild {
  id: string;
  label: string;
  hasPill?: boolean;
  pillText?: string;
  route?: string | null;
}

interface NavItem {
  id: string;
  icon: string;
  label: string;
  hasPill?: boolean;
  pillText?: string;
  route?: string | null;
  children?: NavChild[];
}

interface Workspace {
  id: string;
  name: string;
  role?: string;
  type?: string;
  avatar?: string;
  position?: string;
  subscriptionType?: string;
  sport?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

interface UserMenuItem {
  id?: string;
  label?: string;
  type?: 'separator';
}

interface OrganizationData {
  id: string;
  name: string;
  primary_sport: string | null;
  avatar: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface TeamData {
  id: string;
  title: string;
  sport: string | null;
  gender: string | null;
  avatar: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface NavItemChildData {
  id: string;
  label: string;
  route: string | null;
}

interface NavItemData {
  id: string;
  label: string;
  icon: string;
  route: string | null;
  children: NavItemChildData[];
}

interface CurrentUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LegacyNavigationProps {
  organization?: OrganizationData | null;
  teams?: TeamData[];
  navItems?: NavItemData[];
  currentUser?: CurrentUserData | null;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
}

function getInitials(name: string): string {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
}

function getPosition(index: number, total: number): string {
  if (total === 1) return 'Single';
  if (index === 0) return 'Top';
  if (index === total - 1) return 'Bottom';
  return 'Middle';
}

const iconMap: Record<string, string> = {
  programs: ProgramsIcon,
  teams: TeamsIcon,
  finances: FinancesIcon,
  community: CommunityIcon,
  settings: SettingsIcon,
  home: HomeIcon,
  tickets: TicketsIcon,
  calendar: CalendarIcon,
  messages: MessagesIcon,
  notifications: NotificationsIcon,
  placeholder: PlaceholderIcon,
  facilities: FacilitiesIcon,
};

const LegacyNavigation: React.FC<LegacyNavigationProps> = ({ 
  organization,
  teams = [],
  navItems = [],
  currentUser,
  activeRoute = '/',
  onNavigate,
  onLogout,
  children,
  overlay,
}) => {
  const userName = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}` 
    : 'John Smith';
  const userInitials = currentUser 
    ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}` 
    : 'JS';
  const [isExpanded, setIsExpanded] = useState(true);
  
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOrgPopoverOpen, setIsOrgPopoverOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const handleNavigate = (route: string | null | undefined) => {
    if (route && onNavigate) {
      onNavigate(route);
    }
  };

  const directorNavItems: NavItem[] = navItems.length > 0 
    ? navItems.map(item => ({
        id: item.label,
        icon: iconMap[item.icon] || PlaceholderIcon,
        label: item.label,
        route: item.route,
        children: item.children.length > 0 
          ? item.children.map(child => ({
              id: child.label,
              label: child.label,
              hasPill: false,
              pillText: '',
              route: child.route,
            }))
          : undefined,
      }))
    : [
        { id: 'Home', icon: HomeIcon, label: 'Home', route: '/' },
      ];

  const currentNavItems = directorNavItems;

  // Derive active from route
  const activeItem = (() => {
    const path = activeRoute || '/';
    const pathWithoutSlash = path === '/' ? '' : path.replace(/^\//, '');
    for (const item of currentNavItems) {
      const itemPath = (item.route || '').replace(/^\//, '');
      if (itemPath === pathWithoutSlash) return item.id;
      if (item.children) {
        for (const child of item.children) {
          const childPath = (child.route || '').replace(/^\//, '');
          if (childPath === pathWithoutSlash) return child.id;
        }
      }
    }
    return currentNavItems[0]?.id || 'Home';
  })();

  const bottomNavItems: NavItem[] = [
    { id: 'Messages', icon: MessagesIcon, label: 'Messages' },
    { id: 'Notifications', icon: NotificationsIcon, label: 'Notifications' },
  ];

  const parentOrg = { name: organization?.name || 'Organization' };

  const orgWorkspace: Workspace = {
    id: organization?.id || 'org',
    name: organization?.name || 'Organization',
    role: currentUser?.role || 'Director',
    type: 'organization',
    avatar: organization?.avatar || undefined,
    primaryColor: organization?.primary_color,
    secondaryColor: organization?.secondary_color,
  };

  const teamWorkspaces: Workspace[] = teams.map((team, index) => ({
    id: team.id,
    name: team.title,
    role: 'Team Admin',
    type: 'team',
    avatar: team.avatar || undefined,
    position: getPosition(index, teams.length),
    sport: team.sport,
    primaryColor: team.primary_color,
    secondaryColor: team.secondary_color,
  }));

  const personalWorkspace: Workspace = {
    id: 'personal',
    name: 'Your Hudl',
    subscriptionType: 'Personal',
    avatar: 'U'
  };

  const [selectedOrg, setSelectedOrg] = useState<Workspace>(orgWorkspace);

  const findParentGroupIdForItem = (itemId: string): string | null => {
    for (const item of currentNavItems) {
      if (Array.isArray(item.children) && item.children.length > 0) {
        if (item.id === itemId) return item.id;
        if (item.children.some(child => child.id === itemId)) return item.id;
      }
    }
    return null;
  };

  const userMenuItems: UserMenuItem[] = [
    { id: 'account-settings', label: 'Account Settings' },
    { id: 'livestream-purchases', label: 'Livestream Purchases' },
    { id: 'tickets-passes', label: 'Tickets & Passes' },
    { id: 'registrations-payments', label: 'Registrations & Payments' },
    { id: 'billing-orders', label: 'Billing & Orders' },
    { id: 'add-team', label: 'Add Another Team' },
    { type: 'separator' },
    { id: 'get-help', label: 'Get Help' },
    { id: 'logout', label: 'Log Out' }
  ];

  const renderAvatar = (workspace: Workspace, className: string) => {
    if (workspace.id === personalWorkspace.id) {
      return <div className={`${className} personal`}><img src={PersonalWorkspaceAvatar} alt={workspace.name} /></div>;
    }
    return (
      <div className={className}>
        {workspace.avatar ? (
          <img src={workspace.avatar} alt={workspace.name} />
        ) : (
          <span className={`${className}-initials`}>{getInitials(workspace.name)}</span>
        )}
      </div>
    );
  };

  return (
    <div 
      className="navigation-container"
      data-expanded={isExpanded ? 'true' : 'false'}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (isOrgPopoverOpen && !target.closest('.workspace-switcher') && !target.closest('.org-popover')) {
          setIsOrgPopoverOpen(false);
        }
        if (isUserMenuOpen && !target.closest('.user-settings') && !target.closest('.user-menu-popover')) {
          setIsUserMenuOpen(false);
        }
      }}
    >
      {/* Mobile Top Navigation */}
      <div className="mobile-top-nav">
        <button className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          <div className="mobile-menu-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </button>
        <div className="mobile-logo-container" onClick={() => handleNavigate('/')}>
          <div className="mobile-logo-icon"><img src={HudlLogoIcon} alt="Hudl" /></div>
          <div className="mobile-logo-text">Hudl</div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Mobile Menu Drawer */}
      <div className="mobile-menu-drawer" style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="mobile-logo-container" style={{ paddingRight: 0, justifyContent: 'center' }} onClick={() => { handleNavigate('/'); setIsMobileMenuOpen(false); }}>
            <div className="mobile-logo-icon"><img src={HudlLogoIcon} alt="Hudl" /></div>
            <div className="mobile-logo-text">Hudl</div>
          </div>
        </div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-items">
            {currentNavItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isGroupOpen = openGroups.includes(item.id);
              const isItemActive = activeItem === item.id;
              return (
                <React.Fragment key={item.id}>
                  <div className={`mobile-menu-item ${isItemActive ? 'active' : ''} ${hasChildren && isGroupOpen ? 'mobile-menu-item--open' : ''}`}>
                    <div className="mobile-menu-item-content" onClick={() => { handleNavigate(item.route); setOpenGroups([]); setIsMobileMenuOpen(false); }}>
                      <div className="mobile-menu-item-icon"><img src={item.icon} alt="" width="24" height="24" /></div>
                      <div className="mobile-menu-item-label">{item.label}</div>
                    </div>
                    {hasChildren && (
                      <button type="button" className="mobile-menu-item-chevron" onClick={(e) => { e.stopPropagation(); setOpenGroups(prev => prev.includes(item.id) ? [] : [item.id]); }} aria-label={`${isGroupOpen ? 'Collapse' : 'Expand'} ${item.label} menu`}>
                        <img src={ExpandDownIcon} alt="" width="16" height="16" style={{ transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                      </button>
                    )}
                  </div>
                  {hasChildren && isGroupOpen && (
                    <div className="mobile-menu-children">
                      {item.children!.map(child => (
                        <div key={child.id} className="mobile-menu-item-child">
                          <SubNavItem label={child.label} active={activeItem === child.id} hasPill={!!child.hasPill} pillText={child.pillText} onClick={() => { handleNavigate(child.route); setIsMobileMenuOpen(false); }} />
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="mobile-menu-bottom-section">
            <div className="mobile-menu-items">
              {bottomNavItems.map(item => (
                <div key={item.id} className={`mobile-menu-item ${activeItem === item.id ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="mobile-menu-item-icon"><img src={item.icon} alt="" width="24" height="24" /></div>
                  <div className="mobile-menu-item-label">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mobile-user-settings">
              <div className="mobile-user-avatar"><div className="mobile-user-avatar-text">{userInitials}</div></div>
              <div className="mobile-user-info"><div className="mobile-user-name">{userName}</div></div>
              <div className="mobile-user-arrow"><img src={ExpandDownIcon} alt="" width="16" height="16" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="nav-sidebar">
        <div className="nav-logo" onClick={() => handleNavigate('/')}>
          <div className="nav-logo-icon"><img src={HudlLogoIcon} alt="Hudl" /></div>
          <div className="nav-logo-text">Hudl</div>
        </div>

        <div className="workspace-switcher" onClick={() => setIsOrgPopoverOpen(!isOrgPopoverOpen)}>
          {renderAvatar(selectedOrg, 'workspace-avatar')}
          <div className="workspace-info">
            <div className="workspace-name">{selectedOrg.name}</div>
            <div className="workspace-label">{selectedOrg.id === personalWorkspace.id ? 'Personal' : parentOrg.name}</div>
          </div>
          <div className="workspace-arrow">
            <img src={ExpandDownIcon} alt="" width="16" height="16" style={{ transform: isOrgPopoverOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
          </div>
          {isOrgPopoverOpen && (
            <div className="org-popover" style={{ display: 'flex' }}>
              <p className="org-popover-header">{parentOrg.name}</p>
              <div className="org-popover-teams">
                <div className={`org-popover-item ${selectedOrg.id === orgWorkspace.id ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedOrg(orgWorkspace); setOpenGroups([]); setIsOrgPopoverOpen(false); handleNavigate('/'); }}>
                  <div className="org-popover-item-wrapper position-top">
                    {renderAvatar(orgWorkspace, 'org-popover-avatar')}
                    <div className="org-popover-line org-popover-line-below org-popover-line-top" />
                  </div>
                  <div className="org-popover-info">
                    <div className="org-popover-name">{orgWorkspace.name}</div>
                    <div className="org-popover-role">{orgWorkspace.role}</div>
                  </div>
                </div>
                {teamWorkspaces.map(workspace => (
                  <React.Fragment key={workspace.id}>
                    <div className={`org-popover-item ${selectedOrg.id === workspace.id ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedOrg(workspace); setOpenGroups([]); setIsOrgPopoverOpen(false); }}>
                      <div className={`org-popover-item-wrapper position-${workspace.position?.toLowerCase()}`}>
                        {workspace.position === 'Middle' && (
                          <>
                            <div className="org-popover-line org-popover-line-above" />
                            {renderAvatar(workspace, 'org-popover-avatar')}
                            <div className="org-popover-line org-popover-line-below" />
                          </>
                        )}
                        {workspace.position === 'Top' && (
                          <>
                            {renderAvatar(workspace, 'org-popover-avatar')}
                            <div className="org-popover-line org-popover-line-below org-popover-line-top" />
                          </>
                        )}
                        {workspace.position === 'Bottom' && (
                          <>
                            <div className="org-popover-line org-popover-line-above org-popover-line-bottom" />
                            {renderAvatar(workspace, 'org-popover-avatar')}
                          </>
                        )}
                      </div>
                      <div className="org-popover-info">
                        <div className="org-popover-name">{workspace.name}</div>
                        <div className="org-popover-role">{workspace.role}</div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="org-popover-separator-line" />
              <div className={`org-popover-item ${selectedOrg.id === personalWorkspace.id ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedOrg(personalWorkspace); setOpenGroups([]); setIsOrgPopoverOpen(false); }}>
                <div className="org-popover-item-wrapper">
                  {renderAvatar(personalWorkspace, 'org-popover-avatar')}
                </div>
                <div className="org-popover-info">
                  <div className="org-popover-name">{personalWorkspace.name}</div>
                  <div className="org-popover-role">{personalWorkspace.subscriptionType}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="nav-items-container">
          {currentNavItems.map(item => {
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const isGroupOpen = openGroups.includes(item.id);
            const isItemActive = activeItem === item.id;
            const hasActiveChild = hasChildren && item.children!.some(child => child.id === activeItem);
            const groupWrapperClass = hasChildren && isGroupOpen && isExpanded ? 'nav-group-open' : '';

            return (
              <div key={item.id} className={groupWrapperClass}>
                <div
                  className={`nav-item ${isItemActive ? 'active' : ''} ${hasChildren && isGroupOpen ? 'nav-item--open' : ''} ${hasChildren && !isGroupOpen && hasActiveChild ? 'nav-item--child-active' : ''}`}
                  onClick={() => {
                    const parentGroupId = findParentGroupIdForItem(item.id);
                    setOpenGroups(prev => {
                      if (!parentGroupId) return [];
                      return prev.includes(parentGroupId) ? [parentGroupId] : [];
                    });
                    handleNavigate(item.route);
                  }}
                >
                  <div className="nav-item-icon"><img src={item.icon} alt="" width="24" height="24" /></div>
                  <div className="nav-item-label">{item.label}</div>
                  {isExpanded && hasChildren && (
                    <button type="button" className="nav-item-chevron" onClick={(e) => { e.stopPropagation(); setOpenGroups(prev => prev.includes(item.id) ? [] : [item.id]); }}>
                      <img src={ExpandDownIcon} alt="" width="16" height="16" style={{ transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </button>
                  )}
                  {!isExpanded && <div className="nav-item-tooltip">{item.label}</div>}
                </div>
                {hasChildren && isGroupOpen && isExpanded && (
                  <div className="nav-item-children">
                    {item.children!.map(child => (
                      <div key={child.id} className="nav-item-child">
                        <SubNavItem label={child.label} active={activeItem === child.id} hasPill={!!child.hasPill} pillText={child.pillText} onClick={() => { const pid = findParentGroupIdForItem(child.id); setOpenGroups(prev => !pid ? [] : prev.includes(pid) ? [pid] : []); handleNavigate(child.route); }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="nav-bottom-items">
          {bottomNavItems.map(item => (
            <div key={item.id} className={`nav-item ${activeItem === item.id ? 'active' : ''}`}>
              <div className="nav-item-icon"><img src={item.icon} alt="" width="24" height="24" /></div>
              <div className="nav-item-label">{item.label}</div>
              {!isExpanded && <div className="nav-item-tooltip">{item.label}</div>}
            </div>
          ))}
        </div>

        <div className="user-settings" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
          <div className="user-avatar">{userInitials}</div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{currentUser?.role || 'Director'}</div>
          </div>
          <div className="user-arrow">
            <img src={ExpandDownIcon} alt="" width="16" height="16" style={{ transform: isUserMenuOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
          </div>
          {isUserMenuOpen && (
            <div className="user-menu-popover" style={{ display: 'flex' }}>
              {userMenuItems.map((item, index) => (
                item.type === 'separator' ? (
                  <div key={`separator-${index}`} className="user-menu-separator" />
                ) : (
                  <div 
                    key={item.id} 
                    className="user-menu-item" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setIsUserMenuOpen(false); 
                      if (item.id === 'logout' && onLogout) {
                        onLogout();
                      }
                    }}
                  >
                    {item.label}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {onLogout && (
          <button className="switch-persona-btn" onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L2 8M2 8L6 4M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="switch-persona-label">Switch Persona</span>
          </button>
        )}

        <button className="expand-collapse-button" onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}>
          <div className="expand-collapse-icon">
            <img src={ExpandCollapseIcon} alt="" width="16" height="16" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </div>
        </button>
      </div>

      <div className="main-content">
        <div className="content-inner">
          {children}
        </div>
      </div>
      {overlay}
    </div>
  );
};

export default LegacyNavigation;
