import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ebulUser from '../../assets/game/game.webp'
import hitEffect from '../../assets/game/kick.svg'
import { TEffect, TGameState } from '../../types/game'
import { SCORE_MULTIPLIER } from '../../utils/rank'
import CountCombo from './CountCombo'

const KickEbul = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const [isGameRunning, setIsGameRunning] = useState(false) // 본 게임 시작 여부
  const [timeCount, setTimeCount] = useState(20) // 본 게임 타이머

  const [effects, setEffects] = useState<TEffect[]>([]) //타격 효과
  const [hitCount, setHitCount] = useState(0) //타격 횟수

  /** 게임 시작 */
  const handleStartClick = () => {
    setIsGameRunning(true)
  }

  /** 타격 효과 추가 */
  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const effect: TEffect = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setHitCount(prev => prev + 1)
    setEffects(prev => [...prev, effect])

    setTimeout(() => {
      setEffects(prev => prev.filter(eff => eff.id !== effect.id))
    }, 500)
  }

  useEffect(() => {
    if (!isGameRunning) return

    const timer = setInterval(() => {
      setTimeCount(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsGameRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameRunning])

  useEffect(() => {
    //게임종료되면 점수 저장
    if (timeCount === 0) {
      const finalScore = hitCount * SCORE_MULTIPLIER
      setGameState(prev => ({ ...prev, score: finalScore }))
      handleNextStep()
    }
  }, [timeCount, handleNextStep, setGameState, hitCount])

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
            <div className="relative h-full w-full" onPointerDown={handlePointer}>
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
