export default function RingSizeTips() {
    const tips = [
      {
        title: "Measure Multiple Times",
        description: "Take several measurements to ensure accuracy and consistency",
        icon: "✓",
      },
      {
        title: "Measure at Room Temperature",
        description: "Fingers can swell in heat and shrink in cold weather",
        icon: "🌡️",
      },
      {
        title: "Measure in the Evening",
        description: "Fingers are typically slightly larger at the end of the day",
        icon: "🌙",
      },
      {
        title: "Consider Your Lifestyle",
        description: "A slightly looser fit is better for active individuals",
        icon: "⚡",
      },
    ]
  
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-black mb-4">Sizing Tips & Tricks</h2>
            <p className="text-xl text-gray-600">Get the most accurate measurement possible</p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  