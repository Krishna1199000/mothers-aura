"use client";

import { useSession } from "next-auth/react";

interface AnnouncementBarProps {
  forceShow?: boolean;
}

export const AnnouncementBar = ({ forceShow = false }: AnnouncementBarProps) => {
  const { data: session, status } = useSession();

  // Hide for signed-in pages unless explicitly forced (landing page)
  if (!forceShow && status !== "loading" && session?.user) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-sm">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <p className="text-center">Free shipping across USA for just $0</p>
        </div>
      </div>
    </div>
  );
};