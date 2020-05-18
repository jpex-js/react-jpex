import { ComponentType, ReactNode } from 'react';
import { JpexInstance } from 'jpex';

export function useJpex(): JpexInstance

export function useResolve<T>(): T
export function useResolve<T>(deps: any[]): T
export function useResolve<T = any>(name: string): T
export function useResolve<T = any>(name: string, deps: any[]): T

export const Provider: ComponentType<{
  value?: JpexInstance,
  children?: ReactNode,
}>;
