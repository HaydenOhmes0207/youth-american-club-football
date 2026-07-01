'use client';

import React from 'react';
import Link from 'next/link';
import Button from './Button';

interface Tab {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface ActionButton {
  label: string;
  href?: string;
  icon?: string;
  isDisabled?: boolean;
  buttonStyle?: 'standard' | 'minimal';
  buttonType?: 'primary' | 'secondary' | 'subtle' | 'destroy' | 'confirm' | 'cancel' | 'dark';
  iconSvg?: React.ReactNode;
  onClick?: () => void;
}

interface Breadcrumb {
  label: string;
  href?: string;
}

type BadgeVariant = 'status-draft' | 'status-active' | 'status-archived' | 'tier-performance' | 'tier-free' | 'tier-none';

interface TitleBadge {
  label: string;
  variant: BadgeVariant;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  actions?: ActionButton[];
  breadcrumbs?: Breadcrumb[];
  titleBadges?: TitleBadge[];
  headerAvatar?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  tabs,
  actions,
  breadcrumbs,
  titleBadges,
  headerAvatar,
}: PageHeaderProps) {
  return (
    <>
      <style jsx>{`
        :global(.u-button--style-minimal.u-button--type-primary[href]) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 16px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          border-radius: 4px;
          border: 1px solid transparent;
          color: var(--u-color-emphasis-background-contrast, #0273e3);
          background-color: transparent;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }
        :global(.u-button--style-minimal.u-button--type-primary[href]:hover) {
          background-color: rgba(2, 115, 227, 0.08);
        }
        :global(.u-button--style-standard.u-button--type-primary[href]) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 16px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          border-radius: 4px;
          border: 1px solid transparent;
          background-color: var(--u-color-emphasis-background-contrast, #0273e3);
          color: var(--u-color-emphasis-foreground-reversed, #fefefe);
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }
        :global(.u-button--style-standard.u-button--type-primary[href]:hover) {
          background-color: #0363c0;
        }
        :global(.u-button--style-standard.u-button--type-secondary[href]) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 16px;
          font-family: var(--u-font-body);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          border-radius: 4px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          background-color: var(--u-color-base-background, #e0e1e1);
          color: var(--u-color-base-foreground, #36485c);
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }
        :global(.u-button--style-standard.u-button--type-secondary[href]:hover) {
          background-color: #d0d2d4;
        }
        .page-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
          width: 100%;
        }

        .page-header-top {
          display: flex;
          gap: 16px;
          align-items: center;
          width: 100%;
        }

        .page-header-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #1a2332;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .page-header-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 6px;
          justify-content: center;
          min-width: 0;
        }

        .page-header-title {
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-bold, 700);
          font-size: var(--u-font-size-plus-5, 32px);
          line-height: 1.2;
          letter-spacing: 0.25px;
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
        }

        .page-header-description {
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-default, 400);
          font-size: var(--u-font-size-minus-1, 14px);
          line-height: 1.4;
          color: var(--u-color-base-foreground-default, #36485c);
          margin: 0;
          flex-shrink: 0;
        }

        .page-header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }

        .action-button-inner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .action-button-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          filter: brightness(0) invert(1);
        }

        .page-header-tabs {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid var(--u-color-background-canvas, #eff0f0);
        }

        .page-header-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 16px;
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-medium, 500);
          font-size: var(--u-font-size-default, 16px);
          line-height: 1;
          color: var(--u-color-base-foreground-default, #36485c);
          cursor: pointer;
          border: none;
          background: transparent;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .page-header-tab:hover {
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .page-header-tab.active {
          color: var(--u-color-base-foreground-contrast, #071c31);
          border-bottom-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .page-header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .breadcrumb-link {
          color: var(--u-color-base-foreground-subtle, #607081);
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          color: var(--u-color-base-foreground, #36485c);
          text-decoration: underline;
        }

        .breadcrumb-separator {
          font-size: 10px;
          color: var(--u-color-base-foreground-subtle, #607081);
          user-select: none;
        }

        .breadcrumb-current {
          color: var(--u-color-base-foreground, #36485c);
          font-weight: 500;
        }

        .page-header-description-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .title-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 4px;
          font-family: var(--u-font-body);
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
        }

        .title-badge--status-draft { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground, #36485c); }
        .title-badge--status-active { background: #e8f3fe; color: #0273e3; }
        .title-badge--status-archived { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground-subtle, #607081); }
        .title-badge--tier-performance { background: #e8f0fe; color: #1a56db; }
        .title-badge--tier-free { background: #e8f5e9; color: #2e7d32; }
        .title-badge--tier-none { background: var(--u-color-background-default, #e8eaec); color: var(--u-color-base-foreground, #36485c); }
      `}</style>
      
      <div className="page-header">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-header-breadcrumbs">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="breadcrumb-separator">›</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                ) : (
                  <span className="breadcrumb-current">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="page-header-top">
          {headerAvatar && (
            <div className="page-header-avatar">{headerAvatar}</div>
          )}
          <div className="page-header-content">
            <h1 className="page-header-title">{title}</h1>
            {(description || (titleBadges && titleBadges.length > 0)) && (
              <div className="page-header-description-row">
                {description && <p className="page-header-description">{description}</p>}
                {titleBadges && titleBadges.map((badge, i) => (
                  <span key={i} className={`title-badge title-badge--${badge.variant}`}>{badge.label}</span>
                ))}
              </div>
            )}
          </div>
          
          {actions && actions.length > 0 && (
            <div className="page-header-actions">
              {actions.map((action, index) => (
                action.href && !action.isDisabled ? (
                  <Link key={index} href={action.href} className={[
                    'u-button',
                    `u-button--style-${action.buttonStyle || (index === actions.length - 1 ? 'standard' : 'minimal')}`,
                    `u-button--type-${action.buttonType || 'primary'}`,
                    'u-button--size-medium',
                  ].join(' ')}>
                    <span className="action-button-inner">
                      {action.icon && <img src={action.icon} alt="" className="action-button-icon" />}
                      {action.label}
                    </span>
                  </Link>
                ) : (
                  <Button
                    key={index}
                    buttonStyle={action.buttonStyle || (index === actions.length - 1 ? 'standard' : 'minimal')}
                    buttonType={action.buttonType || 'primary'}
                    size="medium"
                    isInactive={action.isDisabled}
                    onClick={action.onClick}
                  >
                    <span className="action-button-inner">
                      {action.iconSvg && action.iconSvg}
                      {action.icon && <img src={action.icon} alt="" className="action-button-icon" />}
                      {action.label}
                    </span>
                  </Button>
                )
              ))}
            </div>
          )}
        </div>
        
        {tabs && tabs.length > 0 && (
          <div className="page-header-tabs">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`page-header-tab ${tab.isActive ? 'active' : ''}`}
                onClick={tab.onClick}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
