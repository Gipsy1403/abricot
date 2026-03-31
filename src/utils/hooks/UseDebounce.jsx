// export default function UseDebounce({value,delay}) {
// 	const [debouncedValue, setDebouncedValue]=useState(value);
// 	const [isWaiting, setIsWaiting]=useState(false);
// 	let timeoutId;
// 	useEffect(()=>{
// 		if(timeoutId){
// 			setIsWaiting(true);
// 			clearTimeout(timeoutId);
// 		}
// 		timeoutId=setTimeout(()=>{
// 			setDebouncedValue(value);
// 			setIsWaiting(false);
// 		}, delay);
// 		return()=>{
// 			clearTimeout(timeoutId);
// 		}
// 	},[value]);
// 	return [debouncedValue,isWaiting];
// };


import { useState, useEffect } from "react";

export default function useDebounce(value, delay) {

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}