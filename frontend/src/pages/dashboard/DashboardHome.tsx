import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, BarChart2, AlertTriangle, Settings } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useViolations } from '../../contexts/ViolationsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { formatDistanceToNow } from 'date-fns';

const DashboardHome: React.FC = () => {
  const { stats, pendingViolations } = useViolations();
  const { user } = useAuth();
  const { deductionMode } = useSettings();
  const navigate = useNavigate();

  // Get recent violations (up to 3)
  const recentViolations = pendingViolations.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Here's what's happening with safety compliance at {user?.factoryName}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => navigate('/dashboard/violations')}>
                View All Violations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/40 border border-primary-200 dark:border-primary-800">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <AlertTriangle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Total Violations</p>
              <h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {stats.deductedCount + stats.ignoredCount + pendingViolations.length}
              </h4>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/40 dark:to-danger-800/40 border border-danger-200 dark:border-danger-800">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-danger-500/10 text-danger-600 dark:text-danger-400">
              <HardHat size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-danger-600 dark:text-danger-400">Pending Actions</p>
              <h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {pendingViolations.length}
              </h4>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/40 dark:to-success-800/40 border border-success-200 dark:border-success-800">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-success-500/10 text-success-600 dark:text-success-400">
              <BarChart2 size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-success-600 dark:text-success-400">Total Deductions</p>
              <h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalDeductions.toLocaleString()} EGP
              </h4>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/40 dark:to-warning-800/40 border border-warning-200 dark:border-warning-800">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-warning-500/10 text-warning-600 dark:text-warning-400">
              <Settings size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-warning-600 dark:text-warning-400">Deduction Mode</p>
              <h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {deductionMode.replace('-', ' ')}
              </h4>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Violations */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Violations
        </h3>
        
        {recentViolations.length > 0 ? (
          <div className="space-y-4">
            {recentViolations.map((violation) => (
              <div 
                key={violation.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800 dark:bg-danger-800/30 dark:text-danger-300">
                        {violation.violationType}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(violation.violationTime), { addSuffix: true })}
                      </span>
                    </div>
                    <h4 className="mt-1 font-medium text-gray-900 dark:text-white">
                      {violation.employeeName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {violation.employeePosition}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => navigate('/dashboard/violations')}
                    >
                      Deduct {(violation.salaryBeforeDeduction * 0.05).toLocaleString()} EGP
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate('/dashboard/violations')}
                    >
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                <HardHat size={32} />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">No pending violations</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                All safety violations have been processed
              </p>
            </div>
          </Card>
        )}
      </section>

      {/* Quick Links */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/violations')}>
            <div className="flex flex-col items-center text-center p-4">
              <AlertTriangle size={32} className="text-primary-600 dark:text-primary-400 mb-3" />
              <h4 className="font-medium text-gray-900 dark:text-white">Manage Violations</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and process safety violations
              </p>
            </div>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/statistics')}>
            <div className="flex flex-col items-center text-center p-4">
              <BarChart2 size={32} className="text-primary-600 dark:text-primary-400 mb-3" />
              <h4 className="font-medium text-gray-900 dark:text-white">View Statistics</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Analyze safety compliance data
              </p>
            </div>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/settings')}>
            <div className="flex flex-col items-center text-center p-4">
              <Settings size={32} className="text-primary-600 dark:text-primary-400 mb-3" />
              <h4 className="font-medium text-gray-900 dark:text-white">Configure Settings</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Adjust system preferences
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;