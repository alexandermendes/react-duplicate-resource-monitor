import { renderHook } from '@testing-library/react-hooks';

import { useResourceMonitor } from '../../src';
import { createPerformanceApi } from '../utils';

const originalConsoleError = console.error;

describe('Duplicate resources', () => {
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it.each([
    'script',
    'css',
  ])('logs an error if a duplicate %s resource is detected', async (initiatorType) => {
    const url = 'http://example.com/my-resource';

    const { addPerformanceResourceTimingEntry } = createPerformanceApi();

    addPerformanceResourceTimingEntry({ name: url, initiatorType });
    addPerformanceResourceTimingEntry({ name: url, initiatorType });

    console.error = jest.fn();

    renderHook(() => useResourceMonitor());

    expect(console.error).toHaveBeenCalledWith(
      `Warning: A script resource was loaded multiple times: ${url}`,
    );
  });
});
