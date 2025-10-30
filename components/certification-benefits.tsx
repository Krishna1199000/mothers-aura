"use client"

const benefits = [
  {
    title: "Authenticity Guaranteed",
    description: "Every diamond is verified and certified by independent gemological experts",
    icon: "✓",
  },
  {
    title: "Investment Value",
    description: "Certified diamonds maintain and appreciate in value over time",
    icon: "📈",
  },
  {
    title: "Transparency",
    description: "Complete documentation of the 4Cs and all diamond characteristics",
    icon: "👁️",
  },
  {
    title: "Peace of Mind",
    description: "Lifetime certification validity with detailed grading reports",
    icon: "🛡️",
  },
  {
    title: "Resale Value",
    description: "Certified diamonds are easier to sell and command better prices",
    icon: "💰",
  },
  {
    title: "Insurance Ready",
    description: "Certification reports are accepted by all major insurance companies",
    icon: "📋",
  },
]

export function CertificationBenefits() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            <span className="text-balance">Why Certification Matters</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Certified diamonds provide confidence, value, and protection for your investment
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-transparent rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
