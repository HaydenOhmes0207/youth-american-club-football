'use client';

export default function Loading() {
  return (
    <div className="assignments-loading">
      <div className="content-container">
        <div className="content-inner">
          {/* View Header with skeleton pills */}
          <div className="skeleton-header">
            <div className="skeleton-header-left">
              <div className="skeleton-pill skeleton-pill--80"></div>
            </div>
            <div className="skeleton-header-center">
              <div className="skeleton-pill skeleton-pill--64 skeleton-pill--small"></div>
            </div>
            <div className="skeleton-header-right">
              <div className="skeleton-pill skeleton-pill--80"></div>
            </div>
          </div>

          {/* 3-column layout */}
          <div className="skeleton-layout">
            <div className="skeleton-rail skeleton-rail--left"></div>
            <div className="skeleton-main"></div>
            <div className="skeleton-rail skeleton-rail--right"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .assignments-loading {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          background: var(--u-color-background-canvas, #eff0f0);
          border-radius: 16px;
          overflow: hidden;
        }

        .content-container {
          width: 100%;
          height: 100%;
          background: var(--u-color-background-container, #fefefe);
        }

        .content-inner {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          height: 100%;
          padding: var(--u-space-three-quarter, 12px);
          background: var(--u-color-background-callout, #f8f8f9);
        }

        /* View Header */
        .skeleton-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          width: 100%;
          flex-shrink: 0;
        }

        .skeleton-header-left,
        .skeleton-header-right {
          display: flex;
          align-items: center;
        }

        .skeleton-header-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .skeleton-pill {
          background: rgba(89, 107, 125, 0.15);
          border-radius: var(--u-border-radius-large, 4px);
        }

        .skeleton-pill--80 {
          width: 80px;
          height: 32px;
        }

        .skeleton-pill--64 {
          width: 64px;
        }

        .skeleton-pill--small {
          height: 16px;
        }

        /* 3-column layout */
        .skeleton-layout {
          flex: 1;
          display: flex;
          gap: var(--u-space-quarter, 4px);
          min-height: 0;
        }

        .skeleton-rail {
          width: 320px;
          flex-shrink: 0;
          background: var(--u-color-background-container, #fefefe);
          border-radius: var(--u-border-radius-large, 4px);
          padding: var(--u-space-one, 16px);
        }

        .skeleton-main {
          flex: 1;
          background: var(--u-color-background-container, #fefefe);
          border-radius: var(--u-border-radius-large, 4px);
          min-width: 0;
        }
      `}</style>
    </div>
  );
}
