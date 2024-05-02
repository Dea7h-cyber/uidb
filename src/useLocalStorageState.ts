import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

const useForceUpdate = (): (() => void) => {
  const [, setState] = useState<{}>({});
  return useCallback(() => setState({}), []);
};

const getItem = <T>(key: string): T | null => {
  const rawValue = localStorage.getItem(key);
  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    // Old value might be non-serialized
    // Passing the raw string based on assumption that we still want a string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawValue as any as T;
  }
};

const setItem = (key: string, value: unknown | undefined): void => {
  if (value === undefined) {
    localStorage.removeItem(key);
    return;
  }
  // Serialize even strings - `someString` is persisted as `"someString"`
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

/**
 * Like useState, but with persistance to localStorage using JSON serialization.
 *
 * useLocalStorage from react-use has a bug - https://github.com/streamich/react-use/pull/2046
 *
 * TODO add synchronization across browser tabs
 * @param key When this value changes reloads value and generates a new dispatch function
 * @param initialValue
 * @returns Setting the state to `undefined` will remove the key from localStorage.
 */

const useLocalStorageState = <
  T extends string | number | boolean | object | null | undefined,
>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const keyRef = useRef<string>();
  const valueRef = useRef<T>(initialValue);
  const forceUpdate = useForceUpdate();

  if (keyRef.current !== key) {
    keyRef.current = key;
    const newValue = getItem<T>(key) ?? initialValue;
    valueRef.current = newValue;
  }

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (action): void => {
      const newValue =
        typeof action === 'function'
          ? (action as (prevState: T) => T)(valueRef.current)
          : action;
      if (valueRef.current === newValue) {
        return;
      }
      valueRef.current = newValue;
      setItem(key, newValue);
      forceUpdate();
      return;
    },
    [forceUpdate, key],
  );

  return [valueRef.current, setValue];
};

export default useLocalStorageState;
