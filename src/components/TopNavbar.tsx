import React from 'react';
import { Ship, Train, Plane, Building } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface TopNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ activeSection, onSectionChange }) => {
  const navItems: NavItem[] = [
    {
      icon: <Building size={24} />,
      label: 'Hotels'
    },
    {
      icon: <Plane size={24} />,
      label: 'Flights'
    },
    {
      icon: <Ship size={24} />,
      label: 'Cruises'
    },
    {
      icon: <Train size={24} />,
      label: 'Trains'
    }
  ];

  const handleSectionClick = (label: string) => {
    if (label === 'Flights' || label === 'Trains') {
      // Show coming soon message for unimplemented sections
      alert(`${label} booking feature is coming soon! Currently available: Cruises and Hotels.`);
      return;
    }
    onSectionChange(label);
  };
  return (
    <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSectionClick(item.label)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200
                ${activeSection === item.label 
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white/30 text-gray-700 hover:bg-white/50 hover:shadow-md hover:scale-102'
                }
              `}
            >
              <div className={`
                ${activeSection === item.label ? 'text-white' : 'text-blue-600'}
              `}>
                {item.icon}
              </div>
              <span className={`
                text-sm font-medium
                ${activeSection === item.label ? 'text-white' : 'text-gray-700'}
              `}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;