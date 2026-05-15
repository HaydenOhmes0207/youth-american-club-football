'use client';

import React, { useState } from 'react';

export interface EventCreateResult {
  title: string;
  date: string;
  timeBlock: string;
  location: string;
  isExternal: boolean;
  externalOrg?: string;
  amenities: string[];
  description: string;
}

interface VenueOption {
  id: string;
  name: string;
  org?: string;
  isExternal: boolean;
  availableOnDate?: boolean;
}

const MY_VENUES: VenueOption[] = [
  { id: 'v-pp1', name: 'Pioneer Park Field 1', isExternal: false },
  { id: 'v-pp2', name: 'Pioneer Park Field 2', isExternal: false },
  { id: 'v-pp3', name: 'Pioneer Park Field 3', isExternal: false },
  { id: 'v-pp4', name: 'Pioneer Park Field 4', isExternal: false },
  { id: 'v-cc', name: 'Community Center Gym', isExternal: false },
];

const NETWORK_VENUES: VenueOption[] = [
  { id: 'v-spartan', name: 'Spartan Field - Memorial Stadium', org: 'Lincoln East HS', isExternal: true, availableOnDate: true },
  { id: 'v-hawks', name: 'Hawks Field', org: 'Papillion-La Vista HS', isExternal: true, availableOnDate: false },
  { id: 'v-mustang', name: 'Mustang Stadium', org: 'Millard North HS', isExternal: true, availableOnDate: true },
];

const AMENITY_OPTIONS = [
  { id: 'camera', label: 'Camera / Streaming' },
  { id: 'scoreboard', label: 'Scoreboard' },
  { id: 'pa', label: 'PA System' },
  { id: 'pressbox', label: 'Press Box' },
];

interface EventCreatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: EventCreateResult) => void;
  defaultDate?: string;
}

