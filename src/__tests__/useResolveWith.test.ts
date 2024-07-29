import test from 'ava';
import { renderHook } from '@testing-library/react-hooks';
import { useResolveWith, Provider } from 'react-jpex';
import base from 'jpex';

test('resolves a dependency', (t) => {
  const jpex = base.extend();
  type Foo = string;
  type Bar = string;
  jpex.factory<Foo>((bar: Bar) => bar);

  const {
    result: { current },
  } = renderHook(() => useResolveWith<Foo, Bar>([ 'foo' ]), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});

test('resolves a dependency with memoization', (t) => {
  const jpex = base.extend();
  type Foo = string;
  type Bar = string;
  jpex.factory<Foo>((bar: Bar) => bar);

  const {
    result: { current },
  } = renderHook(() => useResolveWith<Foo, Bar>([ 'foo' ], []), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});
test('resolves a dependency by name', (t) => {
  const jpex = base.extend();
  jpex.factory('foo', [ 'bar' ], (bar) => bar);

  const {
    result: { current },
  } = renderHook(() => useResolveWith('foo', { bar: 'foo' }), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});
