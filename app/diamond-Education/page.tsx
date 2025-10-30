"use client"
import DiamondEducationHero from "@/components/diamond-education-hero"
import DiamondFourCs from "@/components/diamond-four-cs"
import DiamondShapes from "@/components/diamond-shapes"
import DiamondCutting from "@/components/diamond-cutting"
import EducationCTA from "@/components/education-cta"

export default function DiamondEducationPage() {
  return (
    <main className="min-h-screen bg-white">
      <DiamondEducationHero />
      <DiamondFourCs />
      <DiamondShapes />
      <DiamondCutting />
      <EducationCTA />
    </main>
  )
}
