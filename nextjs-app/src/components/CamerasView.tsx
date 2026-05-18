'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PageHeader from './PageHeader';
import Button from './Button';
import './components.css';

// Types
interface Organization {
  id: string;
  name: string;
  abbrev: string;
  type: string;
  sport: string;
  teamCount: number;
  color: string;
  teams?: string[];
  avatar?: string;
}

interface CameraAccess {
  id: string;
  organization: Organization;
  fromDate: string;
  toDate: string;
  teams: string[];
  recordingWindows: { day: string; from: string; to: string }[];
}

interface Camera {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor';
  facility: string;
  venue: string;
  status: 'online' | 'offline';
  image: string;
  accessGrants: CameraAccess[];
}

// Mock data
const MOCK_CAMERAS: Camera[] = [
  {
    id: 'camera-1',
    name: 'Focus Outdoor',
    type: 'outdoor',
    facility: 'Memorial Stadium',
    venue: 'Memorial Stadium',
    status: 'online',
    image: '/images/focus-outdoor.png',
    accessGrants: [],
  },
  {
    id: 'camera-2',
    name: 'Focus Indoor',
    type: 'indoor',
    facility: 'Main Gym',
    venue: 'Main Gym',
    status: 'online',
    image: '/images/focus-indoor.jpg',
    accessGrants: [],
  },
  {
    id: 'camera-3',
    name: 'Focus Outdoor',
    type: 'outdoor',
    facility: 'Soccer Complex',
    venue: 'Soccer Complex',
    status: 'online',
    image: '/images/focus-outdoor.png',
    accessGrants: [],
  },
  {
    id: 'camera-4',
    name: 'Focus Outdoor',
    type: 'outdoor',
    facility: 'Tennis Courts',
    venue: 'Tennis Courts',
    status: 'offline',
    image: '/images/focus-outdoor.png',
    accessGrants: [],
  },
];

// Group cameras by facility
const FACILITIES = ['Memorial Stadium', 'Main Gym', 'Soccer Complex', 'Tennis Courts'];
const getCamerasByFacility = () => {
  return FACILITIES.map(facility => ({
    facility,
    cameras: MOCK_CAMERAS.filter(c => c.facility === facility),
  })).filter(g => g.cameras.length > 0);
};

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-nwjf',
    name: 'Northwest Junior Football',
    abbrev: 'NJF',
    type: 'Youth',
    sport: 'American football',
    teamCount: 22,
    color: '#16a34a',
    avatar: '/images/maria-avatar.png',
    teams: [
      '7th Grade Tackle', '6th Grade Tackle', '5th Grade Tackle', '4th Grade Tackle', '3rd Grade Tackle', '2nd Grade Tackle', '1st Grade Tackle',
      '7th Grade Flag', '6th Grade Flag', '5th Grade Flag', '4th Grade Flag', '3rd Grade Flag', '2nd Grade Flag', '1st Grade Flag',
      '7th Grade Flag (Girls)', '6th Grade Flag (Girls)', '5th Grade Flag (Girls)', '4th Grade Flag (Girls)', '3rd Grade Flag (Girls)', '2nd Grade Flag (Girls)', '1st Grade Flag (Girls)',
      '7v7 Select'
    ],
  },
  {
    id: 'org-wyfc',
    name: 'Westside Youth Football Club',
    abbrev: 'WYF',
    type: 'Youth',
    sport: 'American football',
    teamCount: 8,
    color: '#991b1b',
    teams: ['U14 Football', 'U12 Football', 'U10 Football', 'U14 Flag (Girls)', 'U12 Flag (Girls)', 'Westside HS Varsity', 'JV Football', 'Freshman'],
  },
  {
    id: 'org-lincoln',
    name: 'Lincoln Youth Soccer',
    abbrev: 'LYS',
    type: 'Youth',
    sport: 'Soccer',
    teamCount: 12,
    color: '#16a34a',
    teams: ['U14 Boys', 'U14 Girls', 'U12 Boys', 'U12 Girls', 'U10 Boys', 'U10 Girls'],
  },
];

