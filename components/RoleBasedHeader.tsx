"use client";

import { useSession } from "next-auth/react";
import { DashboardHeader } from "./DashboardHeader";

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface ExtendedSession {
  user?: SessionUser;
}

export const RoleBasedHeader = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };

  if (!session || !session.user) {
    return null;
  }

  return <DashboardHeader />;
};