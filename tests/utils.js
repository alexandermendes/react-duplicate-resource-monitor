/**
 * Mock PerformanceResourceTiming.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
 */
class PerformanceResourceTiming {
  constructor({
    name = '',
    startTime = 0,
    initiatorType,
    nextHopProtocol,
    workerStart = 0,
    redirectStart = 0,
    redirectEnd = 0,
    fetchStart = 0,
    domainLookupStart = 0,
    domainLookupEnd = 0,
    connectStart = 0,
    connectEnd = 0,
    secureConnectionStart = 0,
    requestStart = 0,
    responseEnd = 0,
    transferSize = 0,
    encodedBodySize = 0,
    decodedBodySize = 0,
    serverTiming = [],
  } = {}) {
    this.entryType = 'resource';
    this.name = name;
    this.startTime = startTime;
    this.duration = responseEnd - startTime;
    this.initiatorType = initiatorType;
    this.nextHopProtocol = nextHopProtocol;
    this.workerStart = workerStart;
    this.redirectStart = redirectStart;
    this.redirectEnd = redirectEnd;
    this.fetchStart = fetchStart;
    this.domainLookupStart = domainLookupStart;
    this.domainLookupEnd = domainLookupEnd;
    this.connectStart = connectStart;
    this.connectEnd = connectEnd;
    this.secureConnectionStart = secureConnectionStart;
    this.requestStart = requestStart;
    this.responseEnd = responseEnd;
    this.transferSize = transferSize;
    this.encodedBodySize = encodedBodySize;
    this.decodedBodySize = decodedBodySize;
    this.serverTiming = serverTiming;
  }

  toJSON() {
    return JSON.stringify(this);
  }
}

/**
 * Modify the Performance API, adding functionality so we can push entries.
 */
export const createPerformanceApi = () => {
  const entries = [];

  const originalGetEntries = performance.getEntries;
  const originalGetEntriesByType = performance.getEntriesByType;
  const originalGetEntriesByName = performance.getEntriesByName;

  Object.defineProperty(performance, 'getEntries', {
    configurable: true,
    value: () => [...originalGetEntries(), ...entries],
  });

  Object.defineProperty(performance, 'getEntriesByType', {
    configurable: true,
    value: (type) => [
      ...originalGetEntriesByType(type),
      ...entries.filter(({ entryType }) => entryType === type),
    ],
  });

  Object.defineProperty(performance, 'getEntriesByName', {
    configurable: true,
    value: (name) => [
      ...originalGetEntriesByName(name),
      ...entries.filter(({ name: entryName }) => entryName === name),
    ],
  });

  return {
    addPerformanceResourceTimingEntry: (opts) => {
      entries.push(Object.freeze(new PerformanceResourceTiming(opts)));
    },
  };
};
