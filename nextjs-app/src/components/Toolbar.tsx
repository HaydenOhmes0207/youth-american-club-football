'use client';

import { useState } from 'react';
import Select from './Select';
import Icon from './Icon';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentConfig {
  placeholder: string;
  options: SegmentOption[];
  value?: string;
  onChange?: (value: string) => void;
}

interface ToolbarProps {
  segments?: SegmentConfig[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onExport?: () => void;
  showFilter?: boolean;
  showExport?: boolean;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Toolbar({
  segments = [],
  onSearch,
  searchPlaceholder = 'Search for...',
  onFilter,
  onExport,
  showFilter = true,
  showExport = true,
}: ToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {showFilter && (
          <>
            <button className="toolbar-icon-btn" onClick={onFilter} aria-label="Filter">
              <Icon src="/icons/filter.svg" alt="Filter" width={20} height={20} />
            </button>
            <div className="toolbar-divider" />
          </>
        )}
        <div className="toolbar-segments">
          {segments.map((segment, index) => (
            <Select key={index} options={segment.options} value={segment.value} placeholder={segment.placeholder} onChange={segment.onChange} />
          ))}
        </div>
      </div>
      <div className="toolbar-right">
        <div className="search-input">
          <SearchIcon />
          <input type="text" placeholder={searchPlaceholder} value={searchQuery} onChange={handleSearchChange} />
        </div>
        {showExport && (
          <button className="toolbar-icon-btn" onClick={onExport} aria-label="Export">
            <Icon src="/icons/download.svg" alt="Download" width={20} height={20} />
          </button>
        )}
      </div>
    </div>
  );
}
