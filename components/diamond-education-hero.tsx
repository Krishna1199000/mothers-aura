export default function DiamondEducationHero() {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-50 rounded-full opacity-40 animate-pulse" />
          <div
            className="absolute bottom-20 left-10 w-96 h-96 bg-blue-50 rounded-full opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
  
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Understand <span className="text-blue-600">Diamond Quality</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn the science behind diamonds and make informed decisions about your precious investment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                Explore the 4 Cs
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300">
                View Diamond Shapes
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
  