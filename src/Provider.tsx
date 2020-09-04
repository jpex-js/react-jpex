import React, { useMemo, ReactNode } from 'react';
import { JpexInstance } from 'jpex';
import useJpex from './useJpex';
import context from './context';

interface Props {
  value?: JpexInstance,
  children?: ReactNode,
}

const { Provider } = context;

const JpexProvider = ({ value, children }: Props) => {
  const parent = useJpex();
  const container = useMemo(() => {
    return value ?? parent.extend();
  }, [ value ]);

  return (
    <Provider value={container}>
      {children}
    </Provider>
  );
};
JpexProvider.displayName = 'JpexProvider';

export default JpexProvider;
