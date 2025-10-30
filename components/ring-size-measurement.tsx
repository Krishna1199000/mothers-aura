"use client"

import { useState } from "react"

export default function RingSizeMeasurement() {
  const [activeMethod, setActiveMethod] = useState(0)

  const methods = [
    {
      title: "String Method",
      steps: [
        "Wrap a piece of string around your finger",
        "Mark where the string overlaps",
        "Measure the string length in millimeters",
        "Use our chart to find your size",
      ],
      icon: "📏",
    },
    {
      title: "Paper Strip Method",
      steps: [
        "Cut a thin strip of paper",
        "Wrap it around your finger comfortably",
        "Mark the overlap point",
        "Measure and convert to ring size",
      ],
      icon: "📄",
    },
    {
      title: "Existing Ring Method",
      steps: [
        "Find a ring that fits perfectly",
        "Measure the inner diameter in millimeters",
        "Use our conversion chart",
        "Match to your ring size",
      ],
      icon: "💍",
    },
  ]

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-black mb-4">How to Measure Your Ring Size</h2>
          <p className="text-xl text-gray-600">Choose your preferred measurement method</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {methods.map((method, index) => (
            <button
              key={index}
              onClick={() => setActiveMethod(index)}
              className={`p-8 rounded-xl transition-all duration-300 transform hover:scale-105 animate-scale-in ${
                activeMethod === index
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-black border-2 border-gray-200 hover:border-blue-600"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{method.icon}</div>
              <h3 className="text-xl font-bold">{method.title}</h3>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-12 shadow-lg animate-fade-in-up">
          <h3 className="text-3xl font-bold text-black mb-8">{methods[activeMethod].title}</h3>
          <ol className="space-y-4">
            {methods[activeMethod].steps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <span className="text-lg text-gray-700 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
