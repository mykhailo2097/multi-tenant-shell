import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../api/types';
import { SessionContext } from './session.context';
import type { SessionContextValue } from './session.context';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      signIn: setUser,
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
