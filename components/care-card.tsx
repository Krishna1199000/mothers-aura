"use client"

interface CareCardProps {
  icon: string
  title: string
  description: string
  delay: string
}

export default function CareCard({ icon, title, description, delay }: CareCardProps) {
  return (
    <div
      className="group p-8 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold text-black mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-6 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
    </div>
  )
}
