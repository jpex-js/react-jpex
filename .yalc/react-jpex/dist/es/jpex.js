import React, { createContext, useContext, useMemo } from 'react';
import jpex from 'jpex';

var context = /*#__PURE__*/createContext(jpex);

var useJpex = (() => useContext(context));

const {
  Provider
} = context;

const JpexProvider = ({
  value,
  children
}) => {
  const parent = useJpex();
  const container = useMemo(() => {
    return value != null ? value : parent.extend();
  }, [value]);
  return /*#__PURE__*/React.createElement(Provider, {
    value: container
  }, children);
};

JpexProvider.displayName = 'JpexProvider';

const useResolve = (name, opts) => {
  const jpex = useJpex();

  if (Array.isArray(opts)) {
    return useMemo(() => jpex.resolve(name), [jpex, name, ...opts]);
  }

  if (opts != null && typeof opts === 'object') {
    // @ts-ignore
    return jpex.resolve(name, opts);
  }

  return jpex.resolve(name);
};

export { JpexProvider as Provider, useJpex, useResolve };
