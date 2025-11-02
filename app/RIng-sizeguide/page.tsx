"use client"
import RingSizeHero from "@/components/ring-size-hero"
import RingSizeMeasurement from "@/components/ring-size-measurement"
import RingSizeChart from "@/components/ring-size-chart"
import RingSizeTips from "@/components/ring-size-tips"
import RingSizeCTA from "@/components/ring-size-cta"
import { Footer } from "@/components/Footer"
import { AnnouncementBar } from "@/components/AnnouncementBar"
import { Header } from "@/components/Header"

export default function RingSizeGuidePage() {
  return (
    <>
    <AnnouncementBar forceShow />
    <div className="sticky top-0 z-40">
      <Header />
    </div>
    <main className="min-h-screen bg-white">
      <RingSizeHero />
      <RingSizeMeasurement />
      <RingSizeChart />
      <RingSizeTips />
      <RingSizeCTA />
      <Footer />
    </main>
    </>
  )
}
