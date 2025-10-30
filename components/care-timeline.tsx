"use client"

interface TimelineEvent {
  period: string
  title: string
  tasks: string[]
}

const timelineEvents: TimelineEvent[] = [
  {
    period: "Weekly",
    title: "Regular Maintenance",
    tasks: ["Gentle cleaning with soap and water", "Visual inspection for damage", "Pat dry with soft cloth"],
  },
  {
    period: "Monthly",
    title: "Detailed Check",
    tasks: ["Inspect setting security", "Check for loose stones", "Clean hard-to-reach areas"],
  },
  {
    period: "Quarterly",
    title: "Deep Care",
    tasks: ["Professional polish if needed", "Setting inspection", "Documentation update"],
  },
  {
    period: "Annually",
    title: "Professional Service",
    tasks: ["Professional cleaning", "Complete inspection", "Certification renewal"],
  },
]

export default function CareTimeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-300"></div>

      <div className="space-y-12">
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row gap-8 animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* Left side - for even indices */}
            {index % 2 === 0 ? (
              <>
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <div className="bg-white border-2 border-blue-600 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-3">
                      {event.period}
                    </span>
                    <h3 className="text-2xl font-bold text-black mb-4">{event.title}</h3>
                    <ul className="space-y-2">
                      {event.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-gray-600 flex md:justify-end items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Center dot */}
                <div className="hidden md:flex md:w-auto justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2"></div>
              </>
            ) : (
              <>
                <div className="md:w-1/2"></div>
                {/* Center dot */}
                <div className="hidden md:flex md:w-auto justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white border-2 border-blue-600 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-3">
                      {event.period}
                    </span>
                    <h3 className="text-2xl font-bold text-black mb-4">{event.title}</h3>
                    <ul className="space-y-2">
                      {event.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
