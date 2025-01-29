import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import ebulUser from '../../assets/game/game.png'
import { TGameState } from '../../page/Game'

const KickEbul = ({ setGameState }: { setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const [isGameRunning, setIsGameRunning] = useState(false) // 게임 실행 여부
  const [isCounting, setIsCounting] = useState(false) // 3,2,1 카운트다운 중 여부
  const [count, setCount] = useState(3) // 준비 카운트다운 (3, 2, 1)
  const [timeLeft, setTimeLeft] = useState(20) // 게임 카운트다운 (20초)
  const [hitCount, setHitCount] = useState(0) // 타격 횟수
  const [hitScale, setHitScale] = useState(1) // 타격 크기

  // 타이머 참조
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** 20초 게임 타이머 시작 */
  const startGameTimer = useCallback(() => {
    setTimeLeft(20)
    setHitCount(0)
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(gameTimerRef.current!)
          setIsGameRunning(false)
          setGameState(prev => ({ ...prev, hitCount })) // 게임 종료 시 hitCount 저장
        }
        return prev - 1
      })
    }, 1000)
  }, [hitCount, setGameState])

  /** 3,2,1 카운트다운 시작 */
  const startCountdown = useCallback(() => {
    setIsCounting(true)
    setCount(3)

    countdownRef.current = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          clearInterval(countdownRef.current!)
          setIsCounting(false)
          setIsGameRunning(true)
          startGameTimer() // 20초 게임 타이머 시작
        }
        return prev - 1
      })
    }, 1000)
  }, [startGameTimer])

  /** 타격 횟수 측정 */
  const handleHit = () => {
    if (isGameRunning && timeLeft > 0) {
      // 랜덤한 크기 적용 (0.8 ~ 2배)
      const randomScale = 0.8 + Math.random() * 1.2
      setHitScale(randomScale)

      setHitCount(prev => prev + 1)
    }
  }

  /** 게임 시작 */
  const startGame = () => {
    if (!isGameRunning && !isCounting) {
      startCountdown() // 3,2,1 카운트다운 시작
    }
  }

  /** 게임 종료 시 타이머 정리 */
  useEffect(() => {
    return () => {
      clearInterval(countdownRef.current!)
      clearInterval(gameTimerRef.current!)
    }
  }, [])

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
            <div onClick={handleHit} className="flex h-full w-full cursor-pointer items-center justify-center">
              <p className="text-6xl transition-all duration-300 ease-out" style={{ transform: `scale(${hitScale})` }}>
                {hitCount}
              </p>
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
