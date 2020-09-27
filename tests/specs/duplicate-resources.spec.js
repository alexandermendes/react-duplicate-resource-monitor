import { renderHook } from '@testing-library/react-hooks';

import { useResourceMonitor } from '../../src';
import { createPerformanceApi } from '../utils';

const originalConsoleError = console.error;

const resourceTypes = [
  'script',
  'css',
  'link',
  'img',
  'xmlhttprequest',
  'iframe',
];

describe('Duplicate resources', () => {
  let perfUtils;

  beforeEach(() => {
    perfUtils = createPerformanceApi();
  });

  afterEach(() => {
    console.error = originalConsoleError;

    perfUtils.clearCustomEntries();
  });

  it.each(resourceTypes)('does not print a warning by default if a duplicate %s resource is detected', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).not.toHaveBeenCalled();
  });

  it.each(resourceTypes)('prints a warning for a duplicate %s resource if given as a checked type', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({
      duplicateTypes: [initiatorType],
    }));

    expect(console.error).toHaveBeenCalledWith(
      `Warning: A ${initiatorType} resource was loaded multiple times: ${url}`,
    );
  });

  it('attaches a PerformanceObserver', async () => {
    renderHook(() => useResourceMonitor());

    const performanceObserver = perfUtils.getMockPerformanceObserver();

    expect(performanceObserver.observe).toHaveBeenCalledWith({
      entryTypes: ['resource'],
    });
  });

  it('disconnects the PerformanceObserver on unmount', async () => {
    const { unmount } = renderHook(() => useResourceMonitor());

    const performanceObserver = perfUtils.getMockPerformanceObserver();

    expect(performanceObserver.disconnect).not.toHaveBeenCalled();

    unmount();

    expect(performanceObserver.disconnect).toHaveBeenCalled();
  });

  it('prints a warning for a duplicate resources detected after the initial run', () => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType: 'script' });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({ duplicateTypes: ['script'] }));

    expect(console.error).not.toHaveBeenCalled();

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType: 'script' });

    PerformanceObserver.mock.calls[0][0](performance);

    expect(console.error).toHaveBeenCalledWith(
      `Warning: A script resource was loaded multiple times: ${url}`,
    );
  });

  it('ignores query params by default', () => {
    const urlOne = 'http://example.com/my-resource?timestamp=123';
    const urlTwo = 'http://example.com/my-resource?timestamp=456';

    perfUtils.addEntry({ entryType: 'resource', name: urlOne, initiatorType: 'script' });
    perfUtils.addEntry({ entryType: 'resource', name: urlTwo, initiatorType: 'script' });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({
      duplicateTypes: ['script'],
    }));

    expect(console.error).toHaveBeenCalledWith(
      'Warning: A script resource was loaded multiple times: http://example.com/my-resource',
    );
  });

  it('does not ignore query params if option set', () => {
    const urlOne = 'http://example.com/my-resource?timestamp=123';
    const urlTwo = 'http://example.com/my-resource?timestamp=456';

    perfUtils.addEntry({ entryType: 'resource', name: urlOne, initiatorType: 'script' });
    perfUtils.addEntry({ entryType: 'resource', name: urlTwo, initiatorType: 'script' });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({
      duplicateTypes: ['script'],
      duplicateIgnoreQuery: false,
    }));

    expect(console.error).not.toHaveBeenCalled();
  });
});
