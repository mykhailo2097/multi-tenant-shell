import { createContext, useContext } from 'react';
import type { ApiClient } from './types';
import { mockApiClient } from './mockApi';

export const ApiContext = createContext<ApiClient>(mockApiClient);

export function useApi(): ApiClient {
  return useContext(ApiContext);
}
