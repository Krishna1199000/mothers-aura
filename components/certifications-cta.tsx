"use client"

import { useEffect, useState } from "react"

export function CertificationCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Icon */}
          <div className="text-6xl mb-6 animate-bounce">💎</div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            <span className="text-balance">
              Ready to Own a<span className="block text-primary">Certified Diamond?</span>
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse our collection of certified diamonds and find the perfect stone for your special moment. Every
            diamond comes with complete certification and lifetime authenticity guarantee.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95">
              Browse Certified Diamonds
            </button>
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all duration-300">
              Contact Our Experts
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Certified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">25+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
