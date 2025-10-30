"use client"

export default function CareHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-50 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <div className="inline-block mb-6 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            Diamond Care Excellence
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-6 text-black animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Preserve Your
          <span className="block text-blue-600 mt-2">Diamond&apos;s Brilliance</span>
        </h1>

        <p
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Expert guidance to maintain the radiance and value of your precious diamonds for generations to come
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            View Full Guide
          </button>
          <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300">
            Contact Expert
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
