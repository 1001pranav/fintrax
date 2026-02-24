'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SVGComponent from '../svg';
import { APP_NAME } from '@/constants/generalConstants';

export default function AppNavbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('User');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
    setIsProfileMenuOpen(false);
  };

  const handleSettings = () => {
    router.push('/settings');
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="h-16 bg-white dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: App Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <SVGComponent className='w-5 h-5 text-white' svgType={"task_logo"} />
        </div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{APP_NAME}</h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <SVGComponent
            svgType="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/40"
          />
          <input
            type="text"
            placeholder="Search projects, tasks, or navigate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-gray-50 dark:focus:bg-white/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
            >
              <SVGComponent svgType="close" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button
          className="p-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all relative"
          title="Notifications"
        >
          <SVGComponent svgType="notification" className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Help */}
        <button
          onClick={() => router.push('/help')}
          className="p-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
          title="Help"
        >
          <SVGComponent svgType="help" className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          onClick={handleSettings}
          className="p-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
          title="Settings"
        >
          <SVGComponent svgType="settings" className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 dark:bg-white/10"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-3 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <SVGComponent svgType="user" className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white font-medium text-sm">{username}</span>
            <SVGComponent
              svgType={isProfileMenuOpen ? "chevron-up" : "chevron-down"}
              className="w-4 h-4 text-gray-600 dark:text-white/60"
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200 dark:border-white/10">
                  <p className="text-gray-900 dark:text-white font-medium">{username}</p>
                  <p className="text-gray-600 dark:text-white/60 text-xs">{localStorage.getItem('email')}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all flex items-center space-x-3"
                  >
                    <SVGComponent svgType="user" className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>

                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all flex items-center space-x-3"
                  >
                    <SVGComponent svgType="settings" className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>

                  <button
                    onClick={() => router.push('/shortcuts')}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all flex items-center space-x-3"
                  >
                    <SVGComponent svgType="keyboard" className="w-4 h-4" />
                    <span className="text-sm">Keyboard Shortcuts</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center space-x-3"
                  >
                    <SVGComponent svgType="logout" className="w-4 h-4" />
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
