# React Duplicate Resource Monitor

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Logs a warning if a resource was loaded more than once, for example, as the
result of React re-renders.

## Installation

```
yarn add react-duplicate-resource-monitor
```

## Usage

Add the following hook to start monitoring resources:

```jsx
import { useDuplicateResourceMonitor } from 'react-duplicate-resource-monitor';

useDuplicateResourceMonitor();
```

## Settings

The `useDuplicateResourceMonitor()` hook accepts an object with the following settings:

#### `initiatorTypes`

An array of [`initiatorType`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType) to check for duplicates. Set this to an empty array to disable the check.

**Default:** `['script', 'link', 'css']`

#### `ignoreQuery`

Ignore any query params when checking for duplicate resources.

**Default:** `true`

## Build setup

```bash
# Run tests
yarn run test

# Run linting checks
yarn run lint
```
