"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface AnnouncementBarProps {
  forceShow?: boolean;
}

export const AnnouncementBar = ({ forceShow = false }: AnnouncementBarProps) => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    {
      text: "Sign up to our Late Spring sale, for up to 20% off.",
      buttonText: "GET ACCESS",
      buttonAction: () => window.open('/signup', '_self')
    },
    {
      text: "Free worldwide shipping on orders over $500.",
      buttonText: "SHOP NOW",
      buttonAction: () => window.open('/products', '_self')
    },
    {
      text: "New diamond collection just arrived! Limited time offer.",
      buttonText: "VIEW COLLECTION",
      buttonAction: () => window.open('/diamonds', '_self')
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  // Hide for signed-in pages unless explicitly forced (landing page)
  if (!forceShow && status !== "loading" && session?.user) return null;

  return (
    <div className="bg-gray-50 text-gray-800 py-2 px-4 text-sm overflow-hidden">
      <div className="container mx-auto">
        <div className="flex justify-center items-center relative">
          <div className="flex items-center min-h-[32px]">
            <div 
              key={currentIndex}
              className="flex items-center animate-fade-in"
              style={{
                animation: 'fadeInSlide 0.5s ease-in-out'
              }}
            >
              <p className="text-center">{announcements[currentIndex].text}</p>
              <button 
                onClick={announcements[currentIndex].buttonAction}
                className="ml-4 px-3 py-1 border border-gray-300 text-gray-800 text-xs uppercase tracking-wide hover:bg-gray-100 transition-colors"
              >
                {announcements[currentIndex].buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};