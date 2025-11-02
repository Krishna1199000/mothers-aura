"use client"

import { CertificationsHero } from "@/components/certifications-hero"
import { CertificationCards } from "@/components/certification-cards"
import { CertificationProcess } from "@/components/certification-process"
import { CertificationBenefits } from "@/components/certification-benefits"
import { CertificationCTA } from "@/components/certifications-cta"
import { Footer } from "@/components/Footer"
import { AnnouncementBar } from "@/components/AnnouncementBar"
import { Header } from "@/components/Header"

export default function CertificationsPage() {
  return (
    <>
    <AnnouncementBar forceShow />
    <div className="sticky top-0 z-40">
      <Header />
    </div>
    <main className="min-h-screen bg-background">
      <CertificationsHero />
      <CertificationCards />
      <CertificationProcess />
      <CertificationBenefits />
      <CertificationCTA />
      <Footer />
    </main>
    </>
  )
}
