import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import sleepUserImg from '../../assets/sleep_user.png'

const KickEbul = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const [timer, setTimer] = useState(5)
  const [isAnimating, setIsAnimating] = useState(false)

  const [touchCount, setTouchCount] = useState(0)
  const [isTouchAnimating, setIsTouchAnimating] = useState(false) // 터치 애니메이션 상태

  /** 터치 카운트 체크 */
  const handleTouch = () => {
    setTouchCount(prev => prev + 1)
    setIsTouchAnimating(true) // 애니메이션 시작
    setTimeout(() => setIsTouchAnimating(false), 300) // 애니메이션 종료
  }

  // 타이머 애니메이션 관리
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true) // 애니메이션 시작
      setTimeout(() => setIsAnimating(false), 500) // 애니메이션 종료

      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const [gameTimer, setGameTimer] = useState(20) // 30초로 초기화
  const [progress, setProgress] = useState(100) // 진행률 (100% 초기화)

  useEffect(() => {
    let interval: number = 0 // `number`로 타입 지정

    if (timer === 0) {
      // 타이머 시작
      interval = window.setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval) // 30초가 지나면 타이머 종료
            return 0 // 타이머를 0으로 고정
          }
          return prev - 1 // 타이머 감소
        })
        setProgress(prev => (prev > 0 ? prev - 100 / 30 : 0)) // 진행률 감소
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval) // 정리 함수로 타이머 종료
    }
  }, [timer])

  useEffect(() => {
    if (gameTimer === 0) {
      localStorage.setItem('touchCount', touchCount.toString())
      handleNextStep()
    }
  }, [gameTimer, touchCount, handleNextStep])

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-center bg-no-repeat" style={{ backgroundImage: `url(${sleepUserImg})` }}>
      {/* 어두운 오버레이 */}
      {timer > 0 && <div className="absolute inset-0 bg-black/50" />}
      {/* 타이머와 텍스트 */}
      <div className="flex flex-col items-center">
        {timer > 0 ? (
          <>
            <div className="z-10 mb-[20rem] flex h-[10rem] w-[10rem] items-center justify-center rounded-full border-2 border-black bg-white text-6xl">
              <div className={twMerge(isAnimating && 'timer-animation')}>{timer}</div>
            </div>
            <div className="z-10 rounded-lg border-4 bg-black/70 px-6 py-10 text-center text-white">
              제한 시간안에 빠르게 터치해서
              <br />
              흑역사를 날려버리세요!
            </div>
          </>
        ) : (
          <>
            {/* 진행률 타이머 */}
            <div className="relative flex h-[10rem] w-[10rem] items-center justify-center">
              {/* 원형 진행률 */}
              <svg className="absolute left-0 top-0 h-full w-full">
                <circle className="text-gray-300" stroke="currentColor" fill="transparent" strokeWidth="10" cx="50%" cy="50%" r="45%" />
                <circle
                  className="text-blue-500"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth="10"
                  strokeDasharray="283" // 2 * Math.PI * 45 (원의 둘레)
                  strokeDashoffset={283 - (283 * progress) / 100} // 진행률에 따른 오프셋 계산
                  cx="50%"
                  cy="50%"
                  r="45%"
                  style={{ transition: 'stroke-dashoffset 1s linear' }} // 부드러운 애니메이션
                />
              </svg>
              <div className="absolute text-4xl font-bold">{gameTimer}</div>
            </div>
            <div className="mt-[20rem] flex h-[20rem] w-[20rem] cursor-pointer items-center justify-center bg-[#EFE4B0]" onClick={handleTouch}>
              <div className={twMerge('text-4xl text-rose-600 transition-transform duration-300 ease-out', isTouchAnimating && 'animate-punch')}>{touchCount}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default KickEbul
