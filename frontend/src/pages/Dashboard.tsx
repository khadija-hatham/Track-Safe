import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ViolationsTable from './dashboard/ViolationsTable';
import StatisticsPage from './dashboard/StatisticsPage';
import SettingsPage from './dashboard/SettingsPage';
import DashboardHome from './dashboard/DashboardHome';
import { ViolationsProvider } from '../contexts/ViolationsContext';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path.includes('/violations')) return 'Safety Violations';
    if (path.includes('/statistics')) return 'Statistics & Reports';
    if (path.includes('/settings')) return 'System Settings';
    return 'Dashboard';
  };

  // If the route doesn't match any existing routes, redirect to the dashboard home
  React.useEffect(() => {
    const validRoutes = [
      '/dashboard',
      '/dashboard/violations',
      '/dashboard/statistics',
      '/dashboard/settings'
    ];
    
    if (!validRoutes.some(route => location.pathname === route)) {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate]);

  return (
    <ViolationsProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:block md:w-64 lg:w-72 flex-shrink-0 h-full overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            title={getPageTitle()}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/violations" element={<ViolationsTable />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ViolationsProvider>
  );
};

export default Dashboard;