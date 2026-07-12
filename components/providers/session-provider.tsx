"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_USERS } from "@/lib/data";
import type { Role, User } from "@/lib/types";

const STORAGE_KEY = "carebridge.role";

interface SessionContextValue {
  user: User | null;
  role: Role | null;
  isReady: boolean;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Role | null;
      if (stored && stored in DEMO_USERS) {
        setRole(stored);
      }
    } catch {
      // ignore storage errors
    }
    setIsReady(true);
  }, []);

  const persist = useCallback((next: Role | null) => {
    setRole(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, next);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: role ? DEMO_USERS[role] : null,
      role,
      isReady,
      login: (r: Role) => persist(r),
      logout: () => persist(null),
      switchRole: (r: Role) => persist(r),
    }),
    [role, isReady, persist],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
