import React, { useRef } from 'react';
import test from 'ava';
import { Provider, encase } from 'react-jpex';
import { renderHook } from '@testing-library/react-hooks';
import { render, screen, cleanup } from '@testing-library/react';
import jpex from 'jpex';

const baseJpex = jpex;

test.afterEach(cleanup);

test.serial('injects dependencies into a hook', (t) => {
  type Foo = string;
  const useFoo = encase((foo: Foo) => () => {
    // just for the sake of proving this is a react hook
    const ref = useRef(foo);
    return ref.current;
  });

  const { result: { current } } = renderHook(useFoo, {
    wrapper: Provider,
    initialProps: {
      onMount(jpex) {
        jpex.constant<Foo>('foo');
      },
    },
  });

  t.is(current, 'foo');
});

test.serial('injects dependencies into a component', async(t) => {
  type Foo = string;
  const Component = encase((foo: Foo) => (props: { bar: string }) => {
    const ref = useRef(props.bar);

    return (
      <div>
        <span>{ref.current}</span>
        <span>{foo}</span>
      </div>
    );
  });

  render(
    <Provider onMount={(jpex) => jpex.constant<Foo>('foo')}>
      <Component bar="bar"/>
    </Provider>
  );

  await screen.findByText('foo');
  await screen.findByText('bar');

  t.pass();
});

test.serial('when props change it still works', async(t) => {
  type Foo = string;
  const Component = encase((foo: Foo) => (props: { bar: string }) => {
    return (
      <div>
        <span>{props.bar}</span>
        <span>{foo}</span>
      </div>
    );
  });

  const { rerender } = render(
    <Provider onMount={(jpex) => jpex.constant<Foo>('foo')}>
      <Component bar="bar"/>
    </Provider>
  );

  await screen.findByText('foo');
  await screen.findByText('bar');

  rerender(
    <Provider onMount={(jpex) => jpex.constant<Foo>('foo')}>
      <Component bar="baz"/>
    </Provider>
  );

  await screen.findByText('foo');
  await screen.findByText('baz');

  t.pass();
});

test.serial('nested encases', async(t) => {
  const jpex = baseJpex.extend();

  type Foo = string;
  jpex.constant<Foo>('foo');

  const useFoo = encase((foo: Foo) => () => {
    // just for the sake of proving this is a react hook
    const ref = useRef(foo);
    return ref.current;
  });
  type UseFoo = typeof useFoo;
  jpex.constant<UseFoo>(useFoo);

  const Component = encase((useFoo: UseFoo) => () => {
    const foo = useFoo();

    return (
      <div>
        <span>{foo}</span>
      </div>
    );
  });

  render(
    <Provider value={jpex}>
      <Component/>
    </Provider>
  );

  await screen.findByText('foo');

  t.pass();
});
