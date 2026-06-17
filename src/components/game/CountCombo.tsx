import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { SCORE_MULTIPLIER } from '../../utils/rank'

/** 콤보 구간별 응원 문구 (도달 시 잠깐 노출) */
const getMilestone = (count: number): string | null => {
  if (count === 50) return 'AMAZING!'
  if (count === 30) return 'GREAT!'
  if (count === 20) return 'NICE!'
  return null
}

const CountCombo = ({ count }: { count: number }) => {
  const [animate, setAnimate] = useState(false)
  const [burst, setBurst] = useState(false)
  const [milestone, setMilestone] = useState<string | null>(null)

  useEffect(() => {
    if (count === 0) return

    setAnimate(true)
    const popTimer = setTimeout(() => setAnimate(false), 300)

    // 10 단위로 버스트 애니메이션 실행
    let burstTimer: ReturnType<typeof setTimeout> | undefined
    if (count % 10 === 0) {
      setBurst(true)
      burstTimer = setTimeout(() => setBurst(false), 600)
    }

    // 구간 달성 문구
    let milestoneTimer: ReturnType<typeof setTimeout> | undefined
    const label = getMilestone(count)
    if (label) {
      setMilestone(label)
      milestoneTimer = setTimeout(() => setMilestone(null), 800)
    }

    return () => {
      clearTimeout(popTimer)
      clearTimeout(burstTimer)
      clearTimeout(milestoneTimer)
    }
  }, [count])

  return (
    <div className="pointer-events-none flex flex-col items-center">
      <div
        className={twMerge(
          'font-extrabold text-red-300 drop-shadow-lg transition-transform duration-300 ease-out',
          animate && 'animate-count-pop',
          burst && 'animate-burst-scale text-yellow-300',
          'text-4xl md:text-6xl',
        )}
      >
        {count}
      </div>
      {/* 예상 비행 거리 실시간 표시 */}
      <p className="mt-1 text-sm font-semibold text-white drop-shadow-md">{count * SCORE_MULTIPLIER}m</p>
      {/* 구간 달성 문구 */}
      {milestone && <p className="animate-burst-scale mt-1 text-xl font-extrabold text-yellow-300 drop-shadow-lg">{milestone}</p>}
    </div>
  )
}

export default CountCombo
