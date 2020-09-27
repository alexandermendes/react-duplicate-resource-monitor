# React Resource Monitor

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](https://badge.fury.io/js/react-resource-monitor.svg)](https://badge.fury.io/js/react-resource-monitor)

When using head management libraries, such as [react-helmet](https://github.com/nfl/react-helmet),
it is possible for React hydration and re-renders to cause resources to be loaded
multiple times. This package logs a warning if that happens.

## Installation

```
yarn add react-resource-monitor
```

## Usage

Add the following hook to start monitoring resources:

```jsx
import { useResourceMonitor } from 'react-resource-monitor';

useResourceMonitor();
```

## Settings

The `useResourceMonitor()` hook accepts an object with the following settings:

| Option         | Description                                                                                                                                      | Default                     |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| initiatorTypes | An array of [`initiatorType`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType) to check for duplicates. | `['script', 'link', 'css']` |
| ignoreQuery    | Ignore any query params when checking for duplicate resources.                                                                                   | `true`                      |

## Browser Support

This package will not work for IE unless you [polyfill `PerformanceObserver`](https://github.com/fastly/performance-observer-polyfill).

## Build setup

```bash
# Run tests
yarn run test

# Run linting checks
yarn run lint
```
