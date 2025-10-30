"use client"

import { useEffect, useState } from "react"

const steps = [
  {
    number: "01",
    title: "Diamond Selection",
    description: "Carefully selected diamonds meeting our quality standards",
  },
  {
    number: "02",
    title: "Expert Evaluation",
    description: "Thorough examination by certified gemologists",
  },
  {
    number: "03",
    title: "Certification",
    description: "Official grading and certification by recognized institutes",
  },
  {
    number: "04",
    title: "Documentation",
    description: "Complete certification report with laser inscription",
  },
]

export function CertificationProcess() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            <span className="text-balance">Our Certification Process</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A rigorous, transparent process ensuring every diamond meets our standards
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 transform -translate-y-1/2" />

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Step circle */}
                <div
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg mb-6 mx-auto transition-all duration-500 cursor-pointer ${
                    activeStep === index
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                      : "bg-card border-2 border-primary/30 text-primary hover:border-primary/60"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {step.number}
                </div>

                {/* Step content */}
                <div
                  className={`text-center transition-all duration-300 ${activeStep === index ? "opacity-100" : "opacity-60"}`}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
