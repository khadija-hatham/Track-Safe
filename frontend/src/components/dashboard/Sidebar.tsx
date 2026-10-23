import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Table, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Violations', path: '/dashboard/violations', icon: <Table size={20} /> },
    { name: 'Statistics', path: '/dashboard/statistics', icon: <BarChart2 size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"
              fill="currentColor"
            />
            <path d="M10 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path 
              d="M6.87 10h10.26a2 2 0 0 1 1.98 1.7l.84 5.9a2 2 0 0 1-1.01 2.04 11.87 11.87 0 0 1-11.93 0a2 2 0 0 1-1.01-2.04l.84-5.9a2 2 0 0 1 1.98-1.7z"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <div className="ml-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Track Safe</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.factoryName}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive 
                ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
              transition-colors duration-200
            `}
            end={item.path === '/dashboard'}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
        
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;