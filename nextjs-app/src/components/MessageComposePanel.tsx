'use client';

import React, { useState } from 'react';
import type { Registrant } from './ProgramDetailView';
import type { ProgramWithStats } from '@/lib/actions/programs';

export interface MessagePayload {
  subject: string;
  message: string;
  channels: { email: boolean; sms: boolean; push: boolean };
  recipientCount: number;
  programTitle: string;
  sentBy: string;
}

function formatDollars(dollars: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dollars);
}

interface MessageComposePanelProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
  onSend: (payload: MessagePayload) => void;
  // Registrant-level mode (drill-in)
  recipients?: Registrant[];
  programTitle?: string;
  // Program-level bulk mode (overdue)
  overduePrograms?: ProgramWithStats[];
}

export default function MessageComposePanel({
  isOpen,
  onClose,
  senderName,
  onSend,
  recipients,
  programTitle,
  overduePrograms,
}: MessageComposePanelProps) {
  const isBulkMode = !!overduePrograms && overduePrograms.length > 0;

  const bulkFamilyCount = isBulkMode
    ? overduePrograms.reduce((sum, p) => {
        const unpaidRate = 1 - (p.paidPercent ?? 100) / 100;
        return sum + Math.round(p.registrantCount * unpaidRate);
      }, 0)
    : 0;
  const totalOutstanding = isBulkMode
    ? overduePrograms.reduce((sum, p) => sum + (p.outstandingAmount ?? 0), 0)
    : 0;
  const bulkProgramNames = isBulkMode ? overduePrograms.map(p => p.title) : [];
  const displayTitle = isBulkMode ? bulkProgramNames.join(', ') : (programTitle || '');
  const recipientCount = isBulkMode ? bulkFamilyCount : (recipients ? new Set(recipients.map(r => r.parentEmail)).size : 0);

  const [subject, setSubject] = useState(
    isBulkMode
      ? 'Payment Reminder - {{programName}} Balance'
      : `${displayTitle} - What to Bring`
  );
  const [message, setMessage] = useState(
    isBulkMode
      ? `Hi {{parentFirstName}},\n\nThis is a friendly reminder that {{athleteFirstName}}'s registration balance for {{programName}} is still outstanding. Our records show {{amountDue}} remaining on your account.\n\nPlease log in to the app to view your balance and submit payment at your earliest convenience. If you have already paid, please disregard this message.\n\nIf you need to set up a payment plan or have questions, reply to this message and we'll work with you.\n\nThank you,\n${senderName}\nWestside Youth Football Club`
      : `Hi {{parentFirstName}},\n\nJust a quick reminder about what {{athleteFirstName}} needs to bring to ${displayTitle}:\n\n- Turf shoes (no metal cleats)\n- Helmet (properly fitted)\n- Water bottle (labeled with name)\n\nAlso, please make sure to RSVP in the app so we have an accurate headcount for {{sessionDate}}.\n\nSee you there!\n${senderName}`
  );
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(isBulkMode);
  const [channelPush, setChannelPush] = useState(true);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const anyChannel = channelEmail || channelSms || channelPush;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onSend({
        subject,
        message,
        channels: { email: channelEmail, sms: channelSms, push: channelPush },
        recipientCount,
        programTitle: displayTitle,
        sentBy: senderName,
      });
      setIsSending(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      <div className="import-panel-backdrop" onClick={onClose} />
      <div className="import-panel">
        <div className="import-panel-header">
          <h2 className="import-panel-title">{isBulkMode ? 'Payment Reminder' : 'Send Message'}</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="import-panel-body-wrapper">
          <div className="import-panel-pane" style={{ width: '100%' }}>
            <div className="import-panel-body">
              <div className="closure-phase-review">

                {/* From */}
                <div className="closure-review-section">
                  <div className="closure-section-label">From</div>
                  <div className="compose-field-value">{senderName}</div>
                </div>

                {/* Recipients */}
                <div className="closure-review-section">
                  <div className="closure-section-label">Recipients</div>
                  <div className="compose-recipients-info">
                    <span className="compose-recipients-count">{recipientCount} families</span>
                    {isBulkMode ? (
                      <span className="compose-recipients-program">with outstanding balances</span>
                    ) : (
                      <span className="compose-recipients-program">{displayTitle}</span>
                    )}
                  </div>
                  {isBulkMode && (
                    <div className="compose-programs-list">
                      {overduePrograms.map(p => (
                        <div key={p.id} className="compose-program-row">
                          <span className="compose-program-name">{p.title}</span>
                          <span className="compose-program-outstanding">{formatDollars(p.outstandingAmount ?? 0)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="closure-review-section">
                  <div className="closure-section-label">Subject</div>
                  <input
                    type="text"
                    className="compose-subject-input"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  />
                </div>

                {/* Channels */}
                <div className="closure-review-section">
                  <div className="closure-section-label">Channels</div>
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

                {/* Message */}
                <div className="closure-review-section">
                  <div className="closure-section-label">Message</div>
                  <textarea
                    className="closure-message"
                    rows={10}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

              </div>
            </div>
            <div className="import-panel-footer">
              <button
                className="compose-send-btn"
                disabled={!anyChannel || !subject.trim() || !message.trim() || isSending}
                onClick={handleSend}
              >
                {isSending ? (
                  <><span className="import-btn-spinner import-btn-spinner--light" />Sending...</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2.667L7.333 9.333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2.667l-4.667 13.333-2.666-6-6-2.667L14 2.667z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Send to {recipientCount} families
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
