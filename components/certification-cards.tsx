"use client"

import { useEffect, useState } from "react"

const certifications = [
  {
    id: 1,
    name: "GIA Certified",
    description: "Gemological Institute of America - The most trusted diamond certification worldwide",
    icon: "💎",
    features: ["4Cs Grading", "Laser Inscription", "Lifetime Validity"],
    color: "from-blue-50 to-blue-100/50",
  },
  {
    id: 2,
    name: "AGS Certified",
    description: "American Gem Society - Rigorous standards for cut quality and light performance",
    icon: "✨",
    features: ["Cut Excellence", "Light Performance", "Precision Grading"],
    color: "from-indigo-50 to-indigo-100/50",
  },
  {
    id: 3,
    name: "IGI Certified",
    description: "International Gemological Institute - Global recognition and expertise",
    icon: "🔍",
    features: ["Detailed Reports", "International Standard", "Quality Assurance"],
    color: "from-slate-50 to-slate-100/50",
  },
]

export function CertificationCards() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    certifications.forEach((cert, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, cert.id])
      }, index * 150)
    })
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            <span className="text-balance">World-Class Certifications</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our diamonds are certified by the most respected gemological institutes globally
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`group relative transition-all duration-500 ${
                visibleCards.includes(cert.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Card background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cert.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Card content */}
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {cert.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-2">{cert.name}</h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">{cert.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {cert.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn more link */}
                <button className="text-primary font-semibold text-sm hover:gap-2 flex items-center gap-1 transition-all duration-300 group/link">
                  Learn More
                  <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

