'use client';

export default function Loading() {
  return (
    <div className="manage-loading">
      {/* Header bar with skeleton elements */}
      <div className="skeleton-header">
        <div className="skeleton-back"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-action"></div>
      </div>

      {/* Large empty content area */}
      <div className="skeleton-content"></div>

      <style jsx>{`
        .manage-loading {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: var(--u-color-background-canvas, #eff0f0);
          padding: var(--u-space-half, 8px);
          gap: var(--u-space-half, 8px);
        }

        /* Header bar */
        .skeleton-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
          flex-shrink: 0;
        }

        .skeleton-back {
          width: 48px;
          height: 20px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-title {
          width: 64px;
          height: 20px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-action {
          width: 48px;
          height: 20px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        /* Content area fills remaining space */
        .skeleton-content {
          flex: 1;
          background: var(--u-color-background-container, #fefefe);
          border-radius: var(--u-border-radius-large, 8px);
        }
      `}</style>
    </div>
  );
}
