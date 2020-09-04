import test from 'ava';
import { renderHook } from '@testing-library/react-hooks';
import {
  useResolve,
  Provider,
} from 'react-jpex';
import jpex4 from 'jpex-v4';
import jpex3 from 'jpex-v3';

test('resolves a dependency with jpex v4', (t) => {
  const jpex = jpex4.extend();
  type Foo = string;
  jpex.factory<Foo>(() => 'foo');

  const { result: { current } } = renderHook(() => useResolve<Foo>(), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});
test('resolves a dependency with jpex v3', (t) => {
  const jpex = jpex3.extend();
  type Foo = string;
  jpex.factory<Foo>(() => 'foo');

  const { result: { current } } = renderHook(() => useResolve<Foo>(), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});
test('resolves a dependency with options', (t) => {
  const jpex = jpex4.extend();
  type Foo = string;
  type Bah = string;
  jpex.factory<Foo>((bah: Bah) => `foo ${bah}`);

  const { result: { current } } = renderHook(() => useResolve<Foo>({
    with: {
      [jpex.infer<Bah>()]: 'baz',
    },
  }), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo baz');
});
test('resolves a dependency with memoization', (t) => {
  const jpex = jpex4.extend();
  type Foo = string;
  jpex.factory<Foo>(() => 'foo');

  const { result: { current } } = renderHook(() => useResolve<Foo>([]), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});
test('resolves a dependency by name', (t) => {
  const jpex = jpex4.extend();
  jpex.factory('foo', [], () => 'foo');

  const { result: { current } } = renderHook(() => useResolve('foo'), {
    wrapper: Provider,
    initialProps: {
      value: jpex,
    },
  });

  t.is(current, 'foo');
});
