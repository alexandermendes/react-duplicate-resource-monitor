import { useEffect } from 'react';
import { printWarning } from './print';

export const useTTFBMonitor = ({
  limit = null,
}) => {
  useEffect(() => {
    if (!limit) {
      return;
    }

    const [{ responseStart, startTime } = {}] = performance.getEntriesByType('navigation');
    const ttfb = responseStart - startTime;

    if (Number.isNaN(ttfb)) {
      return;
    }

    if (ttfb < limit) {
      return;
    }

    printWarning(`The TTFB was above your defined limit of ${limit}ms (received ${ttfb}ms)`);
  }, [limit]);
};
