"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface AnnouncementBarProps {
  forceShow?: boolean;
}

export const AnnouncementBar = ({ forceShow = false }: AnnouncementBarProps) => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<{
    text: string;
    buttonText?: string | null;
    buttonUrl?: string | null;
  }[]>([]);

  useEffect(() => {
    // Load active announcements
    const load = async () => {
      try {
        const res = await fetch('/api/announcements', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAnnouncements(data);
            return;
          }
        }
        // Fallback defaults
        setAnnouncements([
          { text: 'Free worldwide shipping on orders over $500.', buttonText: 'SHOP NOW', buttonUrl: '/products' },
        ]);
      } catch {
        setAnnouncements([
          { text: 'Free worldwide shipping on orders over $500.', buttonText: 'SHOP NOW', buttonUrl: '/products' },
        ]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);

  // Hide for signed-in pages unless explicitly forced (landing page)
  if (!forceShow && status !== "loading" && session?.user) return null;

  return (
    <div className="text-white py-2 px-4 text-sm overflow-hidden" style={{ backgroundColor: '#112158' }}>
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
              <p className="text-center truncate max-w-[180px] sm:max-w-none text-xs sm:text-sm">{announcements[currentIndex]?.text}</p>
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