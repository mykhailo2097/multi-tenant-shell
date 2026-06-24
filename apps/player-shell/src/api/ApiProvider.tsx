import type { ReactNode } from 'react';
import type { ApiClient } from './types';
import { mockApiClient } from './mockApi';
import { ApiContext } from './api.context';

export function ApiProvider({
  client = mockApiClient,
  children,
}: {
  client?: ApiClient;
  children: ReactNode;
}) {
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}
