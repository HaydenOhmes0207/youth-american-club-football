'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useToast } from './Toast';
import type { CalendarEvent } from './CalendarView';
import type { SentNotification } from './NavigationWrapper';

// Alex's facilities grouped by type
const FACILITIES = {
  outdoor: [
    { id: 'memorial-stadium', name: 'Memorial Stadium', venue: 'Memorial Stadium' },
    { id: 'soccer-complex', name: 'Soccer Complex', venue: 'Soccer Complex' },
    { id: 'tennis-courts', name: 'Tennis Courts', venue: 'Tennis Courts' },
    { id: 'trails', name: 'Trails / City Park', venue: 'Trails / City Park' },
  ],
  indoor: [
    { id: 'main-gym', name: 'Main Gym', venue: 'Main Gym' },
    { id: 'weight-room', name: 'Weight Room', venue: 'Weight Room' },
    { id: 'auditorium', name: 'Auditorium', venue: 'Auditorium' },
    { id: 'library', name: 'Library', venue: 'Library' },
    { id: 'ad-office', name: 'AD Office', venue: 'AD Office' },
  ],
};

const ALL_FACILITIES = [...FACILITIES.outdoor, ...FACILITIES.indoor];

interface FacilityClosurePanelProps {
  isOpen: boolean;
  onClose: () => void;
  allEvents: CalendarEvent[];
  cancelledEventIds: Set<string>;
  onConfirm: (eventIds: string[], notification: Omit<SentNotification, 'id' | 'sentAt'>) => void;
}

type Phase = 'configure' | 'review';

