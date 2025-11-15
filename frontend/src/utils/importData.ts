/**
 * Data Import Utilities
 *
 * Import user data from JSON backups with validation
 */

interface ImportResult {
  success: boolean;
  message: string;
  imported?: {
    projects?: number;
    tasks?: number;
    transactions?: number;
    savings?: number;
    loans?: number;
    roadmaps?: number;
  };
  errors?: string[];
}

interface ImportData {
  metadata?: {
    exportDate: string;
    version: string;
  };
  data?: {
    projects?: any[];
    tasks?: any[];
    transactions?: any[];
    savings?: any[];
    loans?: any[];
    roadmaps?: any[];
  };
}

/**
 * Validate JSON structure
 */
function validateImportData(data: any): data is ImportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check for required structure
  if (!data.metadata || !data.data) {
    return false;
  }

  // Check metadata
  if (!data.metadata.exportDate || !data.metadata.version) {
    return false;
  }

  // Check data object
  if (typeof data.data !== 'object') {
    return false;
  }

  return true;
}

/**
 * Validate individual data items
 */
function validateDataItems(type: string, items: any[]): { valid: any[]; errors: string[] } {
  const valid: any[] = [];
  const errors: string[] = [];

  if (!Array.isArray(items)) {
    errors.push(`${type} must be an array`);
    return { valid, errors };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Basic validation based on type
    switch (type) {
      case 'projects':
        if (item.name && typeof item.name === 'string') {
          valid.push(item);
        } else {
          errors.push(`Project at index ${i} is missing required 'name' field`);
        }
        break;

      case 'tasks':
        if (item.title && typeof item.title === 'string') {
          valid.push(item);
        } else {
          errors.push(`Task at index ${i} is missing required 'title' field`);
        }
        break;

      case 'transactions':
        if (item.source && item.amount && typeof item.amount === 'number') {
          valid.push(item);
        } else {
          errors.push(`Transaction at index ${i} is missing required fields`);
        }
        break;

      case 'savings':
        if (item.name && item.amount && typeof item.amount === 'number') {
          valid.push(item);
        } else {
          errors.push(`Saving at index ${i} is missing required fields`);
        }
        break;

      case 'loans':
        if (item.name && item.total_amount && typeof item.total_amount === 'number') {
          valid.push(item);
        } else {
          errors.push(`Loan at index ${i} is missing required fields`);
        }
        break;

      case 'roadmaps':
        if (item.name && typeof item.name === 'string') {
          valid.push(item);
        } else {
          errors.push(`Roadmap at index ${i} is missing required 'name' field`);
        }
        break;

      default:
        errors.push(`Unknown data type: ${type}`);
    }
  }

  return { valid, errors };
}

/**
 * Read and parse JSON file
 */
export async function readJSONFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file. Please check the file format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    reader.readAsText(file);
  });
}

/**
 * Read and parse CSV file
 */
export async function readCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          reject(new Error('CSV file is empty or invalid'));
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

        // Parse rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const row: any = {};

          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          data.push(row);
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse CSV file. Please check the format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    reader.readAsText(file);
  });
}

/**
 * Import complete backup from JSON
 */
export async function importCompleteBackup(
  file: File,
  importFunctions: {
    projects: (items: any[]) => Promise<any>;
    tasks: (items: any[]) => Promise<any>;
    transactions: (items: any[]) => Promise<any>;
    savings: (items: any[]) => Promise<any>;
    loans: (items: any[]) => Promise<any>;
    roadmaps: (items: any[]) => Promise<any>;
  },
  options?: {
    skipDuplicates?: boolean;
    overwriteExisting?: boolean;
  }
): Promise<ImportResult> {
  try {
    // Read and parse file
    const rawData = await readJSONFile(file);

    // Validate structure
    if (!validateImportData(rawData)) {
      return {
        success: false,
        message: 'Invalid backup file format. Please use a valid Fintrax backup file.',
      };
    }

    const importData = rawData as ImportData;
    const allErrors: string[] = [];
    const imported: any = {};

    // Import each data type
    const dataTypes = ['projects', 'tasks', 'transactions', 'savings', 'loans', 'roadmaps'] as const;

    for (const type of dataTypes) {
      const items = importData.data?.[type];

      if (!items || items.length === 0) {
        continue;
      }

      // Validate items
      const { valid, errors } = validateDataItems(type, items);

      if (errors.length > 0) {
        allErrors.push(...errors);
      }

      if (valid.length > 0) {
        try {
          // Import valid items
          await importFunctions[type](valid);
          imported[type] = valid.length;
        } catch (error: any) {
          allErrors.push(`Failed to import ${type}: ${error.message}`);
        }
      }
    }

    const totalImported = Object.values(imported).reduce((sum: number, count: number) => sum + count, 0);

    if (totalImported === 0) {
      return {
        success: false,
        message: 'No valid data found to import.',
        errors: allErrors,
      };
    }

    return {
      success: true,
      message: `Successfully imported ${totalImported} items`,
      imported,
      errors: allErrors.length > 0 ? allErrors : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to import data',
      errors: [error.message],
    };
  }
}

/**
 * Import individual CSV file
 */
export async function importIndividualCSV(
  file: File,
  dataType: 'projects' | 'tasks' | 'transactions' | 'savings' | 'loans' | 'roadmaps',
  importFunction: (items: any[]) => Promise<any>
): Promise<ImportResult> {
  try {
    // Read and parse CSV
    const items = await readCSVFile(file);

    // Validate items
    const { valid, errors } = validateDataItems(dataType, items);

    if (valid.length === 0) {
      return {
        success: false,
        message: 'No valid data found in CSV file',
        errors,
      };
    }

    // Import valid items
    await importFunction(valid);

    return {
      success: true,
      message: `Successfully imported ${valid.length} ${dataType}`,
      imported: { [dataType]: valid.length },
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to import CSV',
      errors: [error.message],
    };
  }
}

/**
 * Check for duplicate entries
 */
export function detectDuplicates(
  existingItems: any[],
  newItems: any[],
  idField: string = 'id'
): { duplicates: any[]; unique: any[] } {
  const existingIds = new Set(existingItems.map((item) => item[idField]));
  const duplicates: any[] = [];
  const unique: any[] = [];

  for (const item of newItems) {
    if (existingIds.has(item[idField])) {
      duplicates.push(item);
    } else {
      unique.push(item);
    }
  }

  return { duplicates, unique };
}
