import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ebulUser from '../../assets/game/game.webp'
import { TGameState } from '../../page/Game'

export type TEffect = {
  id: number
  x: number
  y: number
  combo: number
}

const KickEbul = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const [startCount, setStartCount] = useState<number | null>(null) // 3,2,1 카운트다운
  const [isGameRunning, setIsGameRunning] = useState(false) // 본 게임 시작 여부
  const [timeCount, setTimeCount] = useState(20) // 본 게임 타이머

  /** 게임 시작 버튼 클릭 시 → 3초 카운트다운 */
  const handleStartClick = () => {
    if (startCount === null && !isGameRunning) {
      setStartCount(3)
    }
  }

  /** 3,2,1 카운트다운 */
  useEffect(() => {
    if (startCount === null || startCount <= 0) return

    const timer = setInterval(() => {
      setStartCount(prev => {
        if (!prev || prev <= 1) {
          clearInterval(timer)
          setStartCount(null)
          setIsGameRunning(true) // 본게임 시작
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [startCount])

  /** 본게임 타이머 */
  useEffect(() => {
    if (!isGameRunning || timeCount <= 0) return

    const gameTimer = setInterval(() => {
      setTimeCount(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer)
          setIsGameRunning(false)
          setTimeCount(20)
          handleNextStep() // 게임 종료 후 다음 단계로 이동
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(gameTimer)
  }, [isGameRunning, timeCount, handleNextStep])

  return (
    <div style={{ backgroundImage: `url(${ebulUser})` }} className="relative h-full bg-cover bg-center">
      <div className="flex h-full flex-col items-center justify-between py-8">
        {/* 카운트다운 & 타이머 */}
        <div className="flex items-center justify-center">
          <p className="animate-bounce text-4xl text-white transition-all duration-500">{isGameRunning ? timeCount : '준비'}</p>
        </div>

        {/* 게임 영역 */}
        <div className="mb-5 h-[40%] w-[86%] rounded-lg text-white outline-dashed outline-[6px] outline-offset-1 outline-main3">
          {isGameRunning ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-center text-sm">
                제한 시간 동안 빠르게 터치해
                <br />
                떠오른 생각을 날려버려요!
              </p>
              {/* 실제 게임 영역: 여기에 클릭 핸들러와 이펙트 들어갈 수 있음 */}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="mb-2 text-center text-sm">
                제한 시간 동안 빠르게 터치해
                <br />
                떠오른 생각을 날려버려요!
              </p>
              {startCount === null && (
                <button onClick={handleStartClick} className="mt-10 rounded-lg bg-main3 px-5 py-2 text-white">
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
