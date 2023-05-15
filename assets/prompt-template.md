I want you to convert an AngularJS component into a functional React component.

## General Rules:

-   You should explain any assumptions you have made
-   Highlight any potential issues
-   So that I can programmatically find your code, please top and tail it with `// ___NG2R_START___` and `// ___NG2R_END___`,
-   The output should be in ${LANGUAGE}

**Example Response**

```jsx
// ___NG2R_START___

import React from 'react'

// Assumption 1: One-way bindings should be converted to read-only elements, as they are not meant to be modified by the user.

const MyComponent = ({ myProp }) => {
    return (
        <div>
            <h1>Title: {myProp}</h1>
        </div>
    )
}

/**
 * Potential issues:
 * 1. Since AngularJS uses two-way data binding by default, converting to React requires handling state updates manually. This can lead to more complex code and potential issues if not handled correctly.
 */

// ___NG2R_END___
```

## Code Patterns

I want you to deal with certain code patterns in a specific way. Here are the patterns I want you to deal with:

### Pattern 1: Two-way bindings

-   Assume that state is managed by the parent component
-   Assume that the parent component will pass down a callback function to update the state
-   Do not use `useState` to manage state locally

**Example:**

```jsx
const StateBindingExample = ({ twoWayBinding, onTwoWayBindingChange }) => {
    const handleTwoWayBindingChange = (e) => {
        onTwoWayBindingChange(e.target.checked)
    }

    return (
        <div>
            <label>
                2-Way Binding <input type="checkbox" checked={twoWayBinding} onChange={handleTwoWayBindingChange} />
            </label>
        </div>
    )
}
```

### Pattern 2: One-way bindings / String Bindings

-   If the value does not appear to be modifyed, assume that it is read-only; otherwise
-   Create a local state variable using `useState` and update it using `useEffect` declaring the initial state as a dependency

**Example:**

```jsx
const StateBindingExample = ({ oneWayBinding: initialOneWayBinding, readOnlyOneWayBinding }) => {
    const [oneWayBinding, setOneWayBinding] = useState(initialOneWayBinding)

    useEffect(() => {
        setOneWayBinding(initialOneWayBinding)
    }, [initialOneWayBinding])

    return (
        <div>
            <div>
                <label>
                    1-Way Binding{' '}
                    <input
                        type="checkbox"
                        checked={oneWayBinding}
                        onChange={(e) => setOneWayBinding(e.target.checked)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Readonly 1-Way Binding <input type="checkbox" checked={readOnlyOneWayBinding} readOnly />
                </label>
            </div>
        </div>
    )
}
```

### Pattern 3: Service Injection

-   If the service name starts with a `$`:
    -   Assume that it is a built-in AngularJS service
    -   Assume that a non-angular equivalent is available
-   Use a custom hook called `useService` to inject the service

**Example:**

```jsx
const ServiceInjectionExample = ({}) => {
    const myService = useService < MyService > 'myService'
    // Assumption: New non-angular service called 'httpService' can be used instead of '$http'
    const httpService = useService < HttpService > 'httpService'

    return <>...</>
}
```

### Pattern 4: Require Controller

Where a controller is required, assume that it can be passed in as a prop.

**Example:**

```javascript
angular.module('myApp').component('myComponent', {
    require: '^MyController',
    template: '<div>...</div>',
})
```

```jsx
const RequireControllerExample = ({ myController }) => {
    return <>...</>
}
```

## The AngularJS Component:

${COMPONENT}
