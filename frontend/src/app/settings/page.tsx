'use client';

import { useState } from 'react';
import { usePreferences, useUpdatePreference, useResetPreferences } from '@/hooks/usePreferences';
import SVGComponent from '@/components/svg';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';

type SettingsTab = 'appearance' | 'localization' | 'notifications' | 'privacy' | 'finance' | 'dashboard';

export default function SettingsPage() {
  const { data: preferences, isLoading, error } = usePreferences();
  const updateMutation = useUpdatePreference();
  const resetMutation = useResetPreferences();

  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (data: any) => {
    try {
      await updateMutation.mutateAsync(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      return;
    }
    try {
      await resetMutation.mutateAsync();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to reset preferences:', err);
    }
  };

  const tabs = [
    { id: 'appearance' as const, name: 'Appearance', icon: 'eye' },
    { id: 'localization' as const, name: 'Localization', icon: 'globe' },
    { id: 'notifications' as const, name: 'Notifications', icon: 'bell' },
    { id: 'privacy' as const, name: 'Privacy', icon: 'shield' },
    { id: 'finance' as const, name: 'Finance', icon: 'wallet' },
    { id: 'dashboard' as const, name: 'Dashboard', icon: 'home' },
  ];

  if (isLoading && !preferences) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white/60">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
              <p className="text-gray-600 dark:text-white/60">Customize your Fintrax experience</p>
            </div>

            {/* Success Message */}
            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-3">
                <SVGComponent svgType="checkmark-circle" className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Settings saved successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {(error || updateMutation.error || resetMutation.error) && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
                <SVGComponent svgType="close-circle" className="w-5 h-5 text-red-400" />
                <span className="text-red-300">
                  {(error as Error)?.message || (updateMutation.error as Error)?.message || (resetMutation.error as Error)?.message || 'An error occurred'}
                </span>
              </div>
            )}

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Sidebar Tabs */}
              <div className="w-64 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg p-4 h-fit backdrop-blur-xl shadow-sm">
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-white border border-blue-500/30'
                          : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <SVGComponent svgType={tab.icon as any} className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  ))}
                </div>

                {/* Reset Button */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={handleReset}
                    disabled={resetMutation.isPending}
                    className="w-full px-4 py-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 hover:border-red-300 dark:hover:border-red-500/50 text-red-600 dark:text-red-400 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetMutation.isPending ? 'Resetting...' : 'Reset to Default'}
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg p-6 backdrop-blur-xl shadow-sm">
                {activeTab === 'appearance' && (
                  <AppearanceSettings preferences={preferences} onSave={handleSave} isSaving={updateMutation.isPending} />
                )}
                {activeTab === 'localization' && (
                  <LocalizationSettings preferences={preferences} onSave={handleSave} isSaving={updateMutation.isPending} />
                )}
                {activeTab === 'notifications' && (
                  <NotificationSettings preferences={preferences} onSave={handleSave} isSaving={updateMutation.isPending} />
                )}
                {activeTab === 'privacy' && (
                  <PrivacySettings preferences={preferences} onSave={handleSave} isSaving={updateMutation.isPending} />
                )}
                {activeTab === 'finance' && (
                  <FinanceSettings preferences={preferences} onSave={handleSave} isSaving={updateMutation.isPending} />
                )}
                {activeTab === 'dashboard' && (
                  <DashboardSettings preferences={preferences} onSave={handleSave} isSaving={updateMutation.isPending} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Appearance Settings Component
function AppearanceSettings({ preferences, onSave, isSaving }: any) {
  const [theme, setTheme] = useState(preferences?.theme || 'light');
  const [colorScheme, setColorScheme] = useState(preferences?.color_scheme || 'blue');
  const [fontSize, setFontSize] = useState(preferences?.font_size || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ theme, color_scheme: colorScheme, font_size: fontSize });
  };

  const colorSchemes = ['blue', 'purple', 'green', 'red', 'orange', 'pink'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <p className="text-gray-600 dark:text-white/60 mb-6">Customize the look and feel of your interface</p>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-3">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`p-4 rounded-lg border-2 transition-all capitalize ${
                theme === t
                  ? 'border-blue-500 bg-blue-500/20 text-blue-700 dark:text-white'
                  : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white hover:border-gray-400 dark:hover:border-white/20'
              }`}
            >
              <div className="font-medium">{t}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-3">Color Scheme</label>
        <div className="grid grid-cols-6 gap-3">
          {colorSchemes.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setColorScheme(color)}
              className={`h-12 rounded-lg border-2 transition-all capitalize ${
                colorScheme === color
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-gray-300 dark:border-white/10 hover:scale-105'
              }`}
              style={{
                backgroundColor: {
                  blue: '#3b82f6',
                  purple: '#a855f7',
                  green: '#10b981',
                  red: '#ef4444',
                  orange: '#f97316',
                  pink: '#ec4899',
                }[color],
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-3">Font Size</label>
        <div className="grid grid-cols-3 gap-3">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setFontSize(size)}
              className={`p-4 rounded-lg border-2 transition-all capitalize ${
                fontSize === size
                  ? 'border-blue-500 bg-blue-500/20 text-blue-700 dark:text-white'
                  : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white hover:border-gray-400 dark:hover:border-white/20'
              }`}
            >
              <div className="font-medium">{size}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// Localization Settings Component
function LocalizationSettings({ preferences, onSave, isSaving }: any) {
  const [language, setLanguage] = useState(preferences?.language || 'en');
  const [timezone, setTimezone] = useState(preferences?.timezone || 'UTC');
  const [dateFormat, setDateFormat] = useState(preferences?.date_format || 'MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState(preferences?.time_format || '12h');
  const [currency, setCurrency] = useState(preferences?.currency || 'USD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ language, timezone, date_format: dateFormat, time_format: timeFormat, currency });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Localization</h2>
        <p className="text-gray-600 dark:text-white/60 mb-6">Set your language, timezone, and regional preferences</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (US & Canada)</option>
          <option value="America/Chicago">Central Time (US & Canada)</option>
          <option value="America/Denver">Mountain Time (US & Canada)</option>
          <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Kolkata">Indian Standard Time (IST)</option>
          <option value="Asia/Tokyo">Tokyo</option>
          <option value="Asia/Shanghai">Shanghai</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Date Format</label>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          <option value="DD MMM YYYY">DD MMM YYYY</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Time Format</label>
        <div className="grid grid-cols-2 gap-3">
          {['12h', '24h'].map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setTimeFormat(format as '12h' | '24h')}
              className={`p-4 rounded-lg border-2 transition-all ${
                timeFormat === format
                  ? 'border-blue-500 bg-blue-500/20 text-blue-700 dark:text-white'
                  : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white hover:border-gray-400 dark:hover:border-white/20'
              }`}
            >
              <div className="font-medium">{format === '12h' ? '12 Hour' : '24 Hour'}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="CNY">CNY - Chinese Yuan</option>
          <option value="INR">INR - Indian Rupee</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// Notification Settings Component
function NotificationSettings({ preferences, onSave, isSaving }: any) {
  const [settings, setSettings] = useState({
    email_notifications: preferences?.email_notifications ?? true,
    push_notifications: preferences?.push_notifications ?? true,
    task_reminders: preferences?.task_reminders ?? true,
    project_updates: preferences?.project_updates ?? true,
    finance_alerts: preferences?.finance_alerts ?? true,
    weekly_digest: preferences?.weekly_digest ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    { key: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'push_notifications', label: 'Push Notifications', description: 'Receive push notifications in your browser' },
    { key: 'task_reminders', label: 'Task Reminders', description: 'Get reminders for upcoming and overdue tasks' },
    { key: 'project_updates', label: 'Project Updates', description: 'Notifications about project changes and updates' },
    { key: 'finance_alerts', label: 'Finance Alerts', description: 'Alerts for important financial events' },
    { key: 'weekly_digest', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
        <p className="text-gray-600 dark:text-white/60 mb-6">Manage how and when you receive notifications</p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <div>
              <div className="text-gray-900 dark:text-white font-medium">{option.label}</div>
              <div className="text-gray-600 dark:text-white/60 text-sm mt-1">{option.description}</div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting(option.key as keyof typeof settings)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                settings[option.key as keyof typeof settings]
                  ? 'bg-blue-500'
                  : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings[option.key as keyof typeof settings]
                    ? 'translate-x-6'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// Privacy Settings Component
function PrivacySettings({ preferences, onSave, isSaving }: any) {
  const [profileVisibility, setProfileVisibility] = useState(preferences?.profile_visibility || 'private');
  const [showOnlineStatus, setShowOnlineStatus] = useState(preferences?.show_online_status ?? true);
  const [allowDataCollection, setAllowDataCollection] = useState(preferences?.allow_data_collection ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      profile_visibility: profileVisibility,
      show_online_status: showOnlineStatus,
      allow_data_collection: allowDataCollection,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy</h2>
        <p className="text-gray-600 dark:text-white/60 mb-6">Control your privacy and data sharing preferences</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-3">Profile Visibility</label>
        <div className="grid grid-cols-3 gap-3">
          {['public', 'private', 'friends'].map((visibility) => (
            <button
              key={visibility}
              type="button"
              onClick={() => setProfileVisibility(visibility)}
              className={`p-4 rounded-lg border-2 transition-all capitalize ${
                profileVisibility === visibility
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-gray-900 dark:text-white font-medium">{visibility}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg">
          <div>
            <div className="text-white font-medium">Show Online Status</div>
            <div className="text-white/60 text-sm mt-1">Let others see when you're online</div>
          </div>
          <button
            type="button"
            onClick={() => setShowOnlineStatus(!showOnlineStatus)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              showOnlineStatus ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showOnlineStatus ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg">
          <div>
            <div className="text-white font-medium">Allow Data Collection</div>
            <div className="text-white/60 text-sm mt-1">Help us improve by sharing usage data</div>
          </div>
          <button
            type="button"
            onClick={() => setAllowDataCollection(!allowDataCollection)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              allowDataCollection ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                allowDataCollection ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// Finance Settings Component
function FinanceSettings({ preferences, onSave, isSaving }: any) {
  const [defaultTransactionType, setDefaultTransactionType] = useState(preferences?.default_transaction_type || 2);
  const [showBalance, setShowBalance] = useState(preferences?.show_balance ?? true);
  const [budgetWarnings, setBudgetWarnings] = useState(preferences?.budget_warnings ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      default_transaction_type: defaultTransactionType,
      show_balance: showBalance,
      budget_warnings: budgetWarnings,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Finance Settings</h2>
        <p className="text-gray-600 dark:text-white/60 mb-6">Configure your finance tracking preferences</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-3">Default Transaction Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDefaultTransactionType(1)}
            className={`p-4 rounded-lg border-2 transition-all ${
              defaultTransactionType === 1
                ? 'border-green-500 bg-green-500/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-white font-medium">Income</div>
          </button>
          <button
            type="button"
            onClick={() => setDefaultTransactionType(2)}
            className={`p-4 rounded-lg border-2 transition-all ${
              defaultTransactionType === 2
                ? 'border-red-500 bg-red-500/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-white font-medium">Expense</div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg">
          <div>
            <div className="text-white font-medium">Show Balance</div>
            <div className="text-white/60 text-sm mt-1">Display your balance on the dashboard</div>
          </div>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              showBalance ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showBalance ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg">
          <div>
            <div className="text-white font-medium">Budget Warnings</div>
            <div className="text-white/60 text-sm mt-1">Get alerts when approaching budget limits</div>
          </div>
          <button
            type="button"
            onClick={() => setBudgetWarnings(!budgetWarnings)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              budgetWarnings ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                budgetWarnings ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// Dashboard Settings Component
function DashboardSettings({ preferences, onSave, isSaving }: any) {
  const [defaultView, setDefaultView] = useState(preferences?.default_dashboard_view || 'overview');
  const [tasksPerPage, setTasksPerPage] = useState(preferences?.tasks_per_page || 20);
  const [compactMode, setCompactMode] = useState(preferences?.compact_mode ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      default_dashboard_view: defaultView,
      tasks_per_page: tasksPerPage,
      compact_mode: compactMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Settings</h2>
        <p className="text-gray-600 dark:text-white/60 mb-6">Customize your dashboard layout and display</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-3">Default Dashboard View</label>
        <div className="grid grid-cols-2 gap-3">
          {['overview', 'tasks', 'finance', 'projects'].map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setDefaultView(view)}
              className={`p-4 rounded-lg border-2 transition-all capitalize ${
                defaultView === view
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-gray-900 dark:text-white font-medium">{view}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Tasks Per Page</label>
        <input
          type="number"
          min="5"
          max="100"
          step="5"
          value={tasksPerPage}
          onChange={(e) => setTasksPerPage(parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg">
        <div>
          <div className="text-white font-medium">Compact Mode</div>
          <div className="text-white/60 text-sm mt-1">Use a more condensed layout to fit more information</div>
        </div>
        <button
          type="button"
          onClick={() => setCompactMode(!compactMode)}
          className={`relative w-12 h-6 rounded-full transition-all ${
            compactMode ? 'bg-blue-500' : 'bg-white/20'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              compactMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
