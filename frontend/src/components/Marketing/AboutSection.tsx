export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            About Fintrax
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Building the future of personal finance and project management
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Story */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                At Fintrax, we believe that managing your finances and projects shouldn't be complicated.
                Our mission is to provide a simple, powerful, and intuitive platform that helps you take control
                of your financial future and achieve your goals.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">What We Do</h3>
              <p className="text-slate-600 leading-relaxed">
                We combine comprehensive financial tracking with robust project management tools, giving you
                a complete view of both your money and your time. Whether you're tracking expenses, managing
                savings goals, or organizing complex projects, Fintrax is your all-in-one solution.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Values</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">
                    <strong className="text-slate-900">Privacy First:</strong> Your data is yours. We never sell or share your information.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">
                    <strong className="text-slate-900">Simplicity:</strong> Powerful features shouldn't mean complicated interfaces.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">
                    <strong className="text-slate-900">Innovation:</strong> We're constantly improving and adding new features.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Stats/Features */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-slate-600">Free Forever Plan</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-slate-600">Data Sync</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                🔒
              </div>
              <div className="text-slate-600">Bank-Level Security</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                📱
              </div>
              <div className="text-slate-600">Cross-Platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
