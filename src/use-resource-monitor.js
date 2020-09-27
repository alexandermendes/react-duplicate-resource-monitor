import { useEffect } from 'react';

const printWarning = (text) => {
  const message = `Warning: ${text}`;

  if (console.error) {
    console.error(message);
  }

  try {
    throw new Error(message);
  } catch (x) { /**/ }
};

export const useResourceMonitor = () => {
  useEffect(() => {
    const initiatorTypes = ['script', 'css'];
    const resources = [];
    const reportedResources = [];

    const checkForDuplicates = (newEntries) => {
      resources.push(...newEntries);

      const trackedResources = resources
        .filter(({ initiatorType }) => initiatorTypes.includes(initiatorType));

      const resourcesByUrl = trackedResources
        .reduce((acc, entry) => {
          const url = new URL(entry.name);

          url.search = '';

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
          if (entries.length > 1 && !reportedResources.includes(url)) {
            printWarning(`A ${entries[0].initiatorType} resource was loaded multiple times: ${url}`);

            reportedResources.push(url);
          }
        });
    };

    // Check resources already loaded
    checkForDuplicates(performance.getEntriesByType('resource'));

    // Check any resources subsequently added
    const observer = new PerformanceObserver((list) => {
      checkForDuplicates(list.getEntries());
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  });

  return true;
};
