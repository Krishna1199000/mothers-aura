"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const sections = [
    {
      title: "Agreement Overview",
      content: "Your Terms and Conditions section is like a contract between you and your customers. You make information and services available to your customers, and your customers must follow your rules."
    },
    {
      title: "Common Terms",
      content: [
        "Withdraw and cancel services, and make financial transactions.",
        "Manage customer expectations, such as liability for information errors or website downtime.",
        "Explain your copyright rules, such as attribution, adaptation, commercial or non-commercial use, etc.",
        "Set rules for user behavior, like forbidding unlawful behavior, hate speech, bullying, promotions, spam, etc.",
        "Disable user accounts.",
        "Write down any other terms or conditions that protect you or your audience."
      ]
    },
    {
      title: "Return and Refund Policy",
      subsections: [
        {
          title: "30-Day Return Policy",
          content: "We offer a 30-day return policy from the date of delivery."
        },
        {
          title: "Return Process",
          content: "To initiate a return, please contact our customer service team at info@cranberridiamonds.in"
        },
        {
          title: "Refunds",
          content: "Once we receive your return, our quality assurance team will inspect the item. If approved, a refund will be processed to your original method of payment within 15 business days."
        },
        {
          title: "Cancellations",
          content: "Orders may be canceled within 24 hours of purchase without penalty, unless the item has already been shipped. To cancel an order, please contact us immediately at smithp@cranberridiamonds.in"
        },
        {
          title: "Non-Returnable Items",
          content: "Engraved or customized items (unless defective)."
        }
      ]
    },
    {
      title: "Policy Updates",
      content: "We reserve the right to update or modify this return and refund policy at any time without prior notice. Please review this policy periodically for changes."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div {...fadeIn} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
          <p className="mt-4 text-muted-foreground">
            Please read these terms carefully before using Mothers Aura Diamonds services.
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
                <CardContent>
                  {Array.isArray(section.content) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {section.content.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="text-muted-foreground"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : section.subsections ? (
                    <div className="space-y-6">
                      {section.subsections.map((subsection, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <h3 className="font-semibold text-lg mb-2">{subsection.title}</h3>
                          <p className="text-muted-foreground">{subsection.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{section.content}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
