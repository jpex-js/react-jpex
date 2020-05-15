import { useMemo, createElement, createContext, useContext } from 'react';
import jpex from 'jpex';

var context = createContext(jpex);

export function useJpex() {
  return useContext(context);
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
