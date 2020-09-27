import { useEffect } from 'react';
import { printWarning } from './print';

/**
 * Check for duplicate resources being loaded.
 */
export const useDuplicateResourceMonitor = ({
  initiatorTypes = ['script', 'link', 'css'],
  ignoreQuery = true,
} = {}) => {
  useEffect(() => {
    const resources = [];
    const reportedResources = [];

    /**
     * Check for duplicate resources and print a warning if any found.
     */
    const checkForDuplicates = (newEntries) => {
      resources.push(...newEntries);

      const resourcesByUrl = resources
        .filter(({ initiatorType }) => initiatorTypes.includes(initiatorType))
        .reduce((acc, entry) => {
          const url = new URL(entry.name);

          if (ignoreQuery) {
            url.search = '';
          }

          const { href } = url;

          return {
            ...acc,
            [href]: [
              ...(acc[href] || []),
              entry,
            ],
          };
        }, {});

      Object
        .entries(resourcesByUrl)
        .forEach(([url, entries]) => {
          if (entries.length < 2 || reportedResources.includes(url)) {
            return;
          }

          printWarning(`A ${entries[0].initiatorType} resource was loaded multiple times: ${url}`);

          reportedResources.push(url);
        });
    };

    // Check resources already loaded
    checkForDuplicates(performance.getEntriesByType('resource'));

    // Check resources subsequently loaded
    const observer = new PerformanceObserver((list) => {
      checkForDuplicates(list.getEntries());
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return true;
};
