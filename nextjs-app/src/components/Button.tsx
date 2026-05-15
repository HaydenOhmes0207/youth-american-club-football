'use client';

import React from 'react';

type ButtonStyle = 'standard' | 'minimal';
type ButtonType = 'primary' | 'secondary' | 'subtle' | 'destroy' | 'confirm' | 'cancel';
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
    <button className={classes} disabled={isInactive} {...rest}>
      {content}
    </button>
  );
};

export default Button;
