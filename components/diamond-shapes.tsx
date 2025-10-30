export default function DiamondShapes() {
    const shapes = [
      { name: "Round", popularity: "Most Popular", description: "Classic and timeless" },
      { name: "Princess", popularity: "Very Popular", description: "Modern and brilliant" },
      { name: "Emerald", popularity: "Popular", description: "Elegant and sophisticated" },
      { name: "Cushion", popularity: "Popular", description: "Romantic and vintage" },
      { name: "Oval", popularity: "Popular", description: "Elongated and flattering" },
      { name: "Marquise", popularity: "Unique", description: "Distinctive and dramatic" },
    ]
  
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-black mb-4">Diamond Shapes</h2>
            <p className="text-xl text-gray-600">Explore different cuts and find your perfect diamond</p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-6">
            {shapes.map((shape, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2 text-center">{shape.name}</h3>
                <p className="text-blue-600 font-semibold text-center mb-2">{shape.popularity}</p>
                <p className="text-gray-600 text-center">{shape.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  