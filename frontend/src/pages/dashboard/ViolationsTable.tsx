import React, { useState } from 'react';
import { useViolations, Violation } from '../../contexts/ViolationsContext';
import { useSettings } from '../../contexts/SettingsContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';

const ViolationsTable: React.FC = () => {
  const { pendingViolations, handleDeduction, handleIgnore } = useViolations();
  const { deductionMode, deductionPrices, timeFormat } = useSettings();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');
  const { violations } = useViolations();

  // Format time based on settings
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return timeFormat === '12h' 
        ? format(date, 'MMM d, yyyy h:mm a')
        : format(date, 'MMM d, yyyy HH:mm');
    } catch (error) {
      return dateStr;
    }
  };

  // Handle action based on deduction mode
  const canTakeAction = deductionMode === 'manual';

  const renderViolationRow = (violation: Violation, index: number) => {
    return (
      <tr key={violation.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'}>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          #{index + 1}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {violation.employeeName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {violation.employeePosition}
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800 dark:bg-danger-800/30 dark:text-danger-300">
            {violation.violationType}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {formatTime(violation.violationTime)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {violation.salaryBeforeDeduction.toLocaleString()} EGP
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm">
          {violation.status === 'pending' ? (
            <span className="text-warning-600 dark:text-warning-400">
              {deductionPrices[violation.violationType] ? `${deductionPrices[violation.violationType].toLocaleString()} EGP` : 'N/A'}
            </span>
          ) : violation.status === 'deducted' ? (
            <span className="text-danger-600 dark:text-danger-400">
              {violation.deductionAmount.toLocaleString()} EGP
            </span>
          ) : (
            <span className="text-success-600 dark:text-success-400">
              0 EGP
            </span>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {violation.status === 'pending' ? (
            <span>{violation.salaryBeforeDeduction.toLocaleString()} EGP</span>
          ) : (
            <span>{violation.salaryAfterDeduction.toLocaleString()} EGP</span>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          {violation.status === 'pending' && canTakeAction ? (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => handleDeduction(violation.id)}
              >
                Deduct
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleIgnore(violation.id)}
              >
                Ignore
              </Button>
            </div>
          ) : (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${violation.status === 'deducted' 
                ? 'bg-danger-100 text-danger-800 dark:bg-danger-800/30 dark:text-danger-300' 
                : violation.status === 'ignored'
                  ? 'bg-success-100 text-success-800 dark:bg-success-800/30 dark:text-success-300'
                  : 'bg-warning-100 text-warning-800 dark:bg-warning-800/30 dark:text-warning-300'
              }`}
            >
              {violation.status === 'deducted' 
                ? 'Deducted' 
                : violation.status === 'ignored' 
                  ? 'Ignored' 
                  : 'Pending'}
            </span>
          )}
        </td>
      </tr>
    );
  };

  const displayViolations = selectedTab === 'pending' ? pendingViolations : violations;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Safety Violations
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage all safety compliance violations
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={selectedTab === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('pending')}
            >
              Pending ({pendingViolations.length})
            </Button>
            <Button 
              variant={selectedTab === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('all')}
            >
              All ({violations.length})
            </Button>
          </div>
        </div>
        
        {displayViolations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Violation Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Salary Before
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deduction
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Salary After
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayViolations.map(renderViolationRow)}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No violations</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {selectedTab === 'pending' 
                ? 'There are no pending safety violations to manage.' 
                : 'No safety violations have been recorded yet.'}
            </p>
          </div>
        )}
      </div>

      {deductionMode !== 'manual' && (
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-warning-100 dark:bg-warning-800/30 rounded-md p-2">
              <svg className="h-5 w-5 text-warning-600 dark:text-warning-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-600 dark:text-warning-400">Automatic Processing Active</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {deductionMode === 'auto-deduct' 
                  ? 'All violations are automatically processed with deductions applied.'
                  : 'All violations are automatically processed with deductions ignored.'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ViolationsTable;