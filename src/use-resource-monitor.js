import { useDuplicateResourceMonitor } from './use-duplicate-resource-monitor';
import { useTTFBMonitor } from './use-ttfb-monitor';

export const useResourceMonitor = ({
  ttfbLimit,
  duplicateTypes,
  duplicateIgnoreQuery,
} = {}) => {
  useDuplicateResourceMonitor({
    types: duplicateTypes,
    ignoreQuery: duplicateIgnoreQuery,
  });

  useTTFBMonitor({
    limit: ttfbLimit,
  });
};
