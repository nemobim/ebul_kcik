import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ebulUser from '../../assets/game/game.webp'
import hitEffect from '../../assets/game/kick.svg'
import { TEffect, TGameState } from '../../types/game'
import { SCORE_MULTIPLIER } from '../../utils/rank'
import CountCombo from './CountCombo'

const KickEbul = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const [isGameRunning, setIsGameRunning] = useState(false) // 본 게임 시작 여부
  const [isCountdown, setIsCountdown] = useState(false) // 카운트다운 시작 여부
  const [countdown, setCountdown] = useState(5) // 카운트다운 타이머
  const [timeCount, setTimeCount] = useState(20) // 본 게임 타이머

  const [effects, setEffects] = useState<TEffect[]>([]) //타격 효과
  const [hitCount, setHitCount] = useState(0) //타격 횟수
  const [isBgReady, setIsBgReady] = useState(false) // 배경 이미지 준비 여부

  // 배경 이미지를 디코딩한 뒤 시작 버튼 활성화 (느린 네트워크에서 빈 배경으로 시작 방지)
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = ebulUser
    img
      .decode()
      .catch(() => {}) // 디코드 실패해도 게임 진행은 막지 않음
      .finally(() => {
        if (!cancelled) setIsBgReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /** 게임 시작 */
  const handleStartClick = () => {
    setIsCountdown(true)
    setCountdown(5)
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
  }

  /** 타격 effect는 애니메이션 종료 시 제거 (타이머 누적 방지) */
  const handleEffectAnimationEnd = (id: number) => {
    setEffects(prev => prev.filter(eff => eff.id !== id))
  }

  useEffect(() => {
    if (!isCountdown) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsCountdown(false)
          setIsGameRunning(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isCountdown])

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
          {isCountdown ? (
            <div className="text-center">
              <p className="animate-pulse text-7xl font-bold text-white drop-shadow-lg">{countdown}</p>
              <p className="mt-2 animate-pulse text-lg text-white/80">초 후 시작!</p>
            </div>
          ) : (
            <p className={twMerge('text-4xl text-white', isGameRunning && 'animate-bounce')}>{isGameRunning ? timeCount : '준비'}</p>
          )}
        </div>

        {/* 터치 카운트 */}
        {hitCount > 0 && <CountCombo count={hitCount} />}

        {/* 게임 영역 */}
        <div className="mb-5 h-[40%] w-[86%] rounded-lg text-white outline-dashed outline-[6px] outline-offset-1 outline-main3">
          {isCountdown ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="text-center">
                <div className="mb-4 animate-bounce">
                  <div className="mb-2 text-6xl">🦶</div>
                </div>
                <p className="mb-2 text-lg font-semibold">게임이 곧 시작됩니다!</p>
                <p className="text-sm text-white/80">해당 영역을 빠르게 연타해 떠오른 생각을 날려버려요!</p>
              </div>
            </div>
          ) : isGameRunning ? (
            <div className="relative h-full w-full" onPointerDown={handlePointer}>
              {/* 터치 이펙트 */}
              {effects.map(effect => (
                <img
                  key={effect.id}
                  src={hitEffect}
                  alt="hit"
                  onAnimationEnd={() => handleEffectAnimationEnd(effect.id)}
                  className="animate-scale-fade pointer-events-none absolute size-12"
                  style={{ left: effect.x, top: effect.y, transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="mb-2 text-center text-sm">
                20초 안에 화면을 빠르게 터치해
                <br />
                떠오른 생각을 날려버려요!
              </p>
              <button onClick={handleStartClick} disabled={!isBgReady} className="mt-10 rounded-lg bg-main3 px-5 py-2 text-white disabled:opacity-50">
                {isBgReady ? '게임 시작' : '준비 중...'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KickEbul
