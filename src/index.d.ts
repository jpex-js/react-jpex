import { ComponentType, ReactNode } from 'react';
import { JpexInstance } from 'jpex';

// @ts-ignore
type Opts = Parameters<JpexInstance['resolve']>[0]

export function useJpex(): JpexInstance

export function useResolve<T>(): T
export function useResolve<T>(deps: any[]): T
export function useResolve<T>(opts: Opts): T
export function useResolve<T = any>(name: string): T
export function useResolve<T = any>(name: string, deps: any[]): T

export const Provider: ComponentType<{
  value?: JpexInstance,
  children?: ReactNode,
}>;
