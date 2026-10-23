import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSettings } from './SettingsContext';
import { generateMockViolations } from '../utils/mockData';

export interface Violation {
  id: string;
  employeeName: string;
  employeePosition: string;
  violationType: string;
  violationTime: string;
  salaryBeforeDeduction: number;
  deductionAmount: number;
  salaryAfterDeduction: number;
  status: 'pending' | 'deducted' | 'ignored';
}

interface Stats {
  totalDeductions: number;
  deductedCount: number;
  ignoredCount: number;
  violationsByType: Record<string, number>;
  violationsByDay: Record<string, number>;
  violationsByMonth: Record<string, number>;
  violationsByYear: Record<string, number>;
  workerViolations: Record<string, number>;
}

interface ViolationsContextType {
  violations: Violation[];
  pendingViolations: Violation[];
  processedViolations: Violation[];
  stats: Stats;
  handleDeduction: (violationId: string) => void;
  handleIgnore: (violationId: string) => void;
  addViolation: (violation: Omit<Violation, 'id' | 'status' | 'deductionAmount' | 'salaryAfterDeduction'>) => void;
}

const ViolationsContext = createContext<ViolationsContextType>({} as ViolationsContextType);

export function ViolationsProvider({ children }: { children: ReactNode }) {
  const { deductionMode, deductionPrices } = useSettings();
  const [violations, setViolations] = useState<Violation[]>(() => {
    const saved = localStorage.getItem('trackSafe_violations');
    return saved ? JSON.parse(saved) : generateMockViolations();
  });

  // Compute derived state
  const pendingViolations = violations.filter(v => v.status === 'pending');
  const processedViolations = violations.filter(v => v.status !== 'pending');

  // Calculate statistics
  const [stats, setStats] = useState<Stats>({
    totalDeductions: 0,
    deductedCount: 0,
    ignoredCount: 0,
    violationsByType: {},
    violationsByDay: {},
    violationsByMonth: {},
    violationsByYear: {},
    workerViolations: {}
  });

  // Update statistics whenever violations change
  useEffect(() => {
    const newStats: Stats = {
      totalDeductions: 0,
      deductedCount: 0,
      ignoredCount: 0,
      violationsByType: {},
      violationsByDay: {},
      violationsByMonth: {},
      violationsByYear: {},
      workerViolations: {}
    };

    violations.forEach(violation => {
      // Count by status
      if (violation.status === 'deducted') {
        newStats.deductedCount++;
        newStats.totalDeductions += violation.deductionAmount;
      } else if (violation.status === 'ignored') {
        newStats.ignoredCount++;
      }

      // Count by type
      newStats.violationsByType[violation.violationType] = 
        (newStats.violationsByType[violation.violationType] || 0) + 1;

      // Count by worker
      newStats.workerViolations[violation.employeeName] = 
        (newStats.workerViolations[violation.employeeName] || 0) + 1;

      // Parse date for time-based stats
      const date = new Date(violation.violationTime);
      
      // By day (use ISO string date part)
      const dayKey = date.toISOString().split('T')[0];
      newStats.violationsByDay[dayKey] = (newStats.violationsByDay[dayKey] || 0) + 1;

      // By month (YYYY-MM format)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      newStats.violationsByMonth[monthKey] = (newStats.violationsByMonth[monthKey] || 0) + 1;

      // By year
      const yearKey = `${date.getFullYear()}`;
      newStats.violationsByYear[yearKey] = (newStats.violationsByYear[yearKey] || 0) + 1;
    });

    setStats(newStats);
  }, [violations]);

  // Save violations to localStorage
  useEffect(() => {
    localStorage.setItem('trackSafe_violations', JSON.stringify(violations));
  }, [violations]);

  // Handle deduction action
  const handleDeduction = useCallback((violationId: string) => {
    setViolations(prev => 
      prev.map(violation => {
        if (violation.id === violationId) {
          // Calculate deduction amount based on violation type
          const deductionAmount = deductionPrices[violation.violationType] || 0;
          const salaryAfterDeduction = violation.salaryBeforeDeduction - deductionAmount;
          
          return {
            ...violation,
            deductionAmount,
            salaryAfterDeduction,
            status: 'deducted'
          };
        }
        return violation;
      })
    );
  }, [deductionPrices]);

  // Handle ignore action
  const handleIgnore = useCallback((violationId: string) => {
    setViolations(prev => 
      prev.map(violation => {
        if (violation.id === violationId) {
          return {
            ...violation,
            status: 'ignored'
          };
        }
        return violation;
      })
    );
  }, []);

  // Process automatic deductions based on settings
  useEffect(() => {
    // Only process pending violations when in automatic mode
    if (deductionMode === 'auto-deduct' || deductionMode === 'auto-ignore') {
      pendingViolations.forEach(violation => {
        if (deductionMode === 'auto-deduct') {
          handleDeduction(violation.id);
        } else if (deductionMode === 'auto-ignore') {
          handleIgnore(violation.id);
        }
      });
    }
  }, [deductionMode, pendingViolations, handleDeduction, handleIgnore]);

  // Add new violation
  const addViolation = useCallback((violationData: Omit<Violation, 'id' | 'status' | 'deductionAmount' | 'salaryAfterDeduction'>) => {
    const newViolation: Violation = {
      ...violationData,
      id: Date.now().toString(),
      deductionAmount: 0,
      salaryAfterDeduction: violationData.salaryBeforeDeduction,
      status: 'pending'
    };

    setViolations(prev => [...prev, newViolation]);

    // Auto-process if in automatic mode
    if (deductionMode === 'auto-deduct') {
      handleDeduction(newViolation.id);
    } else if (deductionMode === 'auto-ignore') {
      handleIgnore(newViolation.id);
    }
  }, [deductionMode, handleDeduction, handleIgnore]);

  return (
    <ViolationsContext.Provider value={{
      violations,
      pendingViolations,
      processedViolations,
      stats,
      handleDeduction,
      handleIgnore,
      addViolation
    }}>
      {children}
    </ViolationsContext.Provider>
  );
}

export const useViolations = () => useContext(ViolationsContext);