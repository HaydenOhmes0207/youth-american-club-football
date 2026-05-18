'use client';

import React, { useState } from 'react';
import Button from './Button';
import './components.css';

interface AddEventPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (event: AddedEvent) => void;
}

export interface AddedEvent {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  opponent: string;
  eventType: 'game' | 'practice' | 'other';
  gameType?: string;
  focusRecording: boolean;
  liveStream: boolean;
}

const OPPONENTS = [
  'Papillion-La Vista South',
  'Millard North',
  'Westside Warriors',
  'Lincoln East',
  'Omaha Central',
  'Bellevue West',
  'Elkhorn South',
  'Creighton Prep',
];

const TIME_OPTIONS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

const END_TIME_OPTIONS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
];

export default function AddEventPanel({ isOpen, onClose, onSubmit }: AddEventPanelProps) {
  // Pre-configured for Nov 7 at Memorial Stadium
  const [eventType, setEventType] = useState<'game' | 'practice' | 'other'>('game');
  const [gameType, setGameType] = useState('Regular Season');
  const [opponent, setOpponent] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-07');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [focusRecording, setFocusRecording] = useState(true);
  const [liveStream, setLiveStream] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title: eventType === 'game' ? `vs ${opponent}` : '',
        date: eventDate,
        startTime,
        endTime,
        location: 'Memorial Stadium',
        opponent,
        eventType,
        gameType: eventType === 'game' ? gameType : undefined,
        focusRecording,
        liveStream,
      });
    }
    onClose();
  };

  const canSubmit = eventType !== 'game' || opponent !== '';

  return (
    <>
      <div className="import-panel-backdrop" onClick={onClose} />
      <div className="import-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div className="import-panel-header">
          <h2 className="import-panel-title">Schedule Event for Nov 7</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px' }}>
          <div className="add-event-form">
            {/* Camera Access Notice */}
            <div className="add-event-access-notice">
              <div className="add-event-access-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="#16a34a" strokeWidth="1.5"/>
                  <path d="M7 10l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="add-event-access-content">
                <div className="add-event-access-title">Camera Access Granted</div>
                <div className="add-event-access-desc">Northwest High School has granted you access to Memorial Stadium cameras for Nov 7, 2026.</div>
              </div>
            </div>

            {/* Location - Pre-selected */}
            <div className="add-event-section">
              <div className="add-event-label">LOCATION</div>
              <div className="add-event-venue-card">
                <div className="add-event-venue-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 18c4-4 6.5-7 6.5-10.5a6.5 6.5 0 10-13 0c0 3.5 2.5 6.5 6.5 10.5z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="add-event-venue-info">
                  <div className="add-event-venue-name">Memorial Stadium</div>
                  <div className="add-event-venue-org">Northwest High School</div>
                </div>
                <div className="add-event-venue-badge">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 11a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1"/>
                    <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Access Granted
                </div>
              </div>
            </div>

            {/* Focus Recording Enabled */}
            <div className="add-event-section">
              <div className="add-event-label">RECORDING OPTIONS</div>
              <div className="add-event-recording-options">
                <label className="add-event-recording-toggle">
                  <input 
                    type="checkbox" 
                    checked={focusRecording} 
                    onChange={(e) => setFocusRecording(e.target.checked)} 
                  />
                  <span className="add-event-toggle-switch" />
                  <div className="add-event-toggle-content">
                    <div className="add-event-toggle-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
                      </svg>
                    </div>
                    <span className="add-event-toggle-label">Focus Recording</span>
                  </div>
                </label>
                <label className="add-event-recording-toggle">
                  <input 
                    type="checkbox" 
                    checked={liveStream} 
                    onChange={(e) => setLiveStream(e.target.checked)} 
                  />
                  <span className="add-event-toggle-switch" />
                  <div className="add-event-toggle-content">
                    <div className="add-event-toggle-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25"/>
                        <path d="M5.17 5.17a4 4 0 000 5.66M10.83 5.17a4 4 0 010 5.66" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                        <path d="M3.05 3.05a7 7 0 000 9.9M12.95 3.05a7 7 0 010 9.9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="add-event-toggle-label">Live Stream</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Event Type */}
            <div className="add-event-section">
              <div className="add-event-label">EVENT TYPE</div>
              <div className="add-event-radio-group">
                {(['game', 'practice', 'other'] as const).map(t => (
                  <label key={t} className="add-event-radio-option">
                    <input type="radio" name="eventType" checked={eventType === t} onChange={() => setEventType(t)} />
                    <span className="add-event-radio-dot" />
                    <span>{t === 'game' ? 'Game' : t === 'practice' ? 'Practice' : 'Other'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Game Type (only for games) */}
            {eventType === 'game' && (
              <div className="add-event-section">
                <div className="add-event-label">GAME TYPE</div>
                <div className="add-event-radio-group">
                  {['Regular Season', 'Scrimmage', 'Tournament', 'Postseason'].map(t => (
                    <label key={t} className="add-event-radio-option">
                      <input type="radio" name="gameType" checked={gameType === t} onChange={() => setGameType(t)} />
                      <span className="add-event-radio-dot" />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Opponent (only for games) */}
            {eventType === 'game' && (
              <div className="add-event-section">
                <div className="add-event-label">OPPONENT <span className="add-event-required">*</span></div>
                <select 
                  className="add-event-select" 
                  value={opponent} 
                  onChange={(e) => setOpponent(e.target.value)}
                >
                  <option value="">Select an opponent</option>
                  {OPPONENTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            )}

            {/* Date */}
            <div className="add-event-section">
              <div className="add-event-label">DATE</div>
              <input 
                className="add-event-input" 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
              />
            </div>

            {/* Time */}
            <div className="add-event-section">
              <div className="add-event-label">TIME</div>
              <div className="add-event-time-row">
                <select 
                  className="add-event-select" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="add-event-time-sep">to</span>
                <select 
                  className="add-event-select" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {END_TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="import-panel-footer">
          <Button buttonStyle="standard" buttonType="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button buttonStyle="standard" buttonType="primary" onClick={handleSubmit} disabled={!canSubmit}>
            Add Event
          </Button>
        </div>
      </div>
    </>
  );
}
