import { useDuplicateResourceMonitor } from './use-duplicate-resource-monitor';
import { useTTFBMonitor } from './use-ttfb-monitor';

export const useResourceMonitor = ({
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
