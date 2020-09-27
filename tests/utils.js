/**
 * Modify the Performance API, adding functionality so we can push entries.
 */
export const setupEnvironment = () => {
  let entries = [];

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

  const mockPerformanceObserver = {
    observe: jest.fn(),
    disconnect: jest.fn(),
  };

  global.PerformanceObserver = jest.fn().mockImplementation(() => mockPerformanceObserver);

  return {
    addEntry: (opts) => {
      entries.push(Object.freeze(opts));
    },
    reset: () => {
      entries = [];
    },
    getMockPerformanceObserver: () => mockPerformanceObserver,
  };
};
