/**
 * Global TypeScript declarations
 */

// Google Analytics gtag.js
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, unknown>
  ) => void;
}
