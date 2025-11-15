'use client';

import { useState, useRef } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportCompleteBackup, exportIndividualCSV } from '@/utils/exportData';
import { importCompleteBackup, importIndividualCSV } from '@/utils/importData';
import { trackUserAction } from '@/lib/analytics';

interface DataManagementProps {
  // Functions to fetch data for export
  fetchData: {
    projects: () => Promise<any[]>;
    tasks: () => Promise<any[]>;
    transactions: () => Promise<any[]>;
    savings: () => Promise<any[]>;
    loans: () => Promise<any[]>;
    roadmaps: () => Promise<any[]>;
  };
  // Functions to import data
  importData: {
    projects: (items: any[]) => Promise<any>;
    tasks: (items: any[]) => Promise<any>;
    transactions: (items: any[]) => Promise<any>;
    savings: (items: any[]) => Promise<any>;
    loans: (items: any[]) => Promise<any>;
    roadmaps: (items: any[]) => Promise<any>;
  };
  userEmail?: string;
}

export default function DataManagement({ fetchData, importData, userEmail }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Export all data as JSON
  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      await exportCompleteBackup(fetchData, userEmail);
      showMessage('success', 'Data exported successfully!');
      trackUserAction.exportData('json');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  // Export individual data type as CSV
  const handleExportCSV = async (
    dataType: 'projects' | 'tasks' | 'transactions' | 'savings' | 'loans' | 'roadmaps'
  ) => {
    setIsExporting(true);
    try {
      const data = await fetchData[dataType]();
      await exportIndividualCSV(dataType, data);
      showMessage('success', `${dataType} exported successfully!`);
      trackUserAction.exportData('csv');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  // Import data from JSON file
  const handleImportJSON = async (file: File) => {
    setIsImporting(true);
    try {
      const result = await importCompleteBackup(file, importData);

      if (result.success) {
        showMessage('success', result.message);
        trackUserAction.importData('json');

        // Refresh page to show imported data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showMessage('error', result.message);
      }
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      handleImportJSON(file);
    } else {
      showMessage('error', 'Please select a valid JSON backup file');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Management</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Export your data for backup or import previously exported data
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
          )}
          <p
            className={`text-sm ${
              message.type === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Export Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
            <Download className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Export Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download your data as a backup file or in CSV format for analysis
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Export All as JSON */}
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <FileJson className="text-blue-600 dark:text-blue-400" size={24} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Complete Backup (JSON)</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Export all your projects, tasks, transactions, and more
                </div>
              </div>
              {isExporting && (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </button>

          {/* Export Individual as CSV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { type: 'projects' as const, label: 'Projects' },
              { type: 'tasks' as const, label: 'Tasks' },
              { type: 'transactions' as const, label: 'Transactions' },
              { type: 'savings' as const, label: 'Savings' },
              { type: 'loans' as const, label: 'Loans' },
              { type: 'roadmaps' as const, label: 'Roadmaps' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handleExportCSV(item.type)}
                disabled={isExporting}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="text-green-600 dark:text-green-400" size={18} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label} (CSV)</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
            <Upload className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Import Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Restore data from a previous backup file (JSON format only)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isImporting}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              {isImporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium text-gray-900 dark:text-white">Importing...</span>
                </>
              ) : (
                <>
                  <FileJson className="text-purple-600 dark:text-purple-400" size={24} />
                  <span className="font-medium text-gray-900 dark:text-white">Choose Backup File</span>
                </>
              )}
            </div>
          </button>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={18} />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Importing data will add to your existing data. Duplicate entries may be
                created. It's recommended to export a backup before importing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
