# React Resource Monitor

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Logs a warning if a resource was loaded more than once, for example, as the
result of React re-renders.

## Installation

```
yarn add react-resource-monitor
```

## Usage

Add the following hook to start monitoring resources:

```jsx
import { useResourceMonitor } from 'react-resource-monitor';

useResourceMonitor({
  ttfbLimit: 200,
  duplicateTypes: ['script', 'link', 'css'],
});
```

## Settings

The `useResourceMonitor()` hook accepts an object with the following settings:

| Option               | Description                                                                                                                                      | Default     |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| ttfbLimit            | The limit in milliseconds for the time to first byte.                                                                                            | `null`      |
| duplicateTypes       | An array of [`initiatorType`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType) to check for duplicates. | `[]`        |
| duplicateIgnoreQuery | Ignore any query params when checking for duplicate resources.                                                                                   | `true`      |

## Build setup

```bash
# Run tests
yarn run test

# Run linting checks
yarn run lint
```
