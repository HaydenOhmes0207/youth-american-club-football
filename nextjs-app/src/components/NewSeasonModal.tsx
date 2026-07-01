'use client';

import React from 'react';
import Modal from './Modal';

interface NewSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: () => void;
  onCreateNew: () => void;
}

export default function NewSeasonModal({ isOpen, onClose, onTransfer, onCreateNew }: NewSeasonModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How would you like to set up the new season?">
      <div className="new-season-cards">
        <button className="new-season-card" onClick={onTransfer}>
          <div className="new-season-card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.667 16h18.666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.333 8l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="new-season-card-title">Transfer Teams From Previous Season</h3>
          <p className="new-season-card-description">Copy your existing teams into the new season and carry over rosters, attributes, and settings.</p>
        </button>

        <button className="new-season-card" onClick={onCreateNew}>
          <div className="new-season-card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6.667v18.666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.667 16h18.666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="new-season-card-title">Create New Teams</h3>
          <p className="new-season-card-description">Start fresh and build your teams from scratch for the upcoming season.</p>
        </button>
      </div>

      <style jsx>{`
        .new-season-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--u-space-one, 16px);
          padding: var(--u-space-quarter, 4px) 0;
        }

        .new-season-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--u-space-three-quarter, 12px);
          padding: var(--u-space-one-and-half, 24px);
          background: var(--u-color-background-container, #fefefe);
          border: 1.5px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-large, 8px);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }

        .new-season-card:hover {
          border-color: var(--u-color-emphasis-foreground, #085bb4);
          background: var(--u-color-emphasis-background, #e7f3fd);
          box-shadow: 0 2px 8px rgba(2, 115, 227, 0.12);
        }

        .new-season-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--u-color-background-canvas, #eff0f0);
          border-radius: var(--u-border-radius-medium, 4px);
          color: var(--u-color-base-foreground, #36485c);
          flex-shrink: 0;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .new-season-card:hover .new-season-card-icon {
          background: var(--u-color-emphasis-background-hover, #c9e5f9);
          color: var(--u-color-emphasis-foreground-contrast, #0d3673);
        }

        .new-season-card-title {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-250, 16px);
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
          line-height: 1.3;
        }

        .new-season-card-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-default, 400);
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </Modal>
  );
}
