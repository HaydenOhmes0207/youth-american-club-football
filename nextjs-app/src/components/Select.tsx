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

function SelectMenu({ options, value, onSelect, searchable, searchPlaceholder, searchQuery, onSearchChange }: {
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  return (
    <div className="select-menu" role="listbox">
      {searchable && (
        <div className="select-search">
          <SearchIcon />
          <input type="text" placeholder={searchPlaceholder || 'Search...'} value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus />
        </div>
      )}
      <div className="select-options">
        {filteredOptions.length === 0 ? (
          <div className="select-no-results">No results found</div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = value?.toLowerCase() === option.value.toLowerCase();
            return (
              <button key={option.value} className={`select-option ${isSelected ? 'select-option--selected' : ''}`} onClick={() => onSelect(option.value)} role="option" aria-selected={isSelected} type="button">
                <span className="select-option-label">{option.label}</span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function Select({ options, value, placeholder = 'Select...', onChange, disabled = false, fullWidth = false, searchable = false, searchPlaceholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchedOption = value ? options.find(o => o.value.toLowerCase() === value.toLowerCase()) : null;
  const selectedLabel = value ? (matchedOption?.label || value) : placeholder;
  const isPlaceholder = !value;

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }} ref={dropdownRef}>
      <button className={`select-trigger ${disabled ? 'select-trigger--disabled' : ''}`} onClick={() => !disabled && setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="listbox" disabled={disabled} type="button">
        <span className={`select-label ${isPlaceholder ? 'select-label--placeholder' : ''}`}>{selectedLabel}</span>
        <ChevronDownIcon />
      </button>
      {isOpen && !disabled && (
        <SelectMenu options={options} value={value} onSelect={handleSelect} searchable={searchable} searchPlaceholder={searchPlaceholder} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      )}
    </div>
  );
}
