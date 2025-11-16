'use client';

/**
 * DashboardPreview Component
 *
 * A static preview of the dashboard for the marketing/landing page
 * Shows potential users what the dashboard looks like without requiring authentication
 */
export default function DashboardPreview() {
  // Mock data for preview
  const mockStats = [
    {
      label: 'Total Projects',
      value: '12',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Total Tasks',
      value: '48',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      label: 'Completed',
      value: '34',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Completion Rate',
      value: '71%',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ];

  const mockTasks = [
    { title: 'Implement user authentication', project: 'Website Redesign', status: 'in-progress', priority: 'high' },
    { title: 'Design landing page mockups', project: 'Marketing Campaign', status: 'done', priority: 'medium' },
    { title: 'Update database schema', project: 'Backend API', status: 'todo', priority: 'high' },
  ];

  const mockFinanceData = [
    { month: 'Jan', income: 4500, expense: 3200 },
    { month: 'Feb', income: 5200, expense: 3800 },
    { month: 'Mar', income: 4800, expense: 3500 },
    { month: 'Apr', income: 5500, expense: 4100 },
  ];

  const maxValue = Math.max(...mockFinanceData.flatMap(d => [d.income, d.expense]));

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-slate-900/90 backdrop-blur-sm">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Welcome to Fintrax 👋
            </h2>
            <p className="text-white/70 text-sm">
              Manage your projects and tasks with ease
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs text-white/60">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>34 of 48 tasks completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {mockStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              <div className={`${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/60 text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid - Charts and Tasks */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Financial Chart Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Financial Overview</h3>
                <p className="text-white/50 text-xs">Income vs Expenses</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/60">Income</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white/60">Expenses</span>
                </div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {mockFinanceData.map((data, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{data.month}</span>
                    <span className="text-white/40">${data.income.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-1 h-8">
                    <div
                      className="bg-gradient-to-r from-green-500/60 to-green-400/60 rounded-md flex items-center justify-end px-2 transition-all"
                      style={{ width: `${(data.income / maxValue) * 100}%` }}
                    >
                    </div>
                    <div
                      className="bg-gradient-to-r from-red-500/60 to-red-400/60 rounded-md flex items-center justify-end px-2 transition-all"
                      style={{ width: `${(data.expense / maxValue) * 100}%` }}
                    >
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Recent Tasks</h3>
                <p className="text-white/50 text-xs">Your latest activities</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white text-sm font-medium flex-1">{task.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-400/20 text-red-400'
                        : 'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">{task.project}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.status === 'done'
                        ? 'bg-green-400/20 text-green-400'
                        : task.status === 'in-progress'
                        ? 'bg-blue-400/20 text-blue-400'
                        : 'bg-slate-400/20 text-slate-400'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Preview */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
          <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Add Transaction', icon: '💰', color: 'green' },
              { label: 'View Reports', icon: '📊', color: 'blue' },
              { label: 'Savings Goals', icon: '🎯', color: 'purple' },
              { label: 'Projects', icon: '📋', color: 'orange' },
            ].map((action, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-white text-xs font-medium group-hover:text-blue-400 transition-colors">
                  {action.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
