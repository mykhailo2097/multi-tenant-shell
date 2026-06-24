import { createContext, useContext } from 'react';
import type { User } from '../api/types';

export interface SessionContextValue {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a <SessionProvider>');
  return ctx;
}
