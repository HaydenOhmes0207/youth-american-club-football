'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  {
    id: 'camera-5',
    name: 'Focus Indoor',
    type: 'indoor',
    facility: 'Weight Room',
    venue: 'Weight Room',
    status: 'online',
    image: '/images/focus-indoor.jpg',
    accessGrants: [],
  },
];

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-nwjf',
    name: 'Northwest Junior Football',
    abbrev: 'NJF',
    type: 'Youth',
    sport: 'American football',
    teamCount: 6,
    color: '#1e40af',
    teams: ['U14 Football', 'U12 Football', 'U10 Football', 'U14 Flag (Girls)', 'U12 Flag (Girls)', 'U8 Flag'],
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

type ViewState = 'list' | 'detail' | 'grant-search' | 'grant-configure';

export default function CamerasView({ venueName = 'Northwest High School' }: CamerasViewProps) {
  const [cameras, setCameras] = useState<Camera[]>(MOCK_CAMERAS);
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grant access form state
  const [accessFromDate, setAccessFromDate] = useState('2026-08-15');
  const [accessToDate, setAccessToDate] = useState('2026-11-21');
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [recordingWindows, setRecordingWindows] = useState<{ day: string; from: string; to: string }[]>([]);

  const handleManageCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setViewState('detail');
  };

  const handleBack = () => {
    if (viewState === 'grant-configure') {
      setViewState('grant-search');
    } else if (viewState === 'grant-search') {
      setViewState('detail');
      setSearchQuery('');
    } else {
      setViewState('list');
      setSelectedCamera(null);
    }
  };

  const handleGrantAccess = () => {
    setSearchQuery('');
    setSelectedOrg(null);
    setViewState('grant-search');
  };

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setSelectedTeams(new Set(org.teams || []));
    setViewState('grant-configure');
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
    setViewState('detail');
    setSelectedOrg(null);
    setSearchQuery('');
    setRecordingWindows([]);
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
    return (
      <div className="cameras-container">
        <div className="cameras-header">
          <h1 className="cameras-title">Cameras</h1>
          <p className="cameras-description">
            Manage who can record at <strong>{venueName}</strong>. Approve a club or visiting team once and they&apos;ll have ongoing access to your camera.
          </p>
        </div>

        <div className="cameras-list">
          {cameras.map(camera => (
            <div key={camera.id} className="camera-card">
              <div className="camera-card-image">
                <Image src={camera.image} alt={camera.name} width={120} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="camera-card-info">
                <h3 className="camera-card-name">{camera.name}</h3>
                <div className="camera-card-location">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 13c3-3 5-5.5 5-7.5a5 5 0 10-10 0c0 2 2 4.5 5 7.5z" stroke="currentColor" strokeWidth="1.2"/></svg>
                  {camera.venue}
                </div>
                <div className="camera-card-access">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 12.5c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span className="camera-card-access-count">{camera.accessGrants.length}</span> orgs with access
                </div>
              </div>
              <button className="camera-card-manage" onClick={() => handleManageCamera(camera)}>
                Manage
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cameras-tip">
          Need to share a camera with a visiting team or club? Open a camera and grant access from there.
        </div>
      </div>
    );
  }

  // Camera Detail View
  if (viewState === 'detail' && selectedCamera) {
    return (
      <div className="cameras-container">
        <div className="cameras-breadcrumb">
          <span>FACILITY</span>
          <span className="cameras-breadcrumb-sep">·</span>
          <span>CAMERAS</span>
          <span className="cameras-breadcrumb-sep">·</span>
          <span className="cameras-breadcrumb-active">{selectedCamera.name.toUpperCase()}</span>
        </div>

        <div className="camera-detail-card">
          <div className="camera-detail-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="8" width="24" height="16" rx="2" stroke="#0273e3" strokeWidth="2"/>
              <circle cx="16" cy="16" r="4" stroke="#0273e3" strokeWidth="2"/>
            </svg>
          </div>
          <div className="camera-detail-info">
            <h2 className="camera-detail-name">{selectedCamera.name}</h2>
            <div className="camera-detail-meta">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 13c3-3 5-5.5 5-7.5a5 5 0 10-10 0c0 2 2 4.5 5 7.5z" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedCamera.venue} · <span className={`camera-status camera-status--${selectedCamera.status}`}>{selectedCamera.status === 'online' ? 'Online' : 'Offline'}</span>
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
            <button className="camera-action-btn" onClick={handleBack}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
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
                  <div className="camera-access-org-logo" style={{ backgroundColor: grant.organization.color }}>
                    {grant.organization.abbrev}
                  </div>
                  <div className="camera-access-org-info">
                    <div className="camera-access-org-name">{grant.organization.name}</div>
                    <div className="camera-access-org-meta">
                      {grant.organization.type} · {grant.organization.sport} · {grant.teams.length} teams
                    </div>
                    <div className="camera-access-dates">
                      Access: {new Date(grant.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(grant.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <button className="camera-access-edit">Edit</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grant Access - Search Organizations
  if (viewState === 'grant-search') {
    return (
      <div className="cameras-container">
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
                  <div className="camera-org-logo" style={{ backgroundColor: org.color }}>
                    {org.abbrev}
                  </div>
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

        <button className="camera-back-link" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to camera
        </button>
      </div>
    );
  }

  // Grant Access - Configure Access
  if (viewState === 'grant-configure' && selectedOrg && selectedCamera) {
    const visibleTeams = selectedOrg.teams?.slice(0, 6) || [];
    const moreCount = (selectedOrg.teams?.length || 0) - 6;

    return (
      <div className="cameras-container">
        <div className="camera-grant-form">
          {/* Organization */}
          <div className="camera-grant-section">
            <div className="camera-grant-label">ORGANIZATION</div>
            <div className="camera-grant-org">
              <div className="camera-org-logo" style={{ backgroundColor: selectedOrg.color }}>
                {selectedOrg.abbrev}
              </div>
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
              <div className="camera-grant-camera-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="camera-grant-camera-info">
                <div className="camera-grant-camera-name">{selectedCamera.name}</div>
                <div className="camera-grant-camera-location">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1"/><path d="M6 11c2.5-2.5 4-4.5 4-6a4 4 0 10-8 0c0 1.5 1.5 3.5 4 6z" stroke="currentColor" strokeWidth="1"/></svg>
                  {selectedCamera.venue}
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
              {visibleTeams.map(team => (
                <span 
                  key={team} 
                  className={`camera-grant-team-chip ${selectedTeams.has(team) ? 'camera-grant-team-chip--selected' : ''}`}
                  onClick={() => toggleTeam(team)}
                >
                  {team}
                </span>
              ))}
              {moreCount > 0 && (
                <span className="camera-grant-team-chip camera-grant-team-chip--more">+ {moreCount} more</span>
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

          {/* Recording Times */}
          <div className="camera-grant-section">
            <div className="camera-grant-label">ALLOWED RECORDING TIMES <span className="camera-grant-optional">(OPTIONAL)</span></div>
            <p className="camera-grant-desc">Leave empty to allow recording any time during the access window. Add windows to restrict to specific days and times.</p>
            
            {recordingWindows.length === 0 ? (
              <div className="camera-grant-no-restrictions">
                No restrictions — recording allowed any time during the access window.
              </div>
            ) : (
              <div className="camera-grant-windows">
                {recordingWindows.map((w, i) => (
                  <div key={i} className="camera-grant-window">
                    {w.day}: {w.from} - {w.to}
                    <button onClick={() => setRecordingWindows(prev => prev.filter((_, j) => j !== i))}>×</button>
                  </div>
                ))}
              </div>
            )}
            
            <button className="camera-add-window-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Add window
            </button>
          </div>

          {/* Footer */}
          <div className="camera-grant-footer">
            <button className="camera-back-link" onClick={handleBack}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>
            <button className="camera-confirm-btn" onClick={handleConfirmGrant}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Grant access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
