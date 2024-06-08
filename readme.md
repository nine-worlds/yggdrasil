# @nine-worlds/yggdrasil

@nine-worlds/yggdrasil is a comprehensive package designed for React Web and React Native development. It integrates configuration management, dependency injection, state management, routing, theming, utility functions, and testing tools, providing developers with a robust framework to streamline their development process and build scalable, maintainable applications effortlessly.

## Features

- **Configuration Management**: Centralized and flexible handling of configuration settings.
- **Dependency Injection**: Robust system for managing dependencies across your application.
- **Utility Functions**: Comprehensive set of utility functions for common tasks.
- **Collection Management**: Comprehensive set of collection tools to handle collections similarly to .NET.

## Installation

To install @nine-worlds/yggdrasil, use npm or yarn or bun:

```bash
npm install @nine-worlds/yggdrasil
# or
yarn add @nine-worlds/yggdrasil
# or
bun install @nine-worlds/yggdrasil
```

## Usage

Below are two ways to implement the package in your startup file.

### Using async/await

1. Import the necessary components from the package.
2. Define an asynchronous `startup` function that accepts a `ServiceCollection` parameter.
3. Call the `startup` function and handle the returned Promise.

```javascript
import { ServiceCollection } from "@nine-worlds/yggdrasil";

const startup = async (serviceCollection: ServiceCollection) => {
  // Configure services here
};

startup(new ServiceCollection()).then(() => {
  // Application initialization logic here
});
```

### Without async/await

1. Import the necessary components from the package.
2. Define a synchronous `startup` function that accepts a `ServiceCollection` parameter.
3. Call the `startup` function directly.

```javascript
import { ServiceCollection } from "@nine-worlds/yggdrasil";

const startup = (serviceCollection: ServiceCollection) => {
  // Configure services here
};

startup(new ServiceCollection());
```

## Development
You are welcome to develop with us at [GitHub](https://github.com/nine-worlds/yggdrasil).

```powershell
bun install
bun build
```
