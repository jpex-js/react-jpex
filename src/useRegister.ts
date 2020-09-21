import { JpexInstance } from 'jpex';
import { useJpex } from '.';
import { useRef } from 'react';

const useRegister = (...fns: ((jpex: JpexInstance) => void)[]) => {
  const invoked = useRef(false);
  const jpex = useJpex();

  if (!invoked.current) {
    fns.forEach((fn) => fn(jpex));
    invoked.current = true;
  }
};

export default useRegister;
