export default function DiamondFourCs() {
    const fourCs = [
      {
        title: "Carat",
        description: "The weight of the diamond. One carat equals 200 milligrams.",
        details: "Higher carat weight typically means a larger diamond, but quality matters more than size.",
        icon: "⚖️",
      },
      {
        title: "Cut",
        description: "How well the diamond is shaped and faceted to maximize brilliance.",
        details: "The cut determines how light reflects through the diamond, affecting its sparkle and beauty.",
        icon: "✨",
      },
      {
        title: "Color",
        description: "The absence of color in a diamond. Graded from D (colorless) to Z.",
        details: "Colorless diamonds are rarer and more valuable than those with slight color tints.",
        icon: "🎨",
      },
      {
        title: "Clarity",
        description: "The absence of inclusions and blemishes in the diamond.",
        details: "Most diamonds have tiny imperfections invisible to the naked eye.",
        icon: "🔍",
      },
    ]
  
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-black mb-4">The 4 Cs of Diamonds</h2>
            <p className="text-xl text-gray-600">The universal standard for evaluating diamond quality</p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-8">
            {fourCs.map((c, index) => (
              <div
                key={index}
                className="group p-8 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all duration-300 hover:shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{c.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-3">{c.title}</h3>
                <p className="text-gray-700 mb-4">{c.description}</p>
                <p className="text-gray-600 text-sm">{c.details}</p>
                <div className="mt-4 h-1 w-12 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  