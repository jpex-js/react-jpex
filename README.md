# react-jpex
this is just a simple context wrapper around `jpex`

## useJpex
```ts
() => Jpex
```
Returns the current jpex instance. If your component is not wrapped in a `<Provider>` then it will just return the global jpex instance.

```tsx
const Page = () => {
  const jpex = useJpex();
  const thing = jpex.resolve<Thing>();

  return (...);
};
```

## useResolve
```ts
<T>(opts?: object) => T
```
Resolves a dependency for the given type `T`. The available options for `opts` can be found [here](https://github.com/jpex-js/jpex#jpexresolve).

```tsx
const Page = () => {
  const thing = useResolve<Thing>();

  return (...);
};
```

> If you're not using typescript you can still pass in the name of the dependency: `useResolve('thing', opts)`

## useRegister
```ts
(...callbacks: (jpex: Jpex) => void) => void
```
This simple hook just calls the given callback functions with the current jpex instance when the component mounts.

Unlike `useEffect`, the callbacks are invoked _immediately_, meaning you can register your depndencies and then start resolving them straight away.

```ts
const Page = () => {
  useRegister(jpex => {
    jpex.constant<Thing>(thing);
  });
  const thing = useResolve<Thing>();
};
``` 

## Encase
```ts
(...deps: any[]): (...args: any[]) => any
```
This is the same as jpex's own `encase` method, but uses the react context to use the correct jpex instance.

You can encase both hooks and entire components:
```ts
const useLocation = encase((window: Window) => () => window.location);
```
```tsx
const MyComponent = encase((window: Window) => () => (
  <div>{window.location.pathname}</div>
));
```

For more info see https://github.com/jpex-js/jpex#jpexencase

## Provider
```ts
ComponentType<{
  value?: Jpex,
  onMount?: (jpex: Jpex) => void
}>
```
A provider that sets the current jpex instance for all subsequent hooks to use.

```tsx
const myContainer = jpex.extend();

const App = () => (
  <Provider value={myContainer}>
    <Page/>
  </Provider>
);
```
If you omit the `value` prop, the provider will implictly create a new jpex container from the "previous" one.

You can also pass in any [configuration options](https://github.com/jpex-js/jpex#jpexextend) for the new container to use:

```tsx
<Provider
  inherit={false}
  precedence="passive"
>
  <Page/>
</Provider>
```

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

You can also have multiple providers, each one will create a new container that inherits the parent one.

```tsx
<Provider>
  <Provider>
    <Provider>
      <NotARealisticExample>
    </Provider>
  </Provider>
</Provider>
```
