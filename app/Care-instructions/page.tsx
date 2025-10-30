"use client"

import { useState } from "react"
import CareHero from "@/components/care-hero"
import CareCard from "@/components/care-card"
import CareAccordion from "@/components/care-accordion"
import CareTimeline from "@/components/care-timeline"

export default function CareInstructionsPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-white text-black">
      <CareHero />

      {/* Quick Tips Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Essential Care Tips</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep your diamonds radiant and brilliant with these professional care guidelines
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <CareCard
            icon="✨"
            title="Regular Cleaning"
            description="Clean your diamonds weekly with mild soap and warm water to maintain their sparkle and brilliance."
            delay="0s"
          />
          <CareCard
            icon="🛡️"
            title="Safe Storage"
            description="Store diamonds separately in soft pouches to prevent scratches and damage from other jewelry."
            delay="0.2s"
          />
          <CareCard
            icon="👨‍🔧"
            title="Professional Check-ups"
            description="Have your diamonds inspected annually by a professional jeweler to ensure settings remain secure."
            delay="0.4s"
          />
        </div>
      </section>

      {/* Detailed Care Guide */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Complete Care Guide</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <CareAccordion expandedIndex={expandedIndex} setExpandedIndex={setExpandedIndex} />
        </div>
      </section>

      {/* Maintenance Timeline */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Maintenance Schedule</h2>
          <p className="text-lg text-gray-600">Follow this timeline to keep your diamonds in perfect condition</p>
        </div>

        <CareTimeline />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Need Professional Help?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our expert jewelers are ready to assist with professional cleaning and maintenance services
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
            Schedule Service
          </button>
        </div>
      </section>
    </main>
  )
}
