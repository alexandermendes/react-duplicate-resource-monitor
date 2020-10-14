import { renderHook } from '@testing-library/react-hooks';

import { useResourceMonitor } from '../../src';
import { setupEnvironment } from '../utils';

const originalConsoleError = console.error;

describe('Duplicate resources', () => {
  let perfUtils;

  beforeEach(() => {
    perfUtils = setupEnvironment();
  });

  afterEach(() => {
    console.error = originalConsoleError;

    perfUtils.reset();
  });

  it.each([
    'script',
    'link',
    'css',
  ])('prints a warning if a duplicate %s resource is detected', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).toHaveBeenCalledWith(
      `Warning: A ${initiatorType} resource was loaded multiple times: ${url}`,
    );
  });

  it.each([
    'iframe',
    'img',
    'xmlhttprequest',
    'use',
  ])('does not prints a warning for a duplicate %s resource by default', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).not.toHaveBeenCalled();
  });

  it.each([
    'iframe',
    'img',
    'xmlhttprequest',
    'use',
  ])('prints a warning for a duplicate %s resource if given as a checked type', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({
      initiatorTypes: [initiatorType],
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

    renderHook(() => useResourceMonitor({ initiatorTypes: ['script'] }));

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
      initiatorTypes: ['script'],
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
      initiatorTypes: ['script'],
      ignoreQuery: false,
    }));

    expect(console.error).not.toHaveBeenCalled();
  });

  it('does not report resources twice', () => {
    const url = 'http://example.com/my-resource';
    const initiatorType = 'script';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({
      initiatorTypes: [initiatorType],
    }));

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Warning:.*/));

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType });

    PerformanceObserver.mock.calls[0][0](performance);

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const url = 'http://example.com/my-resource';

    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType: 'script' });
    perfUtils.addEntry({ entryType: 'resource', name: url, initiatorType: 'script' });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor({
      disable: true,
    }));

    expect(console.error).not.toHaveBeenCalled();
  });

  it('does not throw if observer failed', () => {
    const performanceObserver = perfUtils.getMockPerformanceObserver();

    performanceObserver.observe = () => {
      throw new Error();
    };

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(() => renderHook(() => useResourceMonitor())).not.toThrow();
  });
});
