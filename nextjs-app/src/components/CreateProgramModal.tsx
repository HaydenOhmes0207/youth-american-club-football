'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { createProgram } from '@/lib/actions/programs';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProgramModal({ isOpen, onClose }: CreateProgramModalProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setError('Please enter a program title');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createProgram({ title: title.trim(), status });

    setIsSubmitting(false);

    if (result.success) {
      setTitle('');
      onClose();
    } else {
      setError(result.error || 'Failed to create program');
    }
  };

  const handleClose = () => {
    setTitle('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Program">
      <div className="form-content">
        <div className="form-field">
          <label htmlFor="program-title" className="form-label">
            Program Title
          </label>
          <input
            id="program-title"
            type="text"
            className={`form-input ${error ? 'form-input--error' : ''}`}
            placeholder="e.g., Fall 2026 Football Season"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
        </div>

        <div className="form-actions">
          <Button
            buttonStyle="standard"
            buttonType="secondary"
            onClick={() => handleSubmit('draft')}
            isInactive={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            buttonStyle="standard"
            buttonType="primary"
            onClick={() => handleSubmit('published')}
            isInactive={isSubmitting}
          >
            Publish
          </Button>
        </div>
      </div>

      <style jsx>{`
        .form-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one-and-half, 24px);
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .form-label {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .form-input {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground-contrast, #071c31);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          box-shadow: 0 0 0 3px rgba(2, 115, 227, 0.15);
        }

        .form-input::placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .form-input--error {
          border-color: var(--u-color-alert-foreground, #bb1700);
        }

        .form-input--error:focus {
          border-color: var(--u-color-alert-foreground, #bb1700);
          box-shadow: 0 0 0 3px rgba(187, 23, 0, 0.15);
        }

        .form-error {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-alert-foreground, #bb1700);
          margin: 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--u-space-half, 8px);
          padding-top: var(--u-space-half, 8px);
        }
      `}</style>
    </Modal>
  );
}
