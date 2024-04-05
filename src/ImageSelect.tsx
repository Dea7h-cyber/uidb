import { useCallback } from 'react';

const KEY = 'uidb_imageid';

const VALUES = [
  'default',
  'nopadding',
  'topology',
] as const;

type Value = typeof VALUES[number];

const VALUE_SAVED = localStorage.getItem(KEY) as Value | null;

const VALUE = (VALUE_SAVED && VALUES.includes(VALUE_SAVED)) ? VALUE_SAVED : VALUES[0];

const Select = () => {
  const onChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem(KEY, e.target.value as Value);
    window.location.reload();
  }
  , [])
  return (
    <select name={KEY} id={KEY} value={VALUE} onChange={onChange}>
      {VALUES.map((origin) => (
        <option key={origin} value={origin}>
          {origin}
        </option>
      ))}
    </select>

  )
}

export default Select
export const IMAGENAME = VALUE;

