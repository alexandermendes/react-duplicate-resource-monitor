import { renderHook } from '@testing-library/react-hooks';

import { useResourceMonitor } from '../../src';
import { setupEnvironment } from '../utils';

const originalConsoleError = console.error;

describe('TTFB', () => {
  let perfUtils;

  beforeEach(() => {
    perfUtils = setupEnvironment();
  });

  afterEach(() => {
    console.error = originalConsoleError;

    perfUtils.reset();
  });

  it('logs a warning if the TTFB is above the limit', () => {
    console.error = jest.fn();

    perfUtils.addEntry({
      entryType: 'navigation',
      startTime: 0,
      responseStart: 101.123,
    });

    renderHook(() => useResourceMonitor({ ttfbLimit: 100 }));

    expect(console.error).toHaveBeenCalledWith(
      'Warning: The TTFB was above your defined limit of 100ms (received 101.123ms)',
    );
  });

  it('does not log a warning if the TTFB is below the limit', () => {
    console.error = jest.fn();

    perfUtils.addEntry({
      entryType: 'navigation',
      startTime: 0,
      responseStart: 99,
    });

    renderHook(() => useResourceMonitor({ ttfbLimit: 100 }));

    expect(console.error).not.toHaveBeenCalled();
  });

  it('does not log a warning if no navigation entry found', () => {
    console.error = jest.fn();

    renderHook(() => useResourceMonitor({ ttfbLimit: 100 }));

    expect(console.error).not.toHaveBeenCalled();
  });
});
