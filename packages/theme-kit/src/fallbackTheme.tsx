import './fallback.css';
import { defineTheme } from './types';
import { FallbackButton } from './FallbackButton';
import { FallbackCard } from './FallbackCard';

export const fallbackTheme = defineTheme({
  id: 'fallback',
  name: 'Default',
  tokenClass: 'theme-fallback',
  components: { Button: FallbackButton, Card: FallbackCard },
});
