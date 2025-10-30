"use client"

import { ChevronDown } from "lucide-react"

interface AccordionItem {
  title: string
  content: string
}

const accordionItems: AccordionItem[] = [
  {
    title: "How to Clean Your Diamonds at Home",
    content:
      "Mix warm water with mild dish soap and gently scrub your diamond with a soft toothbrush. Rinse thoroughly with clean water and pat dry with a lint-free cloth. Avoid harsh chemicals and ultrasonic cleaners for delicate settings.",
  },
  {
    title: "Proper Storage Methods",
    content:
      "Store each diamond separately in a soft pouch or jewelry box with compartments. Keep away from direct sunlight and extreme temperatures. Never store diamonds with other jewelry that could scratch them. Use acid-free tissue paper for additional protection.",
  },
  {
    title: "When to Seek Professional Cleaning",
    content:
      "Professional cleaning is recommended annually or when diamonds appear dull. Professional jewelers use specialized equipment and solutions that are safe for all diamond types and settings. They can also inspect for loose stones or damaged settings during the cleaning process.",
  },
  {
    title: "Protecting Your Diamond Investment",
    content:
      "Have your diamonds professionally appraised and insured. Keep documentation of your diamonds including certificates and photographs. Avoid wearing diamonds during strenuous activities or when using harsh chemicals. Regular maintenance extends the life and beauty of your diamonds.",
  },
  {
    title: "Common Mistakes to Avoid",
    content:
      "Never use bleach, chlorine, or abrasive cleaners on diamonds. Avoid exposing diamonds to extreme temperature changes. Do not attempt to repair loose settings yourself. Never store diamonds in plastic bags as they can trap moisture. Avoid wearing diamonds while gardening or doing household chores.",
  },
]

interface CareAccordionProps {
  expandedIndex: number | null
  setExpandedIndex: (index: number | null) => void
}

export default function CareAccordion({ expandedIndex, setExpandedIndex }: CareAccordionProps) {
  return (
    <div className="space-y-4">
      {accordionItems.map((item, index) => (
        <div
          key={index}
          className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-600 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-blue-50 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold text-black text-left">{item.title}</h3>
            <ChevronDown
              className={`w-5 h-5 text-blue-600 transition-transform duration-300 flex-shrink-0 ${
                expandedIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedIndex === index && (
            <div className="px-6 py-5 bg-blue-50 border-t-2 border-blue-200 animate-scale-in">
              <p className="text-gray-700 leading-relaxed">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
