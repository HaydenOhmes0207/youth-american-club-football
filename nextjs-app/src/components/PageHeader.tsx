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

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  actions?: ActionButton[];
  breadcrumb?: BreadcrumbItem[];
}

export default function PageHeader({ 
  title, 
  description, 
  tabs, 
  actions,
  breadcrumb
}: PageHeaderProps) {
  return (
    <div className="page-header">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="page-header-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="page-header-breadcrumb-sep">/</span>}
              {item.onClick ? (
                <button className="page-header-breadcrumb-link" onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span className="page-header-breadcrumb-text">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
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
