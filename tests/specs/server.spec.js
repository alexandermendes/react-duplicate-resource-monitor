/**
 * @jest-environment node
 */
import { useResourceMonitor } from '../../src';

describe('Server', () => {
  it('does not throw when loaded on the server', () => {
    expect(() => useResourceMonitor()).not.toThrow();
  });
});
