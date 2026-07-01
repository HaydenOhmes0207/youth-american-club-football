'use client';

import Modal from './Modal';
import Button from './Button';

interface ArchiveTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  seasonName: string;
  onConfirm: () => void;
}

export default function ArchiveTeamsModal({
  isOpen,
  onClose,
  selectedCount,
  seasonName,
  onConfirm,
}: ArchiveTeamsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archive Teams">
      <div className="form-content">
        <p className="form-description">
          Are you sure you would like to archive {selectedCount === 1 ? 'this team' : `these ${selectedCount} teams`} from the {seasonName} season?
        </p>

        <div className="form-actions">
          <Button
            buttonStyle="standard"
            buttonType="cancel"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            buttonStyle="standard"
            buttonType="primary"
            onClick={() => { onConfirm(); onClose(); }}
          >
            Archive {selectedCount === 1 ? 'Team' : 'Teams'}
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
