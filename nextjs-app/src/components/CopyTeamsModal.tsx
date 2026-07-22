'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Select from './Select';
import Icon from './Icon';
import { copyTeams, type Season, type TeamWithStats } from '@/lib/actions/teams';
import { useToast } from './Toast';

interface CopyTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamIds: string[];
  sourceSeasonId: string;
  seasons: Season[];
  onSuccess?: (newTeams: TeamWithStats[]) => void;
  defaultTargetSeasonId?: string;
}

interface CopyOptions {
  name: boolean;
  avatar: boolean;
  sport: boolean;
  gender: boolean;
  grade: boolean;
}

export default function CopyTeamsModal({
  isOpen,
  onClose,
  selectedTeamIds,
  sourceSeasonId,
  seasons,
  onSuccess,
  defaultTargetSeasonId,
}: CopyTeamsModalProps) {
  const { showToast } = useToast();
  const [targetSeasonId, setTargetSeasonId] = useState('');
  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
    name: true,
    avatar: true,
    sport: true,
    gender: true,
    grade: true,
  });
  const [includeAthletes, setIncludeAthletes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Allow all seasons including the current season
  const availableSeasons = seasons;

  useEffect(() => {
    if (isOpen) {
      if (defaultTargetSeasonId) {
        setTargetSeasonId(defaultTargetSeasonId);
      } else {
        // Default to the next season after the source, so transfers land in a future season
        const sourceIdx = seasons.findIndex(s => s.id === sourceSeasonId);
        const nextSeason = sourceIdx >= 0 ? seasons[sourceIdx + 1] : undefined;
        const fallback = seasons.find(s => s.id !== sourceSeasonId);
        setTargetSeasonId((nextSeason ?? fallback)?.id ?? sourceSeasonId);
      }
    }
  }, [isOpen, sourceSeasonId, seasons, defaultTargetSeasonId]);

  const handleSubmit = async () => {
    if (!targetSeasonId) {
      setError('Please select a destination season');
      return;
    }

    if (selectedTeamIds.length === 0) {
      setError('No teams selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await copyTeams({
      sourceTeamIds: selectedTeamIds,
      targetSeasonId,
      copyOptions,
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast(`Successfully transferred ${selectedTeamIds.length} ${selectedTeamIds.length === 1 ? 'team' : 'teams'} to new season`, 'success');
      if (result.teams && onSuccess) {
        onSuccess(result.teams);
      }
      onClose();
    } else {
      setError(result.error || 'Failed to copy teams');
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const seasonOptions = availableSeasons.map(s => ({
    value: s.id,
    label: `${s.name} Season`,
  }));

  const handleOptionChange = (key: keyof CopyOptions) => {
    setCopyOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  function AttributeCheckbox({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean; 
    onChange: () => void;
    label: string;
  }) {
    return (
      <label className="attribute-option">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={isSubmitting}
          className="attribute-checkbox-input"
        />
        <Icon
          src={checked ? '/icons/checkbox-filled.svg' : '/icons/checkbox-empty.svg'}
          alt={checked ? 'Checked' : 'Unchecked'}
          width={16}
          height={16}
          className="attribute-checkbox-icon"
        />
        <span>{label}</span>
        <style jsx>{`
          .attribute-option {
            display: flex;
            align-items: center;
            gap: var(--u-space-half, 8px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground, #36485c);
            cursor: pointer;
          }

          .attribute-checkbox-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
          }

          .attribute-checkbox-icon {
            display: block;
            flex-shrink: 0;
            transition: opacity 0.15s ease;
          }

          .attribute-option:hover .attribute-checkbox-icon {
            opacity: 0.8;
          }

          .attribute-option span {
            line-height: 1.5;
          }
        `}</style>
      </label>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Transfer to New Season">
      <div className="form-content">
        <div className="form-field">
          <label className="form-label">Select Season</label>
          <Select
            options={seasonOptions}
            value={targetSeasonId}
            placeholder="Select season"
            onChange={setTargetSeasonId}
            disabled={isSubmitting}
          />
          <p className="form-helper-text">
            Select the destination season for these teams
          </p>
        </div>

        <div className="form-field">
          <label className="form-label">What attributes do you want to copy about each team?</label>
          <div className="attribute-options">
            <AttributeCheckbox
              checked={copyOptions.name}
              onChange={() => handleOptionChange('name')}
              label="Name"
            />
            <AttributeCheckbox
              checked={copyOptions.avatar}
              onChange={() => handleOptionChange('avatar')}
              label="Avatar"
            />
            <AttributeCheckbox
              checked={copyOptions.sport}
              onChange={() => handleOptionChange('sport')}
              label="Sport"
            />
            <AttributeCheckbox
              checked={copyOptions.gender}
              onChange={() => handleOptionChange('gender')}
              label="Gender"
            />
            <AttributeCheckbox
              checked={copyOptions.grade}
              onChange={() => handleOptionChange('grade')}
              label="Grade"
            />
          </div>
        </div>

        <div className="toggle-field">
          <div className="toggle-label-group">
            <span className="toggle-label">Include Athletes</span>
            <span className="toggle-description">Carry over each team's roster into the new season</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={includeAthletes}
            onClick={() => setIncludeAthletes(prev => !prev)}
            disabled={isSubmitting}
            className={`toggle-switch ${includeAthletes ? 'toggle-switch--on' : ''}`}
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <Button
            buttonStyle="standard"
            buttonType="cancel"
            onClick={handleClose}
            isInactive={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            buttonStyle="standard"
            buttonType="primary"
            onClick={handleSubmit}
            isInactive={isSubmitting || !targetSeasonId}
          >
            {isSubmitting ? 'Transferring...' : `Transfer ${selectedTeamIds.length} ${selectedTeamIds.length === 1 ? 'Team' : 'Teams'}`}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .form-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one-and-quarter, 20px);
        }

        .form-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.5;
          margin: 0;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .form-label {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          font-weight: var(--u-font-weight-default, 400);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .form-helper-text {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-micro, 12px);
          font-weight: var(--u-font-weight-default, 400);
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
        }

        .attribute-options {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .form-error {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-alert-foreground, #bb1700);
          margin: 0;
        }

        .toggle-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--u-space-one, 16px);
        }

        .toggle-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-label {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          font-weight: var(--u-font-weight-default, 400);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .toggle-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
        }

        .toggle-switch {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 44px;
          height: 24px;
          border-radius: 12px;
          border: none;
          background: var(--u-color-base-foreground-subtle, #607081);
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s ease;
          padding: 0;
        }

        .toggle-switch--on {
          background: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .toggle-switch:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle-thumb {
          position: absolute;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .toggle-switch--on .toggle-thumb {
          transform: translateX(20px);
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
