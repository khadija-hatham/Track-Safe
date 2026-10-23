import { Violation } from '../contexts/ViolationsContext';

const employees = [
  { name: 'Ahmed Hassan', position: 'Technician' },
  { name: 'Mohamed Ali', position: 'Engineer' },
  { name: 'Sara Ahmed', position: 'Supervisor' },
  { name: 'Omar Ibrahim', position: 'Technician' },
  { name: 'Fatima Mohamed', position: 'Safety Officer' },
  { name: 'Khaled Mahmoud', position: 'Machine Operator' },
  { name: 'Aisha Samir', position: 'Quality Inspector' },
  { name: 'Youssef Hany', position: 'Electrician' },
];

const violationTypes = [
  'Missing Helmet',
  'Missing Boots',
  'Missing Vest',
  'Missing Face Protector',
  'Missing Gloves',
  'Missing Safety Glasses',
];

// Generate a random date within the past 30 days
function getRandomDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const randomDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return randomDate.toISOString();
}

// Generate a random salary between 5000 and 15000
function getRandomSalary(): number {
  return Math.floor(Math.random() * 10000) + 5000;
}

export function generateMockViolations(count = 20): Violation[] {
  const violations: Violation[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
    const violationType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
    const salaryBeforeDeduction = getRandomSalary();
    
    // Random deduction between 50 and 250
    const deductionAmount = Math.floor(Math.random() * 200) + 50;
    
    // Random status
    const statusOptions = ['pending', 'deducted', 'ignored'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)] as 'pending' | 'deducted' | 'ignored';
    
    violations.push({
      id: `violation-${i + 1}`,
      employeeName: randomEmployee.name,
      employeePosition: randomEmployee.position,
      violationType,
      violationTime: getRandomDate(),
      salaryBeforeDeduction,
      deductionAmount: status === 'deducted' ? deductionAmount : 0,
      salaryAfterDeduction: status === 'deducted' ? salaryBeforeDeduction - deductionAmount : salaryBeforeDeduction,
      status,
    });
  }
  
  return violations;
}