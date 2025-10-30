export default function DiamondCutting() {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-5xl font-bold text-black mb-6">The Art of Diamond Cutting</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Diamond cutting is both an art and a science. Master cutters spend years perfecting their craft to
                maximize the beauty and brilliance of each stone.
              </p>
              <ul className="space-y-4">
                {[
                  "Precision angles for maximum light reflection",
                  "Careful planning to minimize waste",
                  "Expert craftsmanship and experience",
                  "Quality control at every step",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-4">✨</div>
                  <p className="text-gray-700 font-semibold">Premium Diamond Cutting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  