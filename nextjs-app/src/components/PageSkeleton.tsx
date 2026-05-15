'use client';

export default function PageSkeleton() {
  return (
    <div className="page-skeleton">
      {/* Page Header skeleton */}
      <div className="skeleton-page-header">
        <div className="skeleton-header-top">
          <div className="skeleton-header-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description">
              <div className="skeleton-pill skeleton-pill--80"></div>
              <div className="skeleton-pill skeleton-pill--24"></div>
              <div className="skeleton-pill skeleton-pill--64"></div>
            </div>
          </div>
          <div className="skeleton-header-actions">
            <div className="skeleton-action-pill"></div>
          </div>
        </div>
        <div className="skeleton-tabs-container">
          <div className="skeleton-tab-pill"></div>
        </div>
      </div>

      {/* Content area */}
      <div className="skeleton-content">
        {/* Toolbar skeleton */}
        <div className="skeleton-toolbar">
          <div className="skeleton-toolbar-left">
            <div className="skeleton-segment"></div>
            <div className="skeleton-divider"></div>
            <div className="skeleton-segment"></div>
          </div>
          <div className="skeleton-toolbar-right">
            <div className="skeleton-segment"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-skeleton {
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          min-height: 0;
        }

        /* Page Header skeleton */
        .skeleton-page-header {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-three-quarter, 12px);
          padding: 0 0 var(--u-space-two, 32px) 0;
          background: var(--u-color-background-container, #fefefe);
          flex-shrink: 0;
          border-radius: var(--u-border-radius-large, 8px) var(--u-border-radius-large, 8px) 0 0;
        }

        .skeleton-header-top {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .skeleton-header-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .skeleton-title {
          width: 134px;
          height: 32px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-description {
          display: flex;
          gap: 4px;
        }

        .skeleton-pill {
          height: 16px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-pill--80 {
          width: 80px;
        }

        .skeleton-pill--24 {
          width: 24px;
        }

        .skeleton-pill--64 {
          width: 64px;
        }

        .skeleton-header-actions {
          display: flex;
          align-items: center;
        }

        .skeleton-action-pill {
          width: 80px;
          height: 32px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-tabs-container {
          display: flex;
          align-items: center;
          height: 50px;
          border-bottom: 1px solid var(--u-color-background-canvas, #eff0f0);
          margin: 0 calc(-1 * var(--u-space-two, 32px));
          padding: 0 var(--u-space-two, 32px);
        }

        .skeleton-tab-pill {
          width: 64px;
          height: 16px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        /* Content area */
        .skeleton-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--u-color-background-container, #fefefe);
          border-radius: 0 0 var(--u-border-radius-large, 8px) var(--u-border-radius-large, 8px);
        }

        /* Toolbar skeleton */
        .skeleton-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0 var(--u-space-two, 32px) 0;
          flex-shrink: 0;
        }

        .skeleton-toolbar-left {
          display: flex;
          align-items: center;
          gap: var(--u-space-three-quarter, 12px);
        }

        .skeleton-toolbar-right {
          display: flex;
          align-items: center;
        }

        .skeleton-segment {
          width: 80px;
          height: 40px;
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-divider {
          width: 1px;
          height: 40px;
          background: var(--u-color-line-subtle, #c4c6c8);
        }
      `}</style>
    </div>
  );
}
