import { ComponentType, ReactNode } from 'react';
import { JpexInstance } from 'jpex';

export function useJpex(): JpexInstance

export function useResolve<T = any>(name: string): T
export function useResolve<T>(): T

export const Provider: ComponentType<{
  value?: JpexInstance,
  children?: ReactNode,
}>;
