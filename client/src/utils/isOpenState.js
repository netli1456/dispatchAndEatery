import { useState, useCallback } from 'react';

export const useOpen = (initialState = false) => {
  const [isOpen, setOpen] = useState(initialState);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  return { isOpen, toggle };
};

