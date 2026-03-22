import React from 'react';
import { Calendar, Users, Home, Menu as MenuIcon, Settings, Clock } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'tables', label: 'Live Tables', icon: Users },
    { id: 'wait-status', label: 'Wait Status', icon: Clock },
    { id: 'staff', label: 'Staff Dashboard', icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-800">The Gourmet Grill</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}