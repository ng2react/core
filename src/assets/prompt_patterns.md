# Code Patterns

I want you to deal with certain code patterns in a specific way. Here are the patterns I want you to deal with:

## Pattern 1: Two-way bindings

- Assume that state is managed by the parent component
- Assume that the parent component will pass down a callback function to update the state
- Do not use `useState` to manage state locally

### Example Response:

```jsx
const StateBindingExample = ({twoWayBinding, onTwoWayBindingChange}) => {
    const handleTwoWayBindingChange = (e) => {
        onTwoWayBindingChange(e.target.checked)
    }

    return (
        <div>
            <label>
                2-Way Binding <input type="checkbox" checked={twoWayBinding} onChange={handleTwoWayBindingChange}/>
            </label>
        </div>
    )
}
```

## Pattern 2: One-way bindings / String Bindings

- If the value does not appear to be modified, assume that it is read-only; otherwise
- Create a local state variable using `useState` and update it using `useEffect` declaring the initial state as a
  dependency

### Example Response:

```jsx
const StateBindingExample = ({oneWayBinding: initialOneWayBinding, readOnlyOneWayBinding}) => {
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
                    Readonly 1-Way Binding <input type="checkbox" checked={readOnlyOneWayBinding} readOnly/>
                </label>
            </div>
        </div>
    )
}
```

## Pattern 3: Service Injection

- If the service name starts with a `$`:
    - Assume that it is a built-in AngularJS service
    - Assume that a non-angular equivalent is available
- Use a custom hook called `useService` to inject the services. This hook will be provided by a library called
  `@ng2react/support`

### Example Response
- I have assumed that a custom hook called `useService` is available via a library called `@ng2react/support`
- It is a bad idea to import AngularJS services directly into React so I have assumed that a wrapper for `$http` called `httpService` will be available

```jsx
const ServiceInjectionExample = ({}) => {
    const myService = useService('myService')
    // Assumption: New non-angular service called 'httpService' can be used instead of '$http'
    const httpService = useService('httpService')

    return <>...</>
}
```

## Pattern 4: Require Controller

Where a controller is required, assume that it can be passed in as a prop.

### Example Response

```javascript
angular.module('myApp').component('myComponent', {
    require: '^MyController',
    template: '<div>...</div>',
})
```

```jsx
const RequireControllerExample = ({myController}) => {
    return <>...</>
}
```

## Any other patterns
Finally: 
- If you encounter any other patterns, not described above, please do your best to migrate them into the React component.
- If a particular pattern seems unworkable, just do your best and include comments explaining your concerns.
