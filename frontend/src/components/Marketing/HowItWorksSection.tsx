export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up Free',
      description: 'Create your account in seconds. No credit card required, no commitments.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Add Your Data',
      description: 'Import your transactions, create projects, and add tasks. Get started in minutes.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Get Insights',
      description: 'View beautiful dashboards, track your progress, and make data-driven decisions.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started with Fintrax in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connection Lines (hidden on mobile) */}
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Number Badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-gray-900 dark:text-white font-bold text-2xl mb-6 shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4 text-purple-600">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
