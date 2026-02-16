import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to prevent unnecessary re-renders by comparing dependencies deeply
 */
export function useDeepMemo<T>(factory: () => T, deps: unknown[]): T {
  const ref = useRef<{ deps: unknown[]; value: T }>();

  if (!ref.current || !areEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  return ref.current.value;
}

/**
 * Deep equality check for dependencies
 */
function areEqual(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (typeof a[i] === 'object' && a[i] !== null && typeof b[i] === 'object' && b[i] !== null) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Hook to prevent re-renders when callback dependencies haven't changed
 */
export function useEventCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R
): (...args: Args) => R {
  const ref = useRef<(...args: Args) => R>(callback);

  useEffect(() => {
    ref.current = callback;
  });

  return useCallback(((...args: Args) => ref.current(...args)), []);
}

/**
 * Hook to track component renders (for debugging)
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (import.meta.env.MODE === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
}

/**
 * Hook to prevent re-renders when props haven't changed
 */
export function useShallowMemo<T extends object>(obj: T): T {
  const ref = useRef<T>(obj);

  const keys = Object.keys(obj) as Array<keyof T>;
  const hasChanged = keys.some(key => obj[key] !== ref.current[key]);

  if (hasChanged) {
    ref.current = obj;
  }

  return ref.current;
}
