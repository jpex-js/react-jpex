import { useMemo } from 'react';
import useJpex from './useJpex';

interface Opts {
  optional?: boolean,
  with?: {
    [key: string]: any,
  },
}

interface UseResolve {
  <T>(): T
  <T>(deps: any[]): T
  <T>(opts: Opts): T
  <T = any>(name: string): T
  <T = any>(name: string, deps: any[]): T
  <T = any>(name: string, opts: Opts): T
}

const useResolve: UseResolve = (name?: any, opts?: any) => {
  const jpex = useJpex();
  if (Array.isArray(opts)) {
    return useMemo(() => jpex.resolve(name), [ jpex, name, ...opts ]);
  }
  if (opts != null && typeof opts === 'object') {
    // @ts-ignore
    return jpex.resolve(name, opts);
  }
  return jpex.resolve(name);
};

export default useResolve;
