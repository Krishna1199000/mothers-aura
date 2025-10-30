"use client"

import { CertificationsHero } from "@/components/certifications-hero"
import { CertificationCards } from "@/components/certification-cards"
import { CertificationProcess } from "@/components/certification-process"
import { CertificationBenefits } from "@/components/certification-benefits"
import { CertificationCTA } from "@/components/certifications-cta"

export default function CertificationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <CertificationsHero />
      <CertificationCards />
      <CertificationProcess />
      <CertificationBenefits />
      <CertificationCTA />
    </main>
  )
}
