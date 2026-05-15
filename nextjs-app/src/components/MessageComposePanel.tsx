'use client';

import React, { useState } from 'react';
import type { Registrant } from './ProgramDetailView';

export interface MessagePayload {
  subject: string;
  message: string;
  channels: { email: boolean; sms: boolean; push: boolean };
  recipientCount: number;
  programTitle: string;
  sentBy: string;
}

interface MessageComposePanelProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Registrant[];
  programTitle: string;
  senderName: string;
  onSend: (payload: MessagePayload) => void;
}

export default function MessageComposePanel({
  isOpen,
  onClose,
  recipients,
  programTitle,
  senderName,
  onSend,
}: MessageComposePanelProps) {
  const [subject, setSubject] = useState(`${programTitle} - What to Bring`);
  const [message, setMessage] = useState(
    `Hi families,\n\nJust a quick reminder about what your athlete needs to bring to ${programTitle}:\n\n` +
    `- Turf shoes (no metal cleats)\n` +
    `- Helmet (properly fitted)\n` +
    `- Water bottle (labeled with name)\n\n` +
    `Also, please make sure to RSVP in the app so we have an accurate headcount.\n\n` +
    `See you there!\n${senderName}`
  );
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const anyChannel = channelEmail || channelSms || channelPush;
  const uniqueEmails = new Set(recipients.map(r => r.parentEmail));

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onSend({
        subject,
        message,
        channels: { email: channelEmail, sms: channelSms, push: channelPush },
        recipientCount: uniqueEmails.size,
        programTitle,
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
          <h2 className="import-panel-title">Send Message</h2>
          <button className="import-panel-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="import-panel-body-wrapper">
          <div className="import-panel-pane">
            <div className="import-panel-body">
              <div className="compose-form">

                {/* From */}
                <div className="closure-review-section">
                  <div className="closure-section-label">From</div>
                  <div className="compose-field-value">{senderName}</div>
                </div>

                {/* Recipients */}
                <div className="closure-review-section">
                  <div className="closure-section-label">Recipients</div>
                  <div className="compose-recipients-info">
                    <span className="compose-recipients-count">{uniqueEmails.size} families</span>
                    <span className="compose-recipients-program">{programTitle}</span>
                  </div>
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
                Send to {uniqueEmails.size} families
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
