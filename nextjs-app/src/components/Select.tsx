'use client';

import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface SelectMenuProps {
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function SelectMenu({ options, value, onSelect, searchable, searchPlaceholder, searchQuery, onSearchChange }: SelectMenuProps) {
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  return (
    <div className="select-menu" role="listbox">
      {searchable && (
        <div className="select-search">
          <SearchIcon />
          <input
            type="text"
            placeholder={searchPlaceholder || 'Search...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>
      )}
      <div className="select-options">
        {filteredOptions.length === 0 ? (
          <div className="select-no-results">No results found</div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = value?.toLowerCase() === option.value.toLowerCase();
            return (
              <button
                key={option.value}
                className={`select-option ${isSelected ? 'select-option--selected' : ''}`}
                onClick={() => onSelect(option.value)}
                role="option"
                aria-selected={isSelected}
                type="button"
              >
                <span className="select-option-label">{option.label}</span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })
        )}
      </div>
      <style jsx>{`
        .select-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 100%;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 100;
          overflow: hidden;
        }

        .select-search {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          padding: var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .select-search input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
        }

        .select-search input::placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .select-options {
          max-height: 160px;
          overflow-y: auto;
        }

        .select-no-results {
          padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground-subtle, #607081);
          text-align: center;
        }

        .select-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
          border: none;
          background: transparent;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .select-option:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .select-option--selected {
          color: var(--u-color-emphasis-background-contrast, #0273e3);
          font-weight: var(--u-font-weight-medium, 500);
        }

        .select-option-label {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

export default function Select({ options, value, placeholder = 'Select...', onChange, disabled = false, fullWidth = false, searchable = false, searchPlaceholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery(''); // Clear search when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Case-insensitive matching for better compatibility
  const matchedOption = value 
    ? options.find(o => o.value.toLowerCase() === value.toLowerCase())
    : null;
  const selectedLabel = value 
    ? (matchedOption?.label || value)
    : placeholder;
  const isPlaceholder = !value;

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setIsOpen(false);
    setSearchQuery(''); // Clear search after selection
  };

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }} ref={dropdownRef}>
      <button 
        className={`select-trigger ${disabled ? 'select-trigger--disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        type="button"
      >
        <span className={`select-label ${isPlaceholder ? 'select-label--placeholder' : ''}`}>{selectedLabel}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && !disabled && (
        <SelectMenu 
          options={options}
          value={value}
          onSelect={handleSelect}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <style jsx>{`
        .select-trigger {
          display: flex;
          align-items: center;
          gap: var(--u-space-one, 16px);
          height: 40px;
          padding: 0 var(--u-space-one, 16px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          min-width: 205px;
          width: 100%;
        }

        .select-trigger:hover:not(.select-trigger--disabled) {
          background: var(--u-color-background-subtle, #f5f6f7);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }

        .select-trigger--disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .select-label {
          flex: 1;
          text-align: left;
        }

        .select-label--placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }
      `}</style>
    </div>
  );
}
