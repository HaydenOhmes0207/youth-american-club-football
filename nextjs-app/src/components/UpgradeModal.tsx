'use client';

import Modal from './Modal';
import Button from './Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_FEATURES = [
  'Team messaging',
  'Calendar & scheduling',
  'Roster management',
  'Family notifications',
];

const PERFORMANCE_FEATURES = [
  'Everything in Free',
  'Video upload & playback',
  'Stats & performance tracking',
  'Advanced analytics',
  'Highlight creation',
];

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Performance">
      <div className="upgrade-modal">
        <p className="upgrade-description">
          Your teams are on the Free tier. Upgrading to Performance unlocks video, stats, and advanced tools — no re-provisioning required.
        </p>

        <div className="upgrade-tiers">
          <div className="tier-card tier-card--free">
            <div className="tier-card-header">
              <span className="tier-badge tier-badge--free">Free</span>
              <span className="tier-price">$0</span>
            </div>
            <ul className="tier-features">
              {FREE_FEATURES.map(f => (
                <li key={f} className="tier-feature">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="tier-card tier-card--performance">
            <div className="tier-card-header">
              <span className="tier-badge tier-badge--performance">Performance</span>
              <span className="tier-price">Contact CSM</span>
            </div>
            <ul className="tier-features">
              {PERFORMANCE_FEATURES.map(f => (
                <li key={f} className="tier-feature">
                  <CheckIcon color="#1a56db" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="upgrade-footer">
          <p className="upgrade-footer-note">Your CSM will be in touch to discuss pricing and next steps.</p>
          <div className="upgrade-actions">
            <Button buttonStyle="standard" buttonType="cancel" size="medium" onClick={onClose}>
              Maybe Later
            </Button>
            <Button buttonStyle="standard" buttonType="primary" size="medium" onClick={onClose}>
              Contact My CSM
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .upgrade-modal {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one-and-half, 24px);
        }

        .upgrade-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
          line-height: 1.5;
        }

        .upgrade-tiers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--u-space-one, 16px);
        }

        .tier-card {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          padding: var(--u-space-one, 16px);
          border-radius: var(--u-border-radius-medium, 4px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .tier-card--performance {
          border-color: #1a56db;
          background: #f5f8ff;
        }

        .tier-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .tier-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .tier-badge--free {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .tier-badge--performance {
          background: #e8f0fe;
          color: #1a56db;
        }

        .tier-price {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          font-weight: 600;
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .tier-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .tier-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-base-foreground, #36485c);
        }

        .upgrade-footer {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          padding-top: var(--u-space-one, 16px);
          border-top: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .upgrade-footer-note {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-base-foreground-subtle, #607081);
          margin: 0;
        }

        .upgrade-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--u-space-half, 8px);
        }
      `}</style>
    </Modal>
  );
}

function CheckIcon({ color = '#2e7d32' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