interface CamerasViewProps {
  venueName?: string;
}

type ViewState = 'list' | 'detail';
type GrantStep = 'search' | 'configure';

export default function CamerasView({ venueName = 'Northwest High School' }: CamerasViewProps) {
  const [cameras, setCameras] = useState<Camera[]>(MOCK_CAMERAS);
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grant access modal state
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantStep, setGrantStep] = useState<GrantStep>('search');
  const [accessFromDate, setAccessFromDate] = useState('2026-08-15');
  const [accessToDate, setAccessToDate] = useState('2026-11-21');
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [recordingWindows, setRecordingWindows] = useState<{ day: string; from: string; to: string }[]>([]);

  const handleManageCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setViewState('detail');
  };

  const handleBack = () => {
    setViewState('list');
    setSelectedCamera(null);
  };

  const handleGrantAccess = () => {
    setSearchQuery('');
    setSelectedOrg(null);
    setGrantStep('search');
    setShowGrantModal(true);
  };

  const handleCloseGrantModal = () => {
    setShowGrantModal(false);
    setSelectedOrg(null);
    setSearchQuery('');
    setGrantStep('search');
    setRecordingWindows([]);
  };

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setSelectedTeams(new Set(org.teams || []));
    setGrantStep('configure');
  };

  const handleBackToSearch = () => {
    setSelectedOrg(null);
    setGrantStep('search');
  };

  const handleConfirmGrant = () => {
    if (!selectedCamera || !selectedOrg) return;
    
    const newAccess: CameraAccess = {
      id: `access-${Date.now()}`,
      organization: selectedOrg,
      fromDate: accessFromDate,
      toDate: accessToDate,
      teams: Array.from(selectedTeams),
      recordingWindows,
    };

    setCameras(prev => prev.map(c => 
      c.id === selectedCamera.id 
        ? { ...c, accessGrants: [...c.accessGrants, newAccess] }
        : c
    ));
    setSelectedCamera(prev => prev ? { ...prev, accessGrants: [...prev.accessGrants, newAccess] } : null);
    handleCloseGrantModal();
  };

  const filteredOrgs = MOCK_ORGANIZATIONS.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.abbrev.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTeam = (team: string) => {
    setSelectedTeams(prev => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });
  };

  // Camera List View
  if (viewState === 'list') {
    const camerasByFacility = getCamerasByFacility();
    
    return (
      <div className="cameras-page-content">
        <PageHeader 
          title="Cameras" 
          description={`Manage who can record at ${venueName}. Approve a club or visiting team once and they'll have ongoing access to your camera.`}
        />

        <div className="cameras-facility-list">
          {camerasByFacility.map(group => (
            <div key={group.facility} className="cameras-facility-group">
              <h2 className="cameras-facility-title">{group.facility}</h2>
              <div className="cameras-list">
                {group.cameras.map(camera => (
                  <div key={camera.id} className="camera-card">
                    <div className="camera-card-image">
                      <Image src={camera.image} alt={camera.name} width={120} height={80} style={{ objectFit: 'contain', background: '#fff' }} />
                    </div>
                    <div className="camera-card-info">
                      <h3 className="camera-card-name">{camera.name}</h3>
                    </div>
                    <button className="camera-card-manage" onClick={() => handleManageCamera(camera)}>
                      Manage
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Camera Detail View
  if (viewState === 'detail' && selectedCamera) {
    return (
      <div className="cameras-page-content">
        <PageHeader 
          title={selectedCamera.name}
          breadcrumb={[
            { label: 'Cameras', onClick: handleBack },
            { label: selectedCamera.facility },
          ]}
        />

        <div className="camera-detail-card">
          <div className="camera-detail-image">
            <Image src={selectedCamera.image} alt={selectedCamera.name} width={80} height={60} style={{ objectFit: 'contain' }} />
          </div>
          <div className="camera-detail-info">
            <h2 className="camera-detail-name">{selectedCamera.name}</h2>
            <div className="camera-detail-meta">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 13c3-3 5-5.5 5-7.5a5 5 0 10-10 0c0 2 2 4.5 5 7.5z" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedCamera.facility}
              <span className={`camera-status-badge camera-status-badge--${selectedCamera.status}`}>
                {selectedCamera.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="camera-detail-actions">
            <button className="camera-action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              Show QR code
            </button>
            <button className="camera-action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Recording history
            </button>
          </div>
        </div>

        <div className="camera-access-section">
          <div className="camera-access-header">
            <div className="camera-access-title">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zM3.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              ORGANIZATIONS WITH ACCESS
              <span className="camera-access-count">{selectedCamera.accessGrants.length} organizations</span>
            </div>
            <button className="camera-grant-btn" onClick={handleGrantAccess}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12 14h-1.5M14 12.5V14M3.5 14c0-2.485 2.015-4.5 4.5-4.5 .83 0 1.61.225 2.28.617" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Grant access
            </button>
          </div>

          {selectedCamera.accessGrants.length === 0 ? (
            <div className="camera-access-empty">
              <div className="camera-access-empty-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 16a6 6 0 100-12 6 6 0 000 12zM7 28c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className="camera-access-empty-title">No organizations have camera access</h3>
              <p className="camera-access-empty-desc">Grant access to a club or visiting team so they can record games at your venue.</p>
            </div>
          ) : (
            <div className="camera-access-list">
              {selectedCamera.accessGrants.map(grant => (
                <div key={grant.id} className="camera-access-item">
                  {grant.organization.avatar ? (
                    <div className="camera-access-org-avatar">
                      <Image src={grant.organization.avatar} alt={grant.organization.name} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="camera-access-org-logo" style={{ backgroundColor: grant.organization.color }}>
                      {grant.organization.abbrev}
                    </div>
                  )}
                  <div className="camera-access-org-info">
                    <div className="camera-access-org-name">{grant.organization.name}</div>
                    <div className="camera-access-org-meta">
                      {grant.organization.type} · {grant.organization.sport} · {grant.teams.length} teams
                    </div>
                    <div className="camera-access-dates">
                      Access: {new Date(grant.fromDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(grant.toDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <button className="camera-access-edit">Edit</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grant Access Side Panel */}
        {showGrantModal && (
          <>
            <div className="import-panel-backdrop" onClick={handleCloseGrantModal} />
            <div className="import-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="import-panel-header">
                <h2 className="import-panel-title">
                  {grantStep === 'search' ? 'Grant Camera Access' : `Grant Access to ${selectedOrg?.name}`}
                </h2>
                <button className="import-panel-close" onClick={handleCloseGrantModal} aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>

              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px' }}>
                {grantStep === 'search' && (
                  <div className="grant-panel-content">
                    <div className="camera-search-box">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <input
                        type="text"
                        className="camera-search-input"
                        placeholder="Search for an organization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>

                    {searchQuery && (
                      <>
                        <div className="camera-search-results-label">{filteredOrgs.length} RESULT{filteredOrgs.length !== 1 ? 'S' : ''}</div>
                        
                        <div className="camera-search-results">
                          {filteredOrgs.map(org => (
                            <button key={org.id} className="camera-org-result" onClick={() => handleSelectOrg(org)}>
                              {org.avatar ? (
                                <div className="camera-org-avatar">
                                  <Image src={org.avatar} alt={org.name} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                                </div>
                              ) : (
                                <div className="camera-org-logo" style={{ backgroundColor: org.color }}>
                                  {org.abbrev}
                                </div>
                              )}
                              <div className="camera-org-info">
                                <div className="camera-org-name">{org.name}</div>
                                <div className="camera-org-meta">
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M5 3V2a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1"/></svg>
                                  {org.type} · {org.sport} · {org.teamCount} teams
                                </div>
                              </div>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="camera-search-help">
                      <div className="camera-search-help-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M3 8h14M7 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      </div>
                      <div className="camera-search-help-content">
                        <h4 className="camera-search-help-title">Don&apos;t see the org you&apos;re looking for?</h4>
                        <p className="camera-search-help-desc">Send an invite by email. They&apos;ll choose which orgs and teams to apply this access to, and you&apos;ll give the final approval.</p>
                        <button className="camera-invite-btn">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          Invite by email
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {grantStep === 'configure' && selectedOrg && selectedCamera && (
                  <div className="grant-panel-content">
                    <div className="camera-grant-form">
                      {/* Organization */}
                      <div className="camera-grant-section">
                        <div className="camera-grant-label">ORGANIZATION</div>
                        <div className="camera-grant-org">
                          {selectedOrg.avatar ? (
                            <div className="camera-org-avatar">
                              <Image src={selectedOrg.avatar} alt={selectedOrg.name} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div className="camera-org-logo" style={{ backgroundColor: selectedOrg.color }}>
                              {selectedOrg.abbrev}
                            </div>
                          )}
                          <div className="camera-org-info">
                            <div className="camera-org-name">{selectedOrg.name}</div>
                            <div className="camera-org-meta">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M5 3V2a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1"/></svg>
                              {selectedOrg.type} · {selectedOrg.sport}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Camera */}
                      <div className="camera-grant-section">
                        <div className="camera-grant-label">CAMERA</div>
                        <div className="camera-grant-camera">
                          <div className="camera-grant-camera-image">
                            <Image src={selectedCamera.image} alt={selectedCamera.name} width={48} height={36} style={{ objectFit: 'contain' }} />
                          </div>
                          <div className="camera-grant-camera-info">
                            <div className="camera-grant-camera-name">{selectedCamera.name}</div>
                            <div className="camera-grant-camera-location">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1"/><path d="M6 11c2.5-2.5 4-4.5 4-6a4 4 0 10-8 0c0 1.5 1.5 3.5 4 6z" stroke="currentColor" strokeWidth="1"/></svg>
                              {selectedCamera.facility}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Teams */}
                      <div className="camera-grant-section">
                        <div className="camera-grant-section-header">
                          <div className="camera-grant-label">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 12.5c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                            TEAMS · ALL {selectedOrg.teams?.length || 0}
                          </div>
                          <button className="camera-grant-edit-link">Edit teams</button>
                        </div>
                        <div className="camera-grant-teams">
                          {(selectedOrg.teams?.slice(0, 6) || []).map(team => (
                            <span 
                              key={team} 
                              className={`camera-grant-team-chip ${selectedTeams.has(team) ? 'camera-grant-team-chip--selected' : ''}`}
                              onClick={() => toggleTeam(team)}
                            >
                              {team}
                            </span>
                          ))}
                          {((selectedOrg.teams?.length || 0) - 6) > 0 && (
                            <span className="camera-grant-team-chip camera-grant-team-chip--more">+ {(selectedOrg.teams?.length || 0) - 6} more</span>
                          )}
                        </div>
                      </div>

                      {/* Access Window */}
                      <div className="camera-grant-section">
                        <div className="camera-grant-label">ACCESS WINDOW</div>
                        <div className="camera-grant-suggestion">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          {selectedOrg.name}&apos;s schedule suggests <strong>Aug 14 - Nov 20, 2026</strong>.
                        </div>
                        <div className="camera-grant-dates">
                          <div className="camera-grant-date-field">
                            <label>From</label>
                            <div className="camera-grant-date-input">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5.5h11M4.5 1v2M9.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                              <input type="date" value={accessFromDate} onChange={(e) => setAccessFromDate(e.target.value)} />
                            </div>
                          </div>
                          <div className="camera-grant-date-field">
                            <label>To</label>
                            <div className="camera-grant-date-input">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5.5h11M4.5 1v2M9.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                              <input type="date" value={accessToDate} onChange={(e) => setAccessToDate(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {grantStep === 'configure' && (
                <div className="import-panel-footer">
                  <Button buttonStyle="standard" buttonType="secondary" onClick={handleBackToSearch}>
                    Back
                  </Button>
                  <Button buttonStyle="standard" buttonType="primary" onClick={handleConfirmGrant}>
                    Grant access
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
