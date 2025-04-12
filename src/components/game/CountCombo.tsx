import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const CountCombo = ({ count }: { count: number }) => {
  const [animate, setAnimate] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (count === 0) return

    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 300)

    // 10 단위로 버스트 애니메이션 실행
    if (count % 10 === 0) {
      setBurst(true)
      setTimeout(() => setBurst(false), 600)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [count])

  return (
    <div
      className={twMerge(
        'pointer-events-none font-extrabold text-red-300 drop-shadow-lg transition-transform duration-300 ease-out',
        animate && 'animate-count-pop',
        burst && 'animate-burst-scale text-yellow-300',
        'text-4xl md:text-6xl',
      )}
    >
      {count}
    </div>
  )
}

export default CountCombo
