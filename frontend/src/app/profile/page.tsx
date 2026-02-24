'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SVGComponent from '@/components/svg';
import { APP_NAME } from '@/constants/generalConstants';

interface UserInfo {
  email: string;
  username: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

    if (!token) {
      router.push('/login');
      return;
    }

    setUserInfo({
      email: email || 'N/A',
      username: username || 'N/A'
    });
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');

    // Redirect to login page
    router.push('/login');
  };

  const handleBackToDashboard = () => {
    router.push('/projects');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border  border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white transition-all duration-200"
          >
            <SVGComponent svgType="leftArrowHead" className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SVGComponent className='w-6 h-6 text-white' svgType="task_logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{APP_NAME.toUpperCase()}</h1>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border  border-gray-200 dark:border-white/10 rounded-2xl p-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <SVGComponent svgType="user" className="w-12 h-12 text-gray-900 dark:text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{userInfo?.username}</h2>
              <p className="text-gray-600 dark:text-white/60">{userInfo?.email}</p>
            </div>

            {/* Profile Information */}
            <div className="space-y-4 mb-8">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4">
                <label className="text-gray-600 dark:text-white/60 text-sm mb-1 block">Username</label>
                <p className="text-gray-900 dark:text-white text-lg font-medium">{userInfo?.username}</p>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4">
                <label className="text-gray-600 dark:text-white/60 text-sm mb-1 block">Email</label>
                <p className="text-gray-900 dark:text-white text-lg font-medium">{userInfo?.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl text-gray-900 dark:text-white hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Logout</span>
              </button>

              <p className="text-center text-gray-500 dark:text-white/40 text-sm">
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
