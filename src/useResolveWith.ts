/* eslint-disable @typescript-eslint/no-unused-vars */
import { NamedParameters, ResolveOpts } from 'jpex';
import useJpex from './useJpex';

function useResolveWith(
  name: string,
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): any;
function useResolveWith<T>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C, D>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C, D, E>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C, D, E, F>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C, D>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C, D, E>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith<T, A, B, C, D, E, F>(
  namedParameters: NamedParameters,
  opts?: ResolveOpts
): T;
function useResolveWith(name: any, namedParameters: any, opts?: any) {
  const jpex = useJpex();
  return jpex.resolveWith(name, namedParameters, opts);
}

export default useResolveWith;
