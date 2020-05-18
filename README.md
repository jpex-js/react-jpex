# react-jpex
this is just a simple context wrapper around `jpex`

## useJpex
```tsx
const Page = () => {
  const jpex = useJpex();
  const thing = jpex.resolve<Thing>();

  return (...);
};
```

## useResolve
```tsx
const Page = () => {
  const thing = useResolve<Thing>();

  return (...);
};
```

## Provider
```tsx
const App = () => (
  <Provider value={specificJpexContainer}>
    <Page/>
  </Provider>
);
```
If you omit the `value` prop, the provider will implictly create a new jpex container from the previous one.

If you there is no provider component in your app, `useJpex` will return the global `jpex` instance.
