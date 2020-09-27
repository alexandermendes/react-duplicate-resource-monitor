# React Resource Monitor

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Utilities for monitoring web resources in React applications.

## Installation

Install with npm:

```
npm install react-resource-monitor
```

or yarn:

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

### `duplicateTypes`

An array of [`initiatorType`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType)s to check for duplicates. Set this to an empty array to disable the check.

**Default:** `['script', 'link', 'css']`;

## Build setup

```bash
# Run tests
yarn run test

# Run linting checks
yarn run lint
```
