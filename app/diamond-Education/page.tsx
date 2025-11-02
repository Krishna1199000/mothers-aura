"use client"
import DiamondEducationHero from "@/components/diamond-education-hero"
import DiamondFourCs from "@/components/diamond-four-cs"
import DiamondShapes from "@/components/diamond-shapes"
import DiamondCutting from "@/components/diamond-cutting"
import EducationCTA from "@/components/education-cta"
import { Footer } from "@/components/Footer"
import { AnnouncementBar } from "@/components/AnnouncementBar"
import { Header } from "@/components/Header"

export default function DiamondEducationPage() {
  return (
    <>
    <AnnouncementBar forceShow />
    <div className="sticky top-0 z-40">
      <Header />
    </div>
    <main className="min-h-screen bg-white">
      <DiamondEducationHero />
      <DiamondFourCs />
      <DiamondShapes />
      <DiamondCutting />
      <EducationCTA />
      <Footer />
    </main>
    </>
  )
}
