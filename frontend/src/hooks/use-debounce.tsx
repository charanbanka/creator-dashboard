import { useEffect, useState } from "react";

const useDebunce = (val: string, delay: number) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setValue(val);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [val]);

  return value;
};


export default useDebunce
