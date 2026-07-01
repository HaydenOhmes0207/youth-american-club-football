'use client';

import { useState } from 'react';
import type { TeamWithStats } from '@/lib/actions/teams';
import type { RegisteredAthlete } from '@/lib/actions/programs';
import PageHeader from '@/components/PageHeader';

interface AthleteDetailPageClientProps {
  team: TeamWithStats;
  seasonName: string;
  athlete: RegisteredAthlete;
}

type Tab = 'Profile' | 'Highlights';

function formatGrade(grade: number): string {
  if (grade === -1) return 'Pre-K';
  if (grade === 0) return 'K';
  const suffix = grade === 1 ? 'st' : grade === 2 ? 'nd' : grade === 3 ? 'rd' : 'th';
  return `${grade}${suffix}`;
}

export default function AthleteDetailPageClient({ team, seasonName, athlete }: AthleteDetailPageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');

  const tabs: Tab[] = ['Profile', 'Highlights'];

  const volleyballHighlights = [
    { id: 1, title: 'Season Highlights — Spike Reel', date: 'Mar 12, 2025', duration: '2:14', views: 1842, thumbnail: '#1a3a5c' },
    { id: 2, title: 'State Championship — Back Row Attack', date: 'Feb 28, 2025', duration: '1:47', views: 934, thumbnail: '#0f2740' },
    { id: 3, title: 'Serve Aces Compilation', date: 'Feb 14, 2025', duration: '1:03', views: 612, thumbnail: '#1e4976' },
    { id: 4, title: 'Block & Dig Highlights', date: 'Jan 31, 2025', duration: '3:22', views: 489, thumbnail: '#163560' },
    { id: 5, title: 'Tournament — Best Plays', date: 'Jan 18, 2025', duration: '2:55', views: 1103, thumbnail: '#0d2e52' },
    { id: 6, title: 'Setter Assists Reel', date: 'Dec 9, 2024', duration: '1:38', views: 276, thumbnail: '#1a4268' },
  ];

  const initials = `${athlete.firstName[0] ?? ''}${athlete.lastName[0] ?? ''}`.toUpperCase();

  const profileRows = [
    { label: 'Grade', value: formatGrade(athlete.grade) },
    { label: 'Gender', value: athlete.gender },
    { label: 'Birthdate', value: athlete.birthdate },
    { label: 'Team', value: team.title },
    { label: 'Season', value: seasonName ? `${seasonName} Season` : '—' },
    { label: 'Sport', value: team.sport },
  ];

  return (
    <div className="detail-page">
      <PageHeader
        title={`${athlete.firstName} ${athlete.lastName}`}
        description={[team.sport, formatGrade(athlete.grade), seasonName ? `${seasonName} Season` : ''].filter(Boolean).join(' · ')}
        breadcrumbs={[
          { label: 'Teams', href: '/teams' },
          { label: team.title, href: `/teams/${team.id}` },
          { label: `${athlete.firstName} ${athlete.lastName}` },
        ]}
        tabs={tabs.map(tab => ({
          label: tab,
          isActive: activeTab === tab,
          onClick: () => setActiveTab(tab),
        }))}
      />

      <div className="tab-content">
        {activeTab === 'Profile' && (
          <div className="profile-layout">
            <div className="athlete-card">
              <div className="athlete-avatar">
                <span className="athlete-initials">{initials}</span>
              </div>
              <div className="athlete-identity">
                <span className="athlete-name">{athlete.firstName} {athlete.lastName}</span>
                <span className="athlete-meta">{team.sport} · {formatGrade(athlete.grade)} Grade</span>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">Athlete Info</h3>
              <div className="detail-list">
                {profileRows.map(({ label, value }) => (
                  <div key={label} className="detail-row">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">Parent / Guardian</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{athlete.parentFirstName} {athlete.parentLastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{athlete.parentEmail}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Highlights' && (
          <div className="highlights-section">
            <div className="highlights-header">
              <h3 className="highlights-count">{volleyballHighlights.length} videos</h3>
            </div>
            <div className="highlights-grid">
              {volleyballHighlights.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail" style={{ background: video.thumbnail }}>
                    <div className="play-button">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 4.5L15.5 10L7 15.5V4.5Z" fill="white"/>
                      </svg>
                    </div>
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <div className="video-info">
                    <span className="video-title">{video.title}</span>
                    <span className="video-meta">{video.date} · {video.views.toLocaleString()} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .detail-page {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .tab-content {
          width: 100%;
        }

        .profile-layout {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one-and-half, 24px);
          max-width: 560px;
        }

        .athlete-card {
          display: flex;
          align-items: center;
          gap: var(--u-space-one, 16px);
          padding: var(--u-space-one-and-half, 24px);
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
        }

        .athlete-avatar {
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: var(--u-color-identity-default, #38434f);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .athlete-initials {
          font-family: var(--u-font-body);
          font-size: 18px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: -0.5px;
        }

        .athlete-identity {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .athlete-name {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-300, 18px);
          font-weight: 700;
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .athlete-meta {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .section {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .section-title {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          font-weight: 700;
          color: var(--u-color-base-foreground-subtle, #607081);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .detail-list {
          display: flex;
          flex-direction: column;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
        }

        .detail-row {
          display: flex;
          align-items: center;
          padding: 12px var(--u-space-one-and-half, 24px);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          gap: var(--u-space-one, 16px);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: 600;
          color: var(--u-color-base-foreground-subtle, #607081);
          width: 120px;
          flex-shrink: 0;
        }

        .detail-value {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .highlights-section {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
        }

        .highlights-header {
          display: flex;
          align-items: center;
        }

        .highlights-count {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: 600;
          color: var(--u-color-base-foreground-subtle, #607081);
          margin: 0;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--u-space-one, 16px);
        }

        .video-card {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
          cursor: pointer;
        }

        .video-card:hover .video-thumbnail {
          opacity: 0.9;
        }

        .video-thumbnail {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: var(--u-border-radius-medium, 4px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s ease;
          overflow: hidden;
        }

        .play-button {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .video-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          font-weight: 600;
          color: white;
          background: rgba(0, 0, 0, 0.65);
          padding: 2px 6px;
          border-radius: 3px;
        }

        .video-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .video-title {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.3;
        }

        .video-meta {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-base-foreground-subtle, #607081);
        }
      `}</style>
    </div>
  );
}
