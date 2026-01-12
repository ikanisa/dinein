import React from 'react';

interface VendorNavTabsProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { key: 'orders', label: 'Orders', icon: '🔔' },
  { key: 'menu', label: 'Menu', icon: '🍔' },
  { key: 'tables', label: 'Tables', icon: '🏁' },
  { key: 'reservations', label: 'Bookings', icon: '📅' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export const VendorNavTabs: React.FC<VendorNavTabsProps> = ({ activeTab, onNavigate }) => {
  return (
    <div className="flex bg-surface border-b border-border sticky top-0 z-40 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onNavigate(tab.key)}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 
        ${activeTab === tab.key ? 'border-primary-500 text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          <span className="text-lg block mb-1">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};
