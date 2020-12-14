import jpex from 'jpex';
import { useRef } from 'react';
import useJpex from './useJpex';

type Encase = typeof jpex.encase;

function encase(
  dependencies: string[],
  fn: (...args: any[]) => any
) {
  function encased(...args: any[]) {
    const jpex = useJpex();
    const fnRef = useRef<any>();
    if (fnRef.current == null) {
      const deps = dependencies.map((name) => jpex.resolve(name));
      fnRef.current = fn.apply(jpex, deps);
    }
    return fnRef.current.apply(null, args);
  }
  encased.encased = fn;
  return encased;
}

export default encase as Encase;
