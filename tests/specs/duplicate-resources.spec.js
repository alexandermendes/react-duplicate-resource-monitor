import { renderHook } from '@testing-library/react-hooks';

import { useResourceMonitor } from '../../src';
import { createPerformanceApi } from '../utils';

const originalConsoleError = console.error;

describe('Duplicate resources', () => {
  let perfUtils;

  beforeEach(() => {
    perfUtils = createPerformanceApi();
  });

  afterEach(() => {
    console.error = originalConsoleError;

    perfUtils.clearCustomEntries();
  });

  it.each([
    'script',
    'css',
    'link',
  ])('prints a warning if a duplicate %s resource is detected', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType });
    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).toHaveBeenCalledWith(
      `Warning: A ${initiatorType} resource was loaded multiple times: ${url}`,
    );
  });

  it.each([
    'img',
    'xmlhttprequest',
    'iframe',
  ])('does not print a warning if a duplicate %s resource is detected', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType });
    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).not.toHaveBeenCalled();
  });

  it.each([
    'img',
    'xmlhttprequest',
    'iframe',
  ])('prints a warning for a duplicate %s resource if defaults overridden', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType });
    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType });

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
    const { rerender } = renderHook(() => useResourceMonitor());

    const performanceObserver = perfUtils.getMockPerformanceObserver();

    expect(performanceObserver.disconnect).not.toHaveBeenCalled();

    rerender();

    expect(performanceObserver.disconnect).toHaveBeenCalled();
  });

  it('prints a warning for a duplicate resources detected after the initial run', () => {
    const url = 'http://example.com/my-resource';

    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType: 'script' });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).not.toHaveBeenCalled();

    perfUtils.addPerformanceResourceTimingEntry({ name: url, initiatorType: 'script' });

    PerformanceObserver.mock.calls[0][0](performance);

    expect(console.error).toHaveBeenCalledWith(
      `Warning: A script resource was loaded multiple times: ${url}`,
    );
  });
});
