import { ComponentType, ReactNode } from 'react';
import { JpexInstance } from 'jpex';

export function useJpex(): JpexInstance

export const Provider: ComponentType<{
  value?: JpexInstance,
  children?: ReactNode,
}>;
