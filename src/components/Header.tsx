import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: 'register' | 'manage';
  setActiveTab: (tab: 'register' | 'manage') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-xl font-semibold text-gray-800">Birthday Reminder</span>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                activeTab === 'register'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span>Register</span>
            </button>
            
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                activeTab === 'manage'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              <span>Manage</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;