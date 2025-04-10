import { useCallback, useState } from "react";

export const useBoolean = (initialValue: boolean) => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse] as const;
};