export default function FacilityClosurePanel({ isOpen, onClose, allEvents, cancelledEventIds, onConfirm }: FacilityClosurePanelProps) {
  const [phase, setPhase] = useState<Phase>('configure');
  const [selectedFacilities, setSelectedFacilities] = useState<Set<string>>(new Set());
  // Notification recipients
  const [notifyCoaches, setNotifyCoaches] = useState(true);
  const [notifyParents, setNotifyParents] = useState(true);
  const [notifyFans, setNotifyFans] = useState(false);
  // Notification channels
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);
  const [channelPush, setChannelPush] = useState(false);
  const [message, setMessage] = useState('');
  const { showToast } = useToast();

  // The closure date is fixed for demo: Friday, Sep 4, 2026
  const closureDate = new Date(2026, 8, 4);
  const closureDateLabel = 'Friday, September 4, 2026';

  // Reset on open
  React.useEffect(() => {
    if (isOpen) {
      setPhase('configure');
      setSelectedFacilities(new Set());
      setNotifyCoaches(true);
      setNotifyParents(true);
      setNotifyFans(false);
      setChannelEmail(true);
      setChannelSms(false);
      setChannelPush(false);
      setMessage(`Due to a severe thunderstorm warning, the following facilities at Lincoln East will be closed on ${closureDateLabel}. All affected events have been canceled. We apologize for the inconvenience.`);
      setIsCancelling(false);
    }
  }, [isOpen]);

  // Find affected events (at selected facilities on closure date, not already cancelled)
  const affectedEvents = useMemo(() => {
    const selectedVenues = new Set(
      ALL_FACILITIES.filter(f => selectedFacilities.has(f.id)).map(f => f.venue)
    );
    return allEvents.filter(ev => {
      if (cancelledEventIds.has(ev.id)) return false;
      const evDate = ev.date;
      if (evDate.getFullYear() !== closureDate.getFullYear() ||
          evDate.getMonth() !== closureDate.getMonth() ||
          evDate.getDate() !== closureDate.getDate()) return false;
      return selectedVenues.has(ev.location);
    });
  }, [allEvents, selectedFacilities, cancelledEventIds, closureDate]);

  const toggleFacility = useCallback((id: string) => {
    setSelectedFacilities(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleGroupAll = useCallback((group: 'outdoor' | 'indoor') => {
    const groupIds = FACILITIES[group].map(f => f.id);
    setSelectedFacilities(prev => {
      const next = new Set(prev);
      const allSelected = groupIds.every(id => next.has(id));
      if (allSelected) {
        groupIds.forEach(id => next.delete(id));
      } else {
        groupIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, []);

  const handleReview = () => setPhase('review');
  const handleBack = () => setPhase('configure');

  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = () => {
    setIsCancelling(true);
    setTimeout(() => {
      const eventIds = affectedEvents.map(e => e.id);
      const facilityNames = ALL_FACILITIES.filter(f => selectedFacilities.has(f.id)).map(f => f.name);
      const recipientLabels: string[] = [];
      if (notifyCoaches) recipientLabels.push('coaches');
      if (notifyParents) recipientLabels.push('parents');
      if (notifyFans) recipientLabels.push('fans');
      const channelLabels: string[] = [];
      if (channelEmail) channelLabels.push('email');
      if (channelSms) channelLabels.push('SMS');
      if (channelPush) channelLabels.push('push');

      onConfirm(eventIds, {
        date: closureDate,
        facilities: facilityNames,
        events: affectedEvents.map(e => e.title),
        recipients: { coaches: notifyCoaches, parents: notifyParents, fans: notifyFans },
        channels: { email: channelEmail, sms: channelSms, push: channelPush },
        message,
        recipientCount: Math.floor(80 + Math.random() * 200),
      });

      const notifSummary = recipientLabels.length > 0 && channelLabels.length > 0
        ? ` Notifications sent via ${channelLabels.join(', ')} to ${recipientLabels.join(', ')}.`
        : '';
      setIsCancelling(false);
      showToast(`${eventIds.length} events canceled across ${facilityNames.length} facilities.${notifSummary}`, 'success');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  const outdoorAllSelected = FACILITIES.outdoor.every(f => selectedFacilities.has(f.id));
  const indoorAllSelected = FACILITIES.indoor.every(f => selectedFacilities.has(f.id));
  const anyRecipient = notifyCoaches || notifyParents || notifyFans;
  const anyChannel = channelEmail || channelSms || channelPush;

  return (
    <>
      <div className="import-panel-backdrop" onClick={onClose} />
      <div className="import-panel">
        <div className="import-panel-header">
          <h2 className="import-panel-title">Close Facilities</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="import-panel-body-wrapper">
          <div className={`import-panel-slider ${phase === 'review' ? 'import-panel-slider--edit' : ''}`}>
            {/* Phase 1: Configure */}
            <div className="import-panel-pane">
              <div className="import-panel-body">
                <div className="closure-phase-configure">
                  {/* Date display */}
                  <div className="closure-date-display">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.333" width="15" height="13.333" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 7.5h15" stroke="currentColor" strokeWidth="1.5"/><path d="M6.667 1.667v3.333M13.333 1.667v3.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <div className="closure-date-text">
                      <div className="closure-date-label">Closure Date</div>
                      <div className="closure-date-value">{closureDateLabel}</div>
                    </div>
                  </div>

                  {/* Facility selection */}
                  <div className="closure-facility-section">
                    <div className="closure-section-label">Select facilities to close</div>

                    <div className="closure-facility-group">
                      <label className="closure-group-header" onClick={() => toggleGroupAll('outdoor')}>
                        <input type="checkbox" checked={outdoorAllSelected} readOnly />
                        <span className="closure-group-label">Outdoor Facilities</span>
                        <span className="closure-group-count">{FACILITIES.outdoor.filter(f => selectedFacilities.has(f.id)).length} / {FACILITIES.outdoor.length}</span>
                      </label>
                      {FACILITIES.outdoor.map(f => (
                        <label key={f.id} className="closure-facility-row">
                          <input type="checkbox" checked={selectedFacilities.has(f.id)} onChange={() => toggleFacility(f.id)} />
                          <span className="closure-facility-name">{f.name}</span>
                        </label>
                      ))}
                    </div>

                    <div className="closure-facility-group">
                      <label className="closure-group-header" onClick={() => toggleGroupAll('indoor')}>
                        <input type="checkbox" checked={indoorAllSelected} readOnly />
                        <span className="closure-group-label">Indoor Facilities</span>
                        <span className="closure-group-count">{FACILITIES.indoor.filter(f => selectedFacilities.has(f.id)).length} / {FACILITIES.indoor.length}</span>
                      </label>
                      {FACILITIES.indoor.map(f => (
                        <label key={f.id} className="closure-facility-row">
                          <input type="checkbox" checked={selectedFacilities.has(f.id)} onChange={() => toggleFacility(f.id)} />
                          <span className="closure-facility-name">{f.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Affected events preview */}
                  {selectedFacilities.size > 0 && (
                    <div className="closure-affected-preview">
                      <span className="closure-affected-count">{affectedEvents.length} event{affectedEvents.length !== 1 ? 's' : ''} will be canceled</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="import-panel-footer">
                <button className="import-approve-btn" disabled={selectedFacilities.size === 0} onClick={handleReview}>
                  Review Affected Events
                </button>
              </div>
            </div>

            {/* Phase 2: Review & Notify */}
            <div className="import-panel-pane">
              <div className="import-panel-body">
                <div className="closure-phase-review">
                  {/* Back button */}
                  <button className="import-back-btn" onClick={handleBack}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Back
                  </button>

                  {/* Affected events list */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Events to cancel ({affectedEvents.length})</div>
                    <div className="closure-event-list">
                      {affectedEvents.map(ev => (
                        <div key={ev.id} className="closure-event-row">
                          <span className="closure-event-dot" style={{ background: ev.color }} />
                          <span className="closure-event-title">{ev.title}</span>
                          <span className="closure-event-time">{ev.time}</span>
                        </div>
                      ))}
                      {affectedEvents.length === 0 && (
                        <div className="closure-event-empty">No events scheduled at selected facilities on this date.</div>
                      )}
                    </div>
                  </div>

                  {/* Notification channels */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Notification channels</div>
                    <div className="closure-channel-grid">
                      <label className="closure-channel-option">
                        <input type="checkbox" checked={channelEmail} onChange={() => setChannelEmail(v => !v)} />
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M1.5 4.5L8 9l6.5-4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                        <span>Email</span>
                      </label>
                      <label className="closure-channel-option">
                        <input type="checkbox" checked={channelSms} onChange={() => setChannelSms(v => !v)} />
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3.5" y="1" width="9" height="14" rx="2" stroke="currentColor" strokeWidth="1.25"/><path d="M6.5 12h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                        <span>Text (SMS)</span>
                      </label>
                      <label className="closure-channel-option">
                        <input type="checkbox" checked={channelPush} onChange={() => setChannelPush(v => !v)} />
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 5.333A2 2 0 008 3.333a2 2 0 00-2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><path d="M12.667 5.333c0-2.577-2.09-4.666-4.667-4.666S3.333 2.756 3.333 5.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><path d="M4.667 8v2.667a1.333 1.333 0 001.333 1.333h4a1.333 1.333 0 001.333-1.333V8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12v2.667M5.333 14.667h5.334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                        <span>Push</span>
                      </label>
                    </div>
                  </div>

                  {/* Notification recipients */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Notify</div>
                    <div className="closure-notify-options">
                      <label className="closure-notify-option">
                        <input type="checkbox" checked={notifyCoaches} onChange={() => setNotifyCoaches(v => !v)} />
                        <span>Coaches</span>
                      </label>
                      <label className="closure-notify-option">
                        <input type="checkbox" checked={notifyParents} onChange={() => setNotifyParents(v => !v)} />
                        <span>Parents &amp; guardians</span>
                      </label>
                      <label className="closure-notify-option">
                        <input type="checkbox" checked={notifyFans} onChange={() => setNotifyFans(v => !v)} />
                        <span>Ticket holders / fans</span>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Message</div>
                    <textarea className="closure-message" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="import-panel-footer">
                <button
                  className="closure-confirm-btn"
                  disabled={affectedEvents.length === 0 || (anyRecipient && !anyChannel) || isCancelling}
                  onClick={handleConfirm}
                >
                  {isCancelling ? (
                    <><span className="import-btn-spinner import-btn-spinner--light" />Canceling events...</>
                  ) : (
                    <>Close Facilities{anyRecipient && anyChannel ? ' & Notify' : ''}</>
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
