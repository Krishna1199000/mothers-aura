"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";

export default function PrivacyPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const sections = [
    {
      title: "Information We Collect",
      content: "Welcome to Mothers Aura Diamonds Privacy Policy. This policy outlines how we collect, use, disclose, and protect your information when you visit our website. Please read this policy carefully. By accessing or using our Website, you agree to the terms of this Privacy Policy.",
      subsections: [
        {
          title: "Personal Information",
          content: "We collect personal information you provide to us voluntarily, such as your name, email address, phone number, and any other details you choose to share."
        },
        {
          title: "Usage Data",
          content: "We automatically collect information about your interactions with our Website, including IP address, browser type, pages visited, and timestamps."
        }
      ]
    },
    {
      title: "Use of Information",
      content: "We use the information we collect for the following purposes:",
      bullets: [
        "To provide and maintain our Website, including customer support.",
        "To improve and personalize our Website's features and services.",
        "To communicate with you, including responding to inquiries and sending updates."
      ]
    },
    {
      title: "Disclosure of Information",
      content: "We may disclose your information:",
      bullets: [
        "To our affiliates, service providers, and partners who assist us in operating our Website.",
        "When required by law or to protect our rights and property."
      ]
    },
    {
      title: "Cookies and Tracking Technologies",
      content: "Our Website uses cookies and similar tracking technologies to enhance user experience, analyze trends, and gather demographic information about our user base."
    },
    {
      title: "Changes to This Privacy Policy",
      content: "We may update this Privacy Policy periodically. We will notify you of any changes by posting the updated Privacy Policy on our Website with a new effective date."
    },
    {
      title: "Contact Us",
      content: "If you have any questions or concerns about this Privacy Policy, please contact us at admintejas@mothersauradiamonds.com or +91 86575 85167"
    }
  ];

  return (
    <>
    <AnnouncementBar forceShow />
    <div className="sticky top-0 z-40">
      <Header />
    </div>
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div {...fadeIn} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Your privacy is important to us. Learn how we protect your data.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{section.content}</p>
                  
                  {section.subsections && (
                    <div className="space-y-4 mt-4">
                      {section.subsections.map((subsection, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <h3 className="font-semibold text-lg mb-2">{subsection.title}</h3>
                          <p className="text-muted-foreground">{subsection.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {section.bullets && (
                    <ul className="list-disc list-inside space-y-2">
                      {section.bullets.map((bullet, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="text-muted-foreground"
                        >
                          {bullet}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
