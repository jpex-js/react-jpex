import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Jpex, SetupConfig } from 'jpex';
import useJpex from './useJpex';
import context from './context';

interface Props extends SetupConfig {
  value?: Jpex,
  children?: ReactNode,
  onMount?: (jpex: Jpex) => void,
}

const { Provider } = context;

export default function JpexProvider({
  value,
  children,
  onMount,
  ...config
}: Props) {
  const parent = useJpex();
  const mounted = useRef(false);

  const [ container, setContainer ] = useState(() => value ?? parent.extend(config));

  useEffect(() => {
    if (value && value !== container) {
      setContainer(value);
    }
  }, [ value, setContainer ]);

  if (!mounted.current) {
    mounted.current = true;
    if (onMount) {
      onMount(container);
    }
  }

  return (
    <Provider value={container}>
      {children}
    </Provider>
  );
}
