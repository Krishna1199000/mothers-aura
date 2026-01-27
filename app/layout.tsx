import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/Providers"
import { LoadingProvider } from "@/app/loading-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mothers Aura - Brilliance, Honestly Priced | Premium Diamond Jewellery",
  description:
    "Cut the middle-man. Exceptional diamonds and fine jewellery direct to you. Engagement rings, wedding rings, and certified diamonds at honest prices.",
  keywords:
    "diamonds, engagement rings, wedding rings, jewellery, certified diamonds, lab-grown diamonds, natural diamonds",
  openGraph: {
    title: "Mothers Aura - Premium Diamond Jewellery",
    description: "Exceptional diamonds and fine jewellery direct to you at honest prices.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mothers Aura - Premium Diamond Jewellery",
    description: "Exceptional diamonds and fine jewellery direct to you at honest prices.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  // Only set to light if no preference exists or if it was set to system
                  if (!stored || stored === 'system') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    localStorage.setItem('theme', 'light');
                  } else if (stored === 'dark') {
                    // User has explicitly chosen dark mode, keep it
                    document.documentElement.classList.add('dark');
                  } else {
                    // User has explicitly chosen light mode
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `:root { color-scheme: light; }` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mothers Aura",
              description: "Premium diamond jewellery direct to customers",
              url: "https://mothersaura.co.uk",
              logo: "https://mothersaura.co.uk/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+44-20-7123-4567",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body className={`antialiased ${inter.className}`}>
        <Providers>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  )
}
