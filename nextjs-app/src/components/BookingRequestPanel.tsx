'use client';

import React, { useState } from 'react';
import { useToast } from './Toast';

export interface BookingRequest {
  id: string;
  fromOrg: string;
  fromDirector: string;
  fromRole: string;
  facility: string;
  venue: string;
  date: string;
  dateLabel: string;
  timeBlock: string;
  eventTitle: string;
  description: string;
  amenities: { label: string; icon: 'camera' | 'scoreboard' | 'pa' | 'pressbox' }[];
  status: 'pending' | 'approved' | 'declined';
}

interface BookingRequestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  request: BookingRequest;
  onApprove: (request: BookingRequest) => void;
  onDecline: (request: BookingRequest) => void;
}

function AmenityIcon({ type }: { type: BookingRequest['amenities'][0]['icon'] }) {
  switch (type) {
    case 'camera':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 4.5a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5v-7z" stroke="currentColor" strokeWidth="1.25"/><path d="M10.5 6.5l4-2v7l-4-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'scoreboard':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M8 3.5v9M1.5 8h13" stroke="currentColor" strokeWidth="1.25"/></svg>;
    case 'pa':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 7v2a1 1 0 001 1h1l4 3V4L5 7H4a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/><path d="M11.5 5.5a3.5 3.5 0 010 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>;
    case 'pressbox':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.25"/><path d="M2 6h12" stroke="currentColor" strokeWidth="1.25"/><path d="M6 6v8M10 6v8" stroke="currentColor" strokeWidth="1.25"/></svg>;
  }
}

export default function BookingRequestPanel({ isOpen, onClose, request, onApprove, onDecline }: BookingRequestPanelProps) {
  const [isApproving, setIsApproving] = useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (isOpen) setIsApproving(false);
  }, [isOpen]);

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      onApprove(request);
      setIsApproving(false);
      showToast(`Booking approved for ${request.fromOrg}. Camera access unlocked.`, 'success');
      onClose();
    }, 1500);
  };

  const handleDecline = () => {
    onDecline(request);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="import-panel-backdrop" onClick={onClose} />
      <div className="import-panel">
        <div className="import-panel-header">
          <h2 className="import-panel-title">Booking Request</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="import-panel-body-wrapper">
          <div className="import-panel-slider">
            <div className="import-panel-pane" style={{ width: '100%' }}>
              <div className="import-panel-body">
                <div className="closure-phase-review">
                  {/* Requesting Organization */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Requesting organization</div>
                    <div className="booking-org-card">
                      <div className="booking-org-avatar">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 19v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
                      </div>
                      <div className="booking-org-info">
                        <span className="booking-org-name">{request.fromOrg}</span>
                        <span className="booking-org-director">{request.fromDirector} &middot; {request.fromRole}</span>
                      </div>
                    </div>
                  </div>

                  {/* Facility & Date */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Facility</div>
                    <div className="booking-detail-rows">
                      <div className="booking-detail-row">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.333l6 3v7.334l-6 3-6-3V4.333l6-3z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/><path d="M8 8v6.667M2 4.333L8 8l6-3.667" stroke="currentColor" strokeWidth="1.25"/></svg>
                        <span className="booking-detail-text"><strong>{request.facility}</strong> &middot; {request.venue}</span>
                      </div>
                      <div className="booking-detail-row">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.333" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M2.5 6.333h11" stroke="currentColor" strokeWidth="1.25"/><path d="M5.5 1.333v2M10.5 1.333v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                        <span className="booking-detail-text">{request.dateLabel}</span>
                      </div>
                      <div className="booking-detail-row">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25"/><path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                        <span className="booking-detail-text">{request.timeBlock}</span>
                      </div>
                    </div>
                  </div>

                  {/* Event */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Event</div>
                    <div className="booking-event-card">
                      <span className="booking-event-title">{request.eventTitle}</span>
                      <span className="booking-event-desc">{request.description}</span>
                    </div>
                  </div>

                  {/* Requested Amenities */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Requested amenities</div>
                    <div className="booking-amenities">
                      {request.amenities.map((a, i) => (
                        <div key={i} className="booking-amenity-chip">
                          <AmenityIcon type={a.icon} />
                          <span>{a.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Availability</div>
                    <div className="booking-availability">
                      <div className="booking-availability-dot" />
                      <span className="booking-availability-text">Spartan Field is <strong>available</strong> on {request.dateLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="import-panel-footer" style={{ display: 'flex', gap: '8px' }}>
                <button className="booking-decline-btn" onClick={handleDecline} disabled={isApproving}>
                  Decline
                </button>
                <button className="booking-approve-btn" onClick={handleApprove} disabled={isApproving}>
                  {isApproving ? (
                    <><span className="import-btn-spinner import-btn-spinner--light" />Approving...</>
                  ) : (
                    'Approve & Unlock Camera'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
