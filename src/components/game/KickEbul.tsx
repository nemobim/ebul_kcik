import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ebulUser from '../../assets/game/game.webp'
import hitEffect from '../../assets/game/kick.svg'
import { TEffect, TGameState } from '../../types/game'
import { SCORE_MULTIPLIER } from '../../utils/rank'
import CountCombo from './CountCombo'

const COUNTDOWN_SECONDS = 5
const GAME_SECONDS = 20

const KickEbul = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const [isGameRunning, setIsGameRunning] = useState(false) // 본 게임 시작 여부
  const [isCountdown, setIsCountdown] = useState(false) // 카운트다운 시작 여부
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS) // 카운트다운 타이머
  const [timeCount, setTimeCount] = useState(GAME_SECONDS) // 본 게임 타이머

  const [effects, setEffects] = useState<TEffect[]>([]) //타격 효과
  const [hitCount, setHitCount] = useState(0) //타격 횟수
  const [isBgReady, setIsBgReady] = useState(false) // 배경 이미지 준비 여부

  const playAreaRef = useRef<HTMLDivElement>(null) // 키보드 입력 시 이펙트 위치 계산용

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
    setCountdown(COUNTDOWN_SECONDS)
  }

  /** 타격 1회 등록 (포인터·키보드 공통) */
  const registerHit = (x: number, y: number) => {
    const effect: TEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
    }

    navigator.vibrate?.(10) // 지원 기기에서 가벼운 햅틱 피드백
    setHitCount(prev => prev + 1)
    setEffects(prev => [...prev, effect])
  }

  /** 포인터 타격 */
  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    registerHit(e.clientX - rect.left, e.clientY - rect.top)
  }

  /** 키보드 타격 (Space/Enter) — 접근성 대응 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault() // Space 스크롤 방지
    const rect = playAreaRef.current?.getBoundingClientRect()
    // 영역 중앙 부근에 약간의 변주를 주어 이펙트 표시
    const x = rect ? rect.width * (0.35 + Math.random() * 0.3) : 0
    const y = rect ? rect.height * (0.35 + Math.random() * 0.3) : 0
    registerHit(x, y)
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

  const isUrgent = isGameRunning && timeCount <= 5 // 마지막 5초 긴급 연출

  return (
    <div style={{ backgroundImage: `url(${ebulUser})` }} className="relative h-full touch-none select-none bg-cover bg-center">
      <div className="flex h-full flex-col items-center justify-between py-8">
        {/* 카운트다운 & 타이머 */}
        <div className="flex w-[86%] flex-col items-center justify-center">
          {isCountdown ? (
            // 카운트다운: progress ring + 숫자
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - countdown / COUNTDOWN_SECONDS)}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
              </svg>
              <p className="text-5xl font-bold text-white drop-shadow-lg" aria-label={`${countdown}초 후 시작`}>
                {countdown}
              </p>
            </div>
          ) : isGameRunning ? (
            // 게임 진행: 상단 progress bar + 남은 초
            <div className="w-full" role="timer" aria-label={`남은 시간 ${timeCount}초`}>
              <div className="mb-2 h-3 w-full overflow-hidden rounded-full border-[2px] border-black bg-white/60">
                <div
                  className={twMerge('h-full rounded-full transition-[width] duration-1000 ease-linear', isUrgent ? 'bg-red-500' : 'bg-main3')}
                  style={{ width: `${(timeCount / GAME_SECONDS) * 100}%` }}
                />
              </div>
              <p className={twMerge('text-center font-bold text-white drop-shadow-lg transition-all', isUrgent ? 'animate-pulse text-5xl text-red-300' : 'text-3xl')}>{timeCount}</p>
            </div>
          ) : (
            <p className="text-4xl text-white">준비</p>
          )}
        </div>

        {/* 터치 카운트 */}
        {hitCount > 0 && <CountCombo count={hitCount} />}

        {/* 게임 영역 */}
        <div className={twMerge('mb-5 h-[40%] w-[86%] rounded-lg text-white outline-dashed outline-[6px] outline-offset-1 outline-main3', isUrgent && 'outline-red-500')}>
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
            <div
              ref={playAreaRef}
              role="button"
              tabIndex={0}
              aria-label="이불 차기 — 빠르게 연타하세요"
              className="relative h-full w-full focus:outline-none focus-visible:outline-dashed focus-visible:outline-[3px] focus-visible:outline-white"
              onPointerDown={handlePointer}
              onKeyDown={handleKeyDown}
            >
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
