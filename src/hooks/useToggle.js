import { useState, useCallback } from 'react';

export const useToggle = (initial = false) => {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState((s) => !s), []);
  const setOn   = useCallback(() => setState(true),  []);
  const setOff  = useCallback(() => setState(false), []);
  return [state, toggle, setOn, setOff];
};
