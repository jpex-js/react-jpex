import { Jpex } from 'jpex';
import useJpex from './useJpex';
import { useRef } from 'react';

export default function useRegister(...fns: ((jpex: Jpex) => void)[]) {
  const invoked = useRef(false);
  const jpex = useJpex();

  if (!invoked.current) {
    fns.forEach((fn) => fn(jpex));
    invoked.current = true;
  }
}
