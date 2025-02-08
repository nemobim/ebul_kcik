'use client'

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import ebulUser from '../../assets/game/game.png'
import { TGameState } from '../../page/Game'
import { SCORE_MULTIPLIER } from '../../utils/rank'
import ComboEffect from './ComboEffect'

export type TEffect = {
  id: number
  x: number
  y: number
  combo: number
}

const KickEbul = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const [isGameRunning, setIsGameRunning] = useState(false) // 게임 실행 여부
  const [isCounting, setIsCounting] = useState(false) // 카운팅 시작 여부
  const [isGameOver, setIsGameOver] = useState(false) // 게임 종료 여부

  const [count, setCount] = useState(3) // 3초 카운트
  const [timeLeft, setTimeLeft] = useState(20) // 본게임 20초 카운트
  const [hitCount, setHitCount] = useState(0) // 타격 횟수
  const [effects, setEffects] = useState<TEffect[]>([]) // 타격 효과

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const effectTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]) // 효과 타이머 관리

  /** 20초 게임 타이머 시작 */
  const startGameTimer = useCallback(() => {
    setTimeLeft(20)
    setHitCount(0)
    setEffects([]) // 효과 초기화

    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current)
    }

    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current!)
          setIsGameRunning(false)
          setIsGameOver(true) //게임 종료
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  /** 3,2,1 카운트다운 시작 */
  const startCountdown = useCallback(() => {
    setIsCounting(true)
    setCount(3)

    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }

    countdownRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          setIsCounting(false)
          setIsGameRunning(true) //본 게임 시작
          startGameTimer()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [startGameTimer])

  /** 타격 횟수 측정 */
  const handleHit = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isGameRunning || timeLeft <= 0) return //게임이 진행 중이고 시간이 남을때만 가능

      setHitCount(prev => prev + 1) // 최신 상태 반영

      const rect = e.currentTarget.getBoundingClientRect()
      const newEffect: TEffect = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        combo: hitCount + 1,
      }

      setEffects(prev => prev.concat(newEffect))

      // 효과 제거 타이머 설정
      const timeoutId = setTimeout(() => {
        setEffects(prev => prev.filter(effect => effect.id !== newEffect.id))
      }, 1000)

      effectTimeoutsRef.current.push(timeoutId)
    },
    [isGameRunning, timeLeft, hitCount],
  )

  /** 게임 시작 */
  const startGame = useCallback(() => {
    if (!isGameRunning && !isCounting) {
      startCountdown()
    }
  }, [isGameRunning, isCounting, startCountdown])

  /** 클린업 */
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
      if (gameTimerRef.current) clearInterval(gameTimerRef.current)
      effectTimeoutsRef.current.forEach(clearTimeout)
      effectTimeoutsRef.current = []
    }
  }, [])

  /** 게임 종료 후 상태 업데이트 */
  useEffect(() => {
    if (isGameOver) {
      // 타격 횟수 3배 후 결과 도출
      setGameState(prev => ({ ...prev, score: hitCount * SCORE_MULTIPLIER }))
      handleNextStep()
    }
  }, [isGameOver, setGameState, hitCount, handleNextStep])

  return (
    <div style={{ backgroundImage: `url(${ebulUser})` }} className="relative h-full bg-cover bg-center">
      <div className="flex h-full flex-col items-center justify-between py-8">
        {/* 카운트다운 & 타이머 */}
        <div className="flex items-center justify-center">
          {isCounting || isGameRunning ? (
            <p className={`text-white ${isCounting ? 'animate-pulse text-9xl' : 'text-6xl'} transition-all duration-500`}>{isCounting ? count : timeLeft}</p>
          ) : (
            <p className="text-6xl text-white">준비</p>
          )}
        </div>

        {/* 게임 영역 */}
        <div className="mb-5 h-[40%] w-[86%] rounded-lg text-white outline-dashed outline-[6px] outline-offset-1 outline-main3">
          {isGameRunning ? (
            <div onClick={handleHit} className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden">
              {effects.map(effect => (
                <ComboEffect key={effect.id} x={effect.x} y={effect.y} combo={effect.combo} />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p>
                제한 시간 동안 빠르게 터치해
                <br />
                떠오른 생각을 날려버려요!
              </p>
              {!isCounting && (
                <button onClick={startGame} className="mt-10 rounded-lg bg-main3 px-5 py-2">
                  게임 시작
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KickEbul
