import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Jpex } from 'jpex';
import useJpex from './useJpex';
import context from './context';

interface Props {
  value?: Jpex,
  onMount?: (jpex: Jpex) => void,
  children?: ReactNode,
}

const { Provider } = context;

const JpexProvider = ({
  value,
  children,
  onMount,
}: Props) => {
  const parent = useJpex();
  const mounted = useRef(false);

  const [ container, setContainer ] = useState(() => value ?? parent.extend());

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
};
JpexProvider.displayName = 'JpexProvider';

export default JpexProvider;
