import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Ready to Take Control of Your Finances and Projects?
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto">
            Join thousands of users who are already managing their money and tasks more effectively with Fintrax.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 hover:bg-slate-50 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Free Trial
            </Link>
            <Link
              href="/help"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-lg border  border-gray-400 dark:border-white/30 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-purple-200 text-sm">Free to Start</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">5 min</div>
              <div className="text-purple-200 text-sm">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-purple-200 text-sm">Access Anywhere</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
