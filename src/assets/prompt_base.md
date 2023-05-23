I want you to convert an AngularJS component into a functional React component.

# Response presentation:
- So that I can programmatically find your code, please top and tail it with `// ___NG2R_START___`
  and `// ___NG2R_END___`,
- The output should be in ${LANGUAGE}
- For assumptions/issues that are more general, you may add these outside of the code snippet
- Above the code:
  - explain the approach you have taken to solve the problem
  - list any assumptions you have made
- Below the code:
  - list any potential issues you have identified

## Example Input
```javascript
angularjs.module("myApp", [])
    .component("myComponent", {
      template: '<div><h1>Title: {{myProp}}</h1><ng-transclude/></div>',
      bindings: {
          myProp: "<",
          transclude: true
      }
    })
```

## Example Response

**Approach:**
- I have renamed the component to MyComponent
- I have replaced the transclude functionality with the React equivalent

**Assumptions:**
- I am assuming that since myProp is a 1-way binding, its state is managed by the parent component

**Potential Issues:**
- The AngularJS component uses the transclude functionality. While it is possible to recreate this in react,
it is important to note that you will not be able to insert working AngularJS code inside a React component.

```jsx
// ___NG2R_START___
import React from 'react'

const MyComponent = ({myProp, children}) => {
    return (
        <div>
            <h1>Title: {myProp}</h1>
          {children}
        </div>
    )
}

// ___NG2R_END___
```
