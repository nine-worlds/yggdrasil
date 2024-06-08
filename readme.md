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

```typescript
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

```typescript
import { ServiceCollection } from "@nine-worlds/yggdrasil";

const startup = (serviceCollection: ServiceCollection) => {
  // Configure services here
};

startup(new ServiceCollection());
```
# Using the DI
## Create Injectable Service
```typescript
export class SampleService extends Injectable {
    constructor() {
        super();
    }

    static get() {
        return new SampleService();
    }
}
```

## Register Injectable Service into the DI

### Create register service function
```typescript
export function registerSampleService(serviceCollection: ServiceCollection): ServiceCollection {
    return serviceCollection.registerSingletonService<SampleService>(SampleService.get())
}
```

### Register the service to the DI with the function
```typescript
const startup = (serviceCollection: ServiceCollection) => {
    // Configure Services Here
    registerSampleService(serviceCollection);
};
```

## Retrieve the service from the DI
### Use the ServiceCollection static method call
```typescript
const sampleService = ServiceCollection.getServiceByFunction<SampleService>(SampleService);
```
### Use the static method alias
```typescript
// Alias for .getServiceByFunction<T>(T);
const sampleService = service<SampleService>(SampleService);
```

# Using Configuration
## Create the configuration object
```typescript
export default {
    // Add your properties here either define the values from .env variables
    // or define it here with static values
    simpleValue: "simple value here",
    objectValue: {
        simpleObjectValue: "simple object value here",
        nestedObject: {
            simpleNestedObjectValue: "simple nested object value here"
        }
    }
}
```

## Register the configuration object
```typescript
import configuration from "./configuration";

const startup = (serviceCollection: ServiceCollection) => {
    // Configure Services Here
    serviceCollection.configuration.addConfiguration(configuration)
};
```

## Retrieve value from configuration
### Simple Property
```typescript
// Retrieve the simpleValue
const genericValue = ServiceCollection.Configuration.getGeneric<string>("simpleValue"); // returns "simple value here" as a string
const value = ServiceCollection.Configuration.get("simpleValue"); // returns the "simple value here" as any
```

### Object Property
```typescript
// Retrieve the object property
const genericValue = ServiceCollection.Configuration.getGeneric<string>("objectValue.simpleObjectValue"); // returns "simple object value here" as a string
const value = ServiceCollection.Configuration.get("objectValue.simpleObjectValue"); // returns the "simple object value here" as any
```

### Nested Object Property
```typescript
// Retrieve the object property
const genericValue = ServiceCollection.Configuration.getGeneric<string>("objectValue.nestedObject.simpleNestedObjectValue"); // returns "simple nested object value here" as a string
const value = ServiceCollection.Configuration.get("objectValue.nestedObject.simpleNestedObjectValue"); // returns the "simple nested object value here" as any
```

### Separators that could be used to reference properties
You could either use `.` or `:` like `objectValue.nestedObject.simpleNestedObjectValue` or `objectValue:nestedObject:simpleNestedObjectValue`

## React Wrapper Hooks
### useService 
```typescript
import {useMemo} from "react";
import {Injectable, service} from "@nine-worlds/yggdrasil";

export function useService<T extends Injectable>(serviceIdentifier: Function) {
    return useMemo(() => service<T>(serviceIdentifier), [serviceIdentifier]);
}
```

### Usage
```typescript jsx
const ReactComponent: React.FC = () => {
    const sampleService = useService<SampleService>(SampleService);
}

export default ReactComponent;
```

### useConfiguration
```typescript
import {useMemo} from "react";
import {ServiceCollection} from "@nine-worlds/yggdrasil";

export function useConfiguration<T>(path: string, afterWiser?: (value: T) => T): T {
    return useMemo(() => {
        const value = ServiceCollection.Configuration.getGeneric<T>(path);
        if (afterWiser) return afterWiser(value);
        return value;
    }, [path]);
}
```

### Usage
```typescript jsx
const ReactComponent: React.FC = () => {
    const genericValue = useConfiguration<string>("objectValue.nestedObject.simpleNestedObjectValue");
}

export default ReactComponent;
```

## Development
You are welcome to develop with us at [GitHub](https://github.com/nine-worlds/yggdrasil).

```powershell
bun install
bun build
```
