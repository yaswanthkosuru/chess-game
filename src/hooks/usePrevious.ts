import { useEffect, useRef } from "react";

export function usePrevious(value: any) {
  console.log(JSON.stringify(value), "value");
  const ref = useRef<undefined | typeof value>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
