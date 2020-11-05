# react-jpex
this is just a simple context wrapper around `jpex`

## useJpex
```ts
() => Jpex
```

```tsx
const Page = () => {
  const jpex = useJpex();
  const thing = jpex.resolve<Thing>();

  return (...);
};
```

## useResolve
```ts
(name?: string, deps?: any[]) => any
```

```tsx
const Page = () => {
  const thing = useResolve<Thing>();

  return (...);
};
```

## useRegister
```ts
(...callbacks: (jpex: Jpex) => void) => void
```
This simple hook just calls the given callback functions with the current jpex instance when the component mounts.

Unlike `useEffect`, the callbacks are invoked _immediately_, meaning you can register your depndencies and then start resolving them straight away.

```ts
const Page = () => {
  useRegister((jpex) => {
    jpex.constant<Thing>(thing);
  });
  const thing = useResolve<Thing>();
};
``` 

## Provider
```ts
ComponentType<{ value?: Jpex, onMount?: (jpex: Jpex) => void }>
```

```tsx
const App = () => (
  <Provider value={specificJpexContainer}>
    <Page/>
  </Provider>
);
```
If you omit the `value` prop, the provider will implictly create a new jpex container from the previous one.

If you there is no provider component in your app, `useJpex` will return the global `jpex` instance.

The `onMount` prop allows you to access the current container and immediately register dependencies on mount.

```tsx
<Provider
  onMount={(jpex) => {
    jpex.constant<MyDependency>('foo');
  }}
>
  <Page/>
</Provider>
```
