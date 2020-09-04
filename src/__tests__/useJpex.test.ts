import test from 'ava';
import { renderHook } from '@testing-library/react-hooks';
import {
  Provider,
  useJpex,
} from '..';
import jpex from 'jpex';

test('returns the global jpex container', (t) => {
  const { result: { current } } = renderHook(() => useJpex());

  t.is(current, jpex);
});
test('returns a new jpex instance from the provider', (t) => {
  const { result: { current } } = renderHook(useJpex, {
    wrapper: Provider,
  });

  t.not(current, jpex);
  t.is(typeof current.factory, 'function');
});
test('returns a jpex instance explicitly given to the provider', (t) => {
  const jpex2 = jpex.extend();
  const { result: { current } } = renderHook(useJpex, {
    wrapper: Provider,
    initialProps: { value: jpex2 },
  });

  t.is(current, jpex2);
});
