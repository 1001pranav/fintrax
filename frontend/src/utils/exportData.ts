/**
 * Data Export Utilities
 *
 * Export user data in JSON and CSV formats for backup and analysis
 */

interface ExportData {
  projects?: any[];
  tasks?: any[];
  transactions?: any[];
  savings?: any[];
  loans?: any[];
  roadmaps?: any[];
}

interface ExportMetadata {
  exportDate: string;
  version: string;
  userEmail?: string;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n';
  }

  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];

      // Handle null/undefined
      if (value === null || value === undefined) {
        return '';
      }

      // Handle objects/arrays (stringify them)
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }

      // Handle strings with commas/quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    });

    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Export projects to CSV
 */
export function exportProjectsCSV(projects: any[]): string {
  const headers = ['project_id', 'name', 'description', 'color', 'status', 'created_at', 'updated_at'];
  return convertToCSV(projects, headers);
}

/**
 * Export tasks to CSV
 */
export function exportTasksCSV(tasks: any[]): string {
  const headers = [
    'task_id',
    'title',
    'description',
    'priority',
    'status',
    'due_days',
    'start_date',
    'end_date',
    'project_id',
    'roadmap_id',
    'created_at',
    'updated_at',
  ];
  return convertToCSV(tasks, headers);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsCSV(transactions: any[]): string {
  const headers = [
    'transaction_id',
    'source',
    'amount',
    'type',
    'transaction_type',
    'category',
    'date',
    'created_at',
    'updated_at',
  ];
  return convertToCSV(transactions, headers);
}

/**
 * Export savings to CSV
 */
export function exportSavingsCSV(savings: any[]): string {
  const headers = ['saving_id', 'name', 'amount', 'rate', 'status', 'created_at', 'updated_at'];
  return convertToCSV(savings, headers);
}

/**
 * Export loans to CSV
 */
export function exportLoansCSV(loans: any[]): string {
  const headers = [
    'loan_id',
    'name',
    'total_amount',
    'rate',
    'term',
    'duration',
    'premium_amount',
    'status',
    'created_at',
    'updated_at',
  ];
  return convertToCSV(loans, headers);
}

/**
 * Export roadmaps to CSV
 */
export function exportRoadmapsCSV(roadmaps: any[]): string {
  const headers = [
    'roadmap_id',
    'name',
    'progress',
    'description',
    'start_date',
    'end_date',
    'status',
    'created_at',
    'updated_at',
  ];
  return convertToCSV(roadmaps, headers);
}

/**
 * Export all data as JSON
 */
export function exportAsJSON(data: ExportData, metadata: ExportMetadata): string {
  const exportPackage = {
    metadata,
    data,
  };

  return JSON.stringify(exportPackage, null, 2);
}

/**
 * Trigger download of a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export all data as a complete JSON backup
 */
export async function exportCompleteBackup(
  fetchData: {
    projects: () => Promise<any[]>;
    tasks: () => Promise<any[]>;
    transactions: () => Promise<any[]>;
    savings: () => Promise<any[]>;
    loans: () => Promise<any[]>;
    roadmaps: () => Promise<any[]>;
  },
  userEmail?: string
): Promise<void> {
  try {
    // Fetch all data
    const [projects, tasks, transactions, savings, loans, roadmaps] = await Promise.all([
      fetchData.projects(),
      fetchData.tasks(),
      fetchData.transactions(),
      fetchData.savings(),
      fetchData.loans(),
      fetchData.roadmaps(),
    ]);

    const metadata: ExportMetadata = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      userEmail,
    };

    const data: ExportData = {
      projects,
      tasks,
      transactions,
      savings,
      loans,
      roadmaps,
    };

    const jsonContent = exportAsJSON(data, metadata);
    const filename = `fintrax-backup-${new Date().toISOString().split('T')[0]}.json`;

    downloadFile(jsonContent, filename, 'application/json');

    return Promise.resolve();
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export data. Please try again.');
  }
}

/**
 * Export individual data types as CSV
 */
export async function exportIndividualCSV(
  dataType: 'projects' | 'tasks' | 'transactions' | 'savings' | 'loans' | 'roadmaps',
  data: any[]
): Promise<void> {
  let csvContent: string;
  let filename: string;

  switch (dataType) {
    case 'projects':
      csvContent = exportProjectsCSV(data);
      filename = `fintrax-projects-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'tasks':
      csvContent = exportTasksCSV(data);
      filename = `fintrax-tasks-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'transactions':
      csvContent = exportTransactionsCSV(data);
      filename = `fintrax-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'savings':
      csvContent = exportSavingsCSV(data);
      filename = `fintrax-savings-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'loans':
      csvContent = exportLoansCSV(data);
      filename = `fintrax-loans-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'roadmaps':
      csvContent = exportRoadmapsCSV(data);
      filename = `fintrax-roadmaps-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }

  downloadFile(csvContent, filename, 'text/csv');
}
