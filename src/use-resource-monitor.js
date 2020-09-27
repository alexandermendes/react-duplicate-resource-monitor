import { useDuplicateResourceMonitor } from './use-duplicate-resource-monitor';
import { useTTFBMonitor } from './use-ttfb-monitor';

const noop = () => {};

export const useResourceMonitor = typeof window === 'undefined' ? noop : ({
  ttfbLimit,
  duplicateTypes,
  duplicateIgnoreQuery,
} = {}) => {
  if (typeof window.performance === 'undefined') {
    return;
  }

  if (typeof PerformanceObserver === 'undefined') {
    return;
  }

  useDuplicateResourceMonitor({
    types: duplicateTypes,
    ignoreQuery: duplicateIgnoreQuery,
  });

  useTTFBMonitor({
    limit: ttfbLimit,
  });
};
