import test from 'ava';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from '..';
import jpex, { Jpex } from 'jpex';

test('calls onMount on mount', (t) => {
  let called = false;
  const callback = () => {
    called = true;
  };

  render(
    <Provider onMount={callback}>
      <div/>
    </Provider>
  );

  t.true(called);
});

test('passes the current jpex instance', (t) => {
  const newJpex = jpex.extend();
  let ioc: Jpex;
  const callback = (jpex: Jpex) => {
    ioc = jpex;
  };

  render(
    <Provider
      value={newJpex}
      onMount={callback}
    >
      <div/>
    </Provider>
  );

  t.is(ioc, newJpex);
});

test('does not call on subsequent renders', (t) => {
  let callCount = 0;
  const callback = () => {
    callCount = callCount + 1;
  };

  const Inner = () => {
    return (<div/>);
  };

  const { rerender } = render(
    <Provider onMount={callback}>
      <Inner/>
    </Provider>
  );

  t.is(callCount, 1);

  rerender(
    <Provider onMount={callback}>
      <Inner/>
    </Provider>
  );

  t.is(callCount, 1);
});
