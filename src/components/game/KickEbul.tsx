import { useEffect, useState } from 'react'
import ebulUser from '../../assets/game/game.webp'
import { twMerge } from 'tailwind-merge'
import { TEffect } from '../../types/game'
import hitEffect from '../../assets/game/kick.svg'
import CountCombo from './CountCombo'

const KickEbul = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const [isGameRunning, setIsGameRunning] = useState(false) // 본 게임 시작 여부
  const [timeCount, setTimeCount] = useState(20) // 본 게임 타이머

  const [effects, setEffects] = useState<TEffect[]>([]) //타격 효과
  const [hitCount, setHitCount] = useState(0) //타격 횟수

  /** 게임 시작 */
  const handleStartClick = () => {
    setIsGameRunning(true)
  }

  /** 타격 효과 추가 */
  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const newTouches: TEffect[] = Array.from(e.changedTouches).map(touch => ({
      id: Date.now() + Math.random(), // 고유 id
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }))

    setHitCount(prev => prev + newTouches.length)

    setEffects(prev => [...prev, ...newTouches])

    // 5초후 타격 효과 제거
    setTimeout(() => {
      setEffects(prev => prev.filter(eff => !newTouches.find(t => t.id === eff.id)))
    }, 500)
  }

  useEffect(() => {
    if (!isGameRunning) return

    const timer = setInterval(() => {
      setTimeCount(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsGameRunning(false)

          // 다음 단계로 이동
          handleNextStep()

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameRunning])

  return (
    <div style={{ backgroundImage: `url(${ebulUser})` }} className="relative h-full bg-cover bg-center">
      <div className="flex h-full flex-col items-center justify-between py-8">
        {/* 카운트다운 & 타이머 */}
        <div className="flex items-center justify-center">
          <p className={twMerge('text-4xl text-white', isGameRunning && 'animate-bounce')}>{isGameRunning ? timeCount : '준비'}</p>
        </div>

        {/* 터치 카운트 */}
        {hitCount > 0 && <CountCombo count={hitCount} />}

        {/* 게임 영역 */}
        <div className="mb-5 h-[40%] w-[86%] rounded-lg text-white outline-dashed outline-[6px] outline-offset-1 outline-main3">
          {isGameRunning ? (
            <div className="relative h-full w-full" onPointerDown={handleTouch}>
              {/* 터치 이펙트 */}
              {effects.map(effect => (
                <img
                  key={effect.id}
                  src={hitEffect}
                  alt="hit"
                  className="animate-scale-fade pointer-events-none absolute size-12"
                  style={{ left: effect.x, top: effect.y, transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="mb-2 text-center text-sm">
                제한 시간 동안 빠르게 터치해
                <br />
                떠오른 생각을 날려버려요!
              </p>
              <button onClick={handleStartClick} className="mt-10 rounded-lg bg-main3 px-5 py-2 text-white">
                게임 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KickEbul
