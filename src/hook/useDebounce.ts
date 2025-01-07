import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer) // value 또는 delay가 변경될 때 타이머를 정리
    }
  }, [value, delay]) // value와 delay가 변경되면 실행

  return debouncedValue
}
