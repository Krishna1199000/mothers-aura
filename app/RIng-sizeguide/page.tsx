"use client"
import RingSizeHero from "@/components/ring-size-hero"
import RingSizeMeasurement from "@/components/ring-size-measurement"
import RingSizeChart from "@/components/ring-size-chart"
import RingSizeTips from "@/components/ring-size-tips"
import RingSizeCTA from "@/components/ring-size-cta"

export default function RingSizeGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <RingSizeHero />
      <RingSizeMeasurement />
      <RingSizeChart />
      <RingSizeTips />
      <RingSizeCTA />
    </main>
  )
}
