import React, { useState } from 'react';
import { useViolations } from '../../contexts/ViolationsContext';
import Card from '../../components/ui/Card';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const StatisticsPage: React.FC = () => {
  const { stats } = useViolations();
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');

  // Colors for charts
  const COLORS = ['#0070c6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  // Data for pie chart (violation types)
  const pieData = Object.entries(stats.violationsByType).map(([name, value]) => ({
    name,
    value,
  }));

  // Data for line chart (by time)
  const getLineData = () => {
    let data;
    
    if (timeRange === 'day') {
      data = Object.entries(stats.violationsByDay)
        .map(([date, count]) => ({
          date: date.split('T')[0],
          count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } else if (timeRange === 'month') {
      data = Object.entries(stats.violationsByMonth)
        .map(([month, count]) => ({
          date: month,
          count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } else {
      data = Object.entries(stats.violationsByYear)
        .map(([year, count]) => ({
          date: year,
          count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }
    
    return data;
  };
  
  // Data for bar chart (workers with most violations)
  const barData = Object.entries(stats.workerViolations)
    .map(([name, count]) => ({
      name,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  // Summary data
  const summaryData = [
    {
      title: 'Total Deductions',
      value: `${stats.totalDeductions.toLocaleString()} EGP`,
      color: 'text-danger-600 dark:text-danger-400',
      bg: 'bg-danger-100 dark:bg-danger-800/30',
    },
    {
      title: 'Deducted Violations',
      value: stats.deductedCount,
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-100 dark:bg-warning-800/30',
    },
    {
      title: 'Ignored Violations',
      value: stats.ignoredCount,
      color: 'text-success-600 dark:text-success-400',
      bg: 'bg-success-100 dark:bg-success-800/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.title}</p>
              <p className={`mt-1 text-2xl font-semibold ${item.color}`}>{item.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
              {index === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              ) : index === 1 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Pie Chart - Violation Types */}
      <Card title="Violation Types Distribution">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} violations`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Line Chart - Violations Over Time */}
      <Card title="Violations Over Time">
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md border border-gray-300 dark:border-gray-600 
                ${timeRange === 'day' 
                  ? 'bg-primary-600 text-white dark:bg-primary-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setTimeRange('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-300 dark:border-gray-600 
                ${timeRange === 'month' 
                  ? 'bg-primary-600 text-white dark:bg-primary-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md border border-gray-300 dark:border-gray-600 
                ${timeRange === 'year' 
                  ? 'bg-primary-600 text-white dark:bg-primary-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getLineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--tw-prose-body)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--tw-prose-body)' }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Violations"
                stroke="#0070c6"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bar Chart - Top Violators */}
      <Card title="Employees with Most Violations">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--tw-prose-body)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--tw-prose-body)' }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Violations" fill="#0070c6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsPage;