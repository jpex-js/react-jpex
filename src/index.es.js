import { useMemo, createElement, createContext, useContext } from 'react';
import jpex from 'jpex';

var context = createContext(jpex);

export function useJpex() {
  return useContext(context);
}

export function useResolve(name, opts) {
  const jpex = useJpex();
  if (Array.isArray(opts)) {
    return useMemo(function() {
      return jpex.resolve(name);
    }, [ jpex, name ].concat(opts));
  }
  if (opts && typeof opts === 'object') {
    return jpex.resolve(name, opts);
  }
  return jpex.resolve(name);
}

export function Provider(props) {
  var parent = useJpex();

  var container = useMemo(function() {
    if (props.value == null) {
      return parent.extend();
    }
    return props.value;
  }, [ props.value ]);

  return createElement(
    context.Provider,
    { value: container },
    props.children
  );
}
