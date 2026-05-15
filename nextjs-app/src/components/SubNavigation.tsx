'use client';

import React from 'react';

interface SubNavItemProps {
  className?: string;
  label: string;
  active?: boolean;
  hasPill?: boolean;
  pillText?: string;
  onClick?: () => void;
}

const SubNavItem: React.FC<SubNavItemProps> = ({
  className = '',
  label,
  active = false,
  hasPill = false,
  pillText = '',
  onClick,
}) => {
  const classes = [
    'subnav-item',
    active && 'subnav-item--active',
    hasPill && 'subnav-item--has-pill',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
    >
      <span className="subnav-item-label">{label}</span>
      {hasPill && pillText ? (
        <span className="subnav-item-pill">{pillText}</span>
      ) : null}
    </button>
  );
};

export default SubNavItem;