export default function EventCreatePanel({ isOpen, onClose, onSubmit, defaultDate }: EventCreatePanelProps) {
  const [title, setTitle] = useState('Championship Saturday');
  const [date] = useState(defaultDate || '2026-11-07');
  const [startTime, setStartTime] = useState('8:00 AM');
  const [endTime, setEndTime] = useState('6:00 PM');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set(['camera', 'scoreboard', 'pa']));
  const [description, setDescription] = useState(
    'End-of-season championship games for our youth tackle football program. Four title games across age divisions (3rd-6th grade). Expected attendance: ~400 families.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const filteredMyVenues = MY_VENUES.filter(v =>
    !locationSearch || v.name.toLowerCase().includes(locationSearch.toLowerCase())
  );
  const filteredNetworkVenues = NETWORK_VENUES.filter(v =>
    !locationSearch || v.name.toLowerCase().includes(locationSearch.toLowerCase()) || (v.org && v.org.toLowerCase().includes(locationSearch.toLowerCase()))
  );

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!selectedVenue || !title.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        title,
        date,
        timeBlock: `${startTime} - ${endTime}`,
        location: selectedVenue.name,
        isExternal: selectedVenue.isExternal,
        externalOrg: selectedVenue.org,
        amenities: Array.from(selectedAmenities),
        description,
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <>
      <div
        className="import-panel-backdrop"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />
      <div className="import-panel" style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="import-panel-header">
          <h2 className="import-panel-title">New Event</h2>
          <button className="import-panel-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="import-panel-body-wrapper">
          <div className="import-panel-slider" style={{ width: '100%' }}>
            <div className="import-panel-pane" style={{ width: '100%' }}>
              <div className="import-panel-body">
                <div className="closure-phase-review">
                  {/* Event Title */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Event Name</div>
                    <input
                      className="compose-subject-input"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Championship Saturday"
                    />
                  </div>

                  {/* Date */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Date</div>
                    <div className="compose-field-value">Saturday, November 7, 2026</div>
                  </div>

                  {/* Time */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Time</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select className="compose-subject-input" style={{ width: 'auto' }} value={startTime} onChange={e => setStartTime(e.target.value)}>
                        {['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="compose-field-value">to</span>
                      <select className="compose-subject-input" style={{ width: 'auto' }} value={endTime} onChange={e => setEndTime(e.target.value)}>
                        {['2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Search */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Location</div>
                    {selectedVenue ? (
                      <div className="event-venue-selected">
                        <div className="event-venue-selected-info">
                          <span className="event-venue-selected-name">{selectedVenue.name}</span>
                          {selectedVenue.isExternal && (
                            <span className="event-venue-external-tag">
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M12 2h4v4M6 10l6-6M14 9v5a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                              External &middot; {selectedVenue.org}
                            </span>
                          )}
                        </div>
                        <button className="event-venue-change" onClick={() => { setSelectedVenue(null); setShowLocationDropdown(true); }}>Change</button>
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <input
                          className="compose-subject-input"
                          value={locationSearch}
                          onChange={e => { setLocationSearch(e.target.value); setShowLocationDropdown(true); }}
                          onFocus={() => setShowLocationDropdown(true)}
                          placeholder="Search venues..."
                        />
                        {showLocationDropdown && (
                          <div className="event-venue-dropdown">
                            {filteredMyVenues.length > 0 && (
                              <>
                                <div className="event-venue-group-label">Your Venues</div>
                                {filteredMyVenues.map(v => (
                                  <button key={v.id} className="event-venue-option" onClick={() => { setSelectedVenue(v); setShowLocationDropdown(false); setLocationSearch(''); }}>
                                    <span className="event-venue-option-name">{v.name}</span>
                                  </button>
                                ))}
                              </>
                            )}
                            {filteredNetworkVenues.length > 0 && (
                              <>
                                <div className="event-venue-group-label">Nearby / Network Venues</div>
                                {filteredNetworkVenues.map(v => (
                                  <button key={v.id} className="event-venue-option" onClick={() => { setSelectedVenue(v); setShowLocationDropdown(false); setLocationSearch(''); }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      <span className="event-venue-option-name">{v.name}</span>
                                      <span className="event-venue-option-org">
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M12 2h4v4M6 10l6-6M14 9v5a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                        {v.org}
                                      </span>
                                    </div>
                                    {v.availableOnDate ? (
                                      <span className="event-venue-avail event-venue-avail--open">Available Nov 7</span>
                                    ) : (
                                      <span className="event-venue-avail event-venue-avail--busy">Unavailable</span>
                                    )}
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* External venue notice + amenities */}
                  {selectedVenue?.isExternal && (
                    <>
                      <div className="event-approval-notice">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <span>This facility requires approval from <strong>{selectedVenue.org}</strong></span>
                      </div>

                      {selectedVenue.availableOnDate && (
                        <div className="booking-availability">
                          <span className="booking-availability-dot" />
                          <span className="booking-availability-text"><strong>Nov 7 is available</strong> &mdash; no conflicts on {selectedVenue.org}&apos;s calendar</span>
                        </div>
                      )}

                      <div className="closure-review-section">
                        <div className="closure-section-label">Request Amenities</div>
                        <div className="booking-amenities">
                          {AMENITY_OPTIONS.map(a => (
                            <label key={a.id} className={`event-amenity-toggle ${selectedAmenities.has(a.id) ? 'event-amenity-toggle--active' : ''}`}>
                              <input type="checkbox" checked={selectedAmenities.has(a.id)} onChange={() => toggleAmenity(a.id)} style={{ display: 'none' }} />
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                {selectedAmenities.has(a.id) ? (
                                  <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                ) : (
                                  <path d="M6 3v6M3 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                )}
                              </svg>
                              {a.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Description */}
                  <div className="closure-review-section">
                    <div className="closure-section-label">Description</div>
                    <textarea
                      className="closure-message"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="import-panel-footer">
                <button
                  className="compose-send-btn"
                  disabled={!selectedVenue || !title.trim() || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" /></svg>
                      Submitting...
                    </>
                  ) : selectedVenue?.isExternal ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2.667L7.333 9.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><path d="M14 2.667l-4.667 13.333-2.666-6-6-2.667L14 2.667z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                      Submit Booking Request
                    </>
                  ) : (
                    'Save Event'
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
