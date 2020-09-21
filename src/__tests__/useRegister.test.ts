import test from 'ava';
import { renderHook } from '@testing-library/react-hooks';
import {
  Provider,
  useRegister,
} from '..';
import jpex, { JpexInstance } from 'jpex';

test('calls a callback on mount', (t) => {
  let called = false;
  const callback = () => {
    called = true;
  };

  renderHook(() => useRegister(callback));

  t.is(called, true);
});
test('passes the current jpex instance', (t) => {
  const newJpex = jpex.extend();
  let ioc: JpexInstance;
  const callback = (jpex: JpexInstance) => {
    ioc = jpex;
  };

  renderHook(() => useRegister(callback), {
    wrapper: Provider,
    initialProps: { value: newJpex },
  });

  t.is(ioc, newJpex);
});
test('does not call on subsequent renders', (t) => {
  let callCount = 0;
  const callback = () => {
    callCount = callCount + 1;
  };

  const { rerender } = renderHook(() => useRegister(callback));

  t.is(callCount, 1);

  rerender();

  t.is(callCount, 1);
});
test('accepts multiple callbacks', (t) => {
  let callCount = 0;
  const callback = () => {
    callCount = callCount + 1;
  };

  renderHook(() => useRegister(callback, callback, callback));

  t.is(callCount, 3);
});
