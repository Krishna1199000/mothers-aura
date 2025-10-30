export default function RingSizeCTA() {
    return (
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-5xl font-bold text-white mb-6">Still Unsure About Your Size?</h2>
          <p className="text-xl text-blue-100 mb-8">Our experts are here to help you find the perfect fit</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Contact Our Experts
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Order a Size Kit
            </button>
          </div>
        </div>
      </section>
    )
  }
  