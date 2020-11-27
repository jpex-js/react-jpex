import { ResolveOpts } from 'jpex';
import useJpex from './useJpex';

function useResolve<T>(): T
function useResolve<T>(opts: ResolveOpts): T
function useResolve<T>(name: string): T
function useResolve<T>(name: string, opts: ResolveOpts): T
function useResolve(name?: any, opts?: any) {
  const jpex = useJpex();
  return jpex.resolve(name, opts);
}


export default useResolve;
