'use client';

import React from 'react';

type ButtonStyle = 'standard' | 'minimal';
type ButtonType = 'primary' | 'secondary' | 'subtle' | 'destroy' | 'confirm' | 'cancel' | 'dark';
type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';
type IconAlignment = 'none' | 'left' | 'right' | 'icon only';
type ButtonStatus = 'none' | 'spinning' | 'failure' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  label?: string;
  buttonStyle?: ButtonStyle;
  buttonType?: ButtonType;
  size?: ButtonSize;
  iconAlignment?: IconAlignment;
  isInactive?: boolean;
  status?: ButtonStatus;
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  children,
  label,
  buttonStyle = 'standard',
  buttonType = 'primary',
  size = 'medium',
  iconAlignment = 'none',
  isInactive = false,
  status = 'none',
  ...rest
}) => {
  const isIconOnly = iconAlignment === 'icon only';

  const classes = [
    'u-button',
    `u-button--style-${buttonStyle}`,
    `u-button--type-${buttonType}`,
    `u-button--size-${size}`,
    isIconOnly ? 'u-button--icon-only' : '',
    isInactive ? 'u-button--inactive' : '',
    status !== 'none' ? `u-button--status-${status}` : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const content = children || label;

  return (
    <>
      <style jsx>{`
        .u-button {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-small, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          line-height: 1.4;
          border-radius: var(--u-border-radius-medium, 4px);
          padding: 0 var(--u-space-one, 16px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid transparent;
          background-color: transparent;
          color: var(--u-color-base-foreground, #36485c);
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
          white-space: nowrap;
          text-decoration: none;
        }

        .u-button--size-large {
          height: 48px;
          padding-inline: var(--u-space-one-and-half, 24px);
        }

        .u-button--size-medium {
          height: 40px;
          padding-inline: var(--u-space-one, 16px);
        }

        .u-button--size-small {
          height: 32px;
          padding-inline: var(--u-space-three-quarter, 12px);
        }

        .u-button--size-xsmall {
          height: 24px;
          padding-inline: var(--u-space-half, 8px);
        }

        .u-button--icon-only {
          padding-inline: 0;
          width: auto;
          aspect-ratio: 1 / 1;
        }

        /* STANDARD: SOLID BUTTONS */
        .u-button--style-standard.u-button--type-primary {
          background-color: var(--u-color-emphasis-background-contrast, #0273e3);
          color: var(--u-color-emphasis-foreground-reversed, #fefefe);
          border-color: transparent;
        }

        .u-button--style-standard.u-button--type-secondary {
          background-color: var(--u-color-base-background, #e0e1e1);
          color: var(--u-color-base-foreground, #36485c);
          border-color: var(--u-color-line-subtle, #c4c6c8);
        }

        .u-button--style-standard.u-button--type-subtle {
          background-color: var(--u-color-background-subtle, #f5f6f7);
          color: var(--u-color-base-foreground, #36485c);
          border-color: var(--u-color-line-subtle, #c4c6c8);
        }

        .u-button--style-standard.u-button--type-destroy {
          background-color: var(--u-color-alert-background, #fef0ee);
          color: var(--u-color-alert-foreground, #bb1700);
          border-color: transparent;
        }

        .u-button--style-standard.u-button--type-confirm {
          background-color: var(--u-color-success-foreground, #2e7d32);
          color: var(--u-color-emphasis-foreground-reversed, #fefefe);
          border-color: transparent;
        }

        .u-button--style-standard.u-button--type-cancel {
          background-color: var(--u-color-background-default, #e8eaec);
          color: var(--u-color-base-foreground, #36485c);
          border-color: var(--u-color-line-subtle, #c4c6c8);
        }

        .u-button--style-standard.u-button--type-dark {
          background-color: #4a5568;
          color: #fefefe;
          border-color: transparent;
        }

        .u-button--style-standard.u-button--type-dark:not(.u-button--inactive):hover {
          background-color: #38434f;
        }

        /* MINIMAL: TEXT / GHOST BUTTONS */
        .u-button--style-minimal.u-button--type-primary {
          color: var(--u-color-emphasis-background-contrast, #0273e3);
          background-color: transparent;
        }

        .u-button--style-minimal.u-button--type-secondary {
          color: var(--u-color-base-foreground, #36485c);
          background-color: transparent;
        }

        .u-button--style-minimal.u-button--type-subtle {
          color: var(--u-color-base-background-contrast, #607081);
          background-color: transparent;
        }

        .u-button--style-minimal.u-button--type-destroy {
          color: var(--u-color-alert-foreground, #bb1700);
          background-color: transparent;
        }

        .u-button--style-minimal.u-button--type-confirm {
          color: var(--u-color-success-foreground, #2e7d32);
          background-color: transparent;
        }

        .u-button--style-minimal.u-button--type-cancel {
          color: var(--u-color-base-foreground-subtle, #6c757d);
          background-color: transparent;
        }

        /* HOVER STATES */
        .u-button:not(.u-button--inactive):hover {
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        .u-button--style-standard.u-button--type-primary:not(.u-button--inactive):hover {
          background-color: #0363c0;
        }

        .u-button--style-minimal.u-button--type-primary:not(.u-button--inactive):hover {
          background-color: rgba(2, 115, 227, 0.08);
        }

        /* INACTIVE / DISABLED */
        .u-button--inactive {
          opacity: 0.45;
          cursor: default;
          pointer-events: none;
        }

        /* STATUS STATES */
        .u-button--status-failure {
          border-color: var(--u-color-alert-foreground, #bb1700);
        }

        .u-button--status-success {
          border-color: var(--u-color-success-foreground, #2e7d32);
        }
      `}</style>
      <button className={classes} disabled={isInactive} {...rest}>
        {content}
      </button>
    </>
  );
};

export default Button;
