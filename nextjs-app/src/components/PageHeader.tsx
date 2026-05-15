import React from 'react';
import Button from './Button';

interface Tab {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface ActionButton {
  label: string;
  buttonStyle?: 'standard' | 'minimal';
  buttonType?: 'primary' | 'secondary' | 'subtle' | 'destroy' | 'confirm' | 'cancel';
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  actions?: ActionButton[];
}

export default function PageHeader({ 
  title, 
  description, 
  tabs, 
  actions 
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <div className="page-header-content">
          <h1 className="page-header-title">{title}</h1>
          {description && (
            <p className="page-header-description">{description}</p>
          )}
        </div>
        
        {actions && actions.length > 0 && (
          <div className="page-header-actions">
            {actions.map((action, index) => (
              <Button
                key={index}
                buttonStyle={action.buttonStyle || (index === actions.length - 1 ? 'standard' : 'minimal')}
                buttonType={action.buttonType || 'primary'}
                size="medium"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
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
  );
}
