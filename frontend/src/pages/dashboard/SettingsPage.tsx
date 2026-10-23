import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useSettings } from '../../contexts/SettingsContext';

const SettingsPage: React.FC = () => {
  const { 
    deductionMode, 
    setDeductionMode, 
    deductionPrices, 
    updateDeductionPrice,
    timeFormat,
    setTimeFormat,
    theme,
    setTheme,
    language,
    setLanguage
  } = useSettings();

  // Local state for editing violation prices
  const [violationPrices, setViolationPrices] = useState({ ...deductionPrices });
  const [isSaving, setIsSaving] = useState(false);

  // Handle price change
  const handlePriceChange = (violationType: string, value: string) => {
    const price = parseInt(value);
    if (!isNaN(price) && price >= 0) {
      setViolationPrices(prev => ({
        ...prev,
        [violationType]: price
      }));
    }
  };

  // Save all price changes
  const saveDeductionPrices = () => {
    setIsSaving(true);
    
    // Update each price in the context
    Object.entries(violationPrices).forEach(([type, price]) => {
      updateDeductionPrice(type, price);
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  // Deduction mode options
  const deductionModeOptions = [
    { value: 'manual', label: 'Manual (Decide each time)' },
    { value: 'auto-deduct', label: 'Automatic (Always Deduct)' },
    { value: 'auto-ignore', label: 'Automatic (Always Ignore)' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h2>
      
      {/* Deduction Mode */}
      <Card title="Deduction Mode">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose how you want to handle safety violations
        </div>
        
        <div className="space-y-4">
          {deductionModeOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={option.value}
                name="deduction-mode"
                type="radio"
                checked={deductionMode === option.value}
                onChange={() => setDeductionMode(option.value as any)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              />
              <label htmlFor={option.value} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Deduction Prices */}
      <Card title="Deduction Prices">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Set the deduction amount for each type of safety violation
        </div>
        
        <div className="space-y-4">
          {Object.entries(violationPrices).map(([type, price]) => (
            <div key={type} className="grid grid-cols-2 gap-4 items-center">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</div>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => handlePriceChange(type, e.target.value)}
                  className="w-24"
                />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">EGP</span>
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <Button 
              onClick={saveDeductionPrices} 
              isLoading={isSaving}
            >
              Save Prices
            </Button>
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card title="Appearance">
        <div className="space-y-6">
          {/* Time Format */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="12h"
                  name="time-format"
                  type="radio"
                  checked={timeFormat === '12h'}
                  onChange={() => setTimeFormat('12h')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="12h" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  12-hour (1:30 PM)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="24h"
                  name="time-format"
                  type="radio"
                  checked={timeFormat === '24h'}
                  onChange={() => setTimeFormat('24h')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="24h" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  24-hour (13:30)
                </label>
              </div>
            </div>
          </div>
          
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="light"
                  name="theme"
                  type="radio"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="light" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Light
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="dark"
                  name="theme"
                  type="radio"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="dark" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Dark
                </label>
              </div>
            </div>
          </div>
          
          {/* Language */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="english"
                  name="language"
                  type="radio"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="english" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  English
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="arabic"
                  name="language"
                  type="radio"
                  checked={language === 'ar'}
                  onChange={() => setLanguage('ar')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="arabic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Arabic
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* API Connection (Future) */}
      <Card title="AI Connection (Coming Soon)">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This system is ready to connect with your AI violation detection model
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">API Integration</h3>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Your AI detection model can send violation data to this system using a simple API integration. The system will automatically process the violations based on your settings.
                </p>
                <div className="mt-2">
                  <code className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded block whitespace-pre overflow-x-auto">
                    POST /api/violations<br />
                    {`{
  "employeeName": "John Doe",
  "employeePosition": "Technician",
  "violationType": "Missing Helmet",
  "violationTime": "2025-05-10T14:30:00Z",
  "salaryBeforeDeduction": 8500
}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;