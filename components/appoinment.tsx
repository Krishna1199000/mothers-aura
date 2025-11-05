import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { AppointmentForm } from '@/components/AppointmentForm';

export default function DiamondAppointment() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Slider images (keep sizes as-is)
  const sliderImages = [
    '/Mothers-aura-appointment1.jpg',
    '/inperson.jpg'
  ];

  // Auto-advance every 5 seconds; pause on hover/hold
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused, sliderImages.length]);

  const storeHours = [
    { day: 'Mon', hours: '09:00 am – 05:00 pm', open: true },
    { day: 'Tue', hours: '09:00 am – 05:00 pm', open: true },
    { day: 'Wed', hours: '09:00 am – 05:00 pm', open: true },
    { day: 'Thu', hours: '09:00 am – 05:00 pm', open: true },
    { day: 'Fri', hours: '09:00 am – 05:00 pm', open: true },
    { day: 'Sat', hours: 'Closed', open: false },
    { day: 'Sun', hours: 'Closed', open: false }
  ];

  // Get current day (Saturday for today)
  const today = new Date();
  const dayIndex = today.getDay(); // 0 = Sunday, 6 = Saturday
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = dayNames[dayIndex];
  const todaySchedule = storeHours.find(schedule => schedule.day === currentDay);

  return (
    <div className="bg-[#EEF7FC] dark:bg-gray-950 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-4 tracking-tight">
            Experience Elegance
            <span className="block mt-2">In Person</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Book your private consultation or visit our showroom to discover timeless beauty
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left Side - Image Slider (no buttons, pauses on hold) */}
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div 
              className={`relative group transition-all duration-500 ${hoursExpanded ? 'scale-105' : 'scale-100'}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Slider */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                {sliderImages.map((src, index) => (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Image
                      src={src}
                      alt={index === 0 ? 'Mothers Aura Diamond Store' : 'In Person Experience'}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                {/* Ensure a fixed height context for absolutely positioned slides */}
                <div className="invisible">
                  <Image src={sliderImages[0]} alt="size-holder" width={800} height={600} />
                </div>
                
                {/* Today's Status Badge */}
                <div className="absolute top-6 right-6 bg-white dark:bg-gray-900 rounded-lg px-5 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${todaySchedule?.open ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="font-semibold text-black dark:text-white">
                      {todaySchedule?.open ? 'Open Now' : 'Closed Today'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Additional Content when dropdown is expanded */}
              {hoursExpanded && (
                <div className="mt-6 transition-all duration-500 opacity-100 translate-y-0">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-xl font-bold text-black dark:text-white mb-4">Why Choose Us?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 dark:text-green-400 font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black dark:text-white">Expert Consultation</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Personalized diamond selection with certified gemologists</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black dark:text-white">Certified Quality</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Every diamond comes with GIA or IGI certification</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black dark:text-white">Lifetime Warranty</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive protection for your precious investment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Action Cards */}
          <div className={`space-y-4 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Book Appointment Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 overflow-hidden group cursor-pointer transform hover:-translate-y-1 ">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <Calendar className="text-black dark:text-white" size={32} />
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:translate-x-2 transition-all duration-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Book an Appointment
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Schedule a private consultation with our diamond experts
                </p>
                <button 
                  onClick={() => setIsAppointmentFormOpen(true)}
                  className="w-full bg-black dark:bg-white dark:text-black text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Schedule Now
                </button>
              </div>
            </div>

            {/* Visit Store Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 overflow-hidden group cursor-pointer transform hover:-translate-y-1 ">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <MapPin className="text-black dark:text-white" size={32} />
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:translate-x-2 transition-all duration-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Visit Our Showroom
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Bhav Residency, Flat 203, 2nd Floor
                  <br />
                  Bldg No. 09, 2532/17, Near Datta Mandir
                  <br />
                  Kalher, Thane - 421302
                  <br />
                  Maharashtra, India
                </p>
                <div className="flex items-center gap-4 mb-1">
                  <Phone className="text-gray-600 dark:text-gray-300" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">+91 86575 85167</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="text-gray-600 dark:text-gray-300" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">+91 78418 34563</span>
                </div>
                <button 
                  onClick={() => {
                    const address = 'Bhav Residency, Kalher, Thane - 421302, Maharashtra, India';
                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full bg-black dark:bg-white dark:text-black text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Get Directions
                </button>
              </div>
            </div>

            {/* Store Hours Card with Dropdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden ">
              {/* Header - Always Visible */}
              <div 
                onClick={() => setHoursExpanded(!hoursExpanded)}
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <Clock className="text-black dark:text-white" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-2 h-2 rounded-full ${todaySchedule?.open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-bold text-black dark:text-white">
                          {todaySchedule?.open ? 'Closed today' : 'Closed today'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {currentDay} · {todaySchedule?.hours}
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`text-gray-400 transition-transform duration-300 ${hoursExpanded ? 'rotate-180' : ''}`} 
                    size={24} 
                  />
                </div>
              </div>

              {/* Expandable Hours List */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  hoursExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-6 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                  {storeHours.map((schedule, index) => (
                    <div
                      key={schedule.day}
                      className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                        schedule.day === currentDay 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 font-semibold' 
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                      }`}
                      style={{
                        transitionDelay: hoursExpanded ? `${index * 30}ms` : '0ms'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${schedule.open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-black dark:text-white font-medium">{schedule.day}</span>
                      </div>
                      <span className={`font-medium ${schedule.open ? 'text-gray-700 dark:text-gray-300' : 'text-red-600'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Appointment Form Dialog */}
      <AppointmentForm 
        isOpen={isAppointmentFormOpen} 
        onClose={() => setIsAppointmentFormOpen(false)} 
      />
    </div>
  );
}