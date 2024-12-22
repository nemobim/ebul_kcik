import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import blanket from '../../assets/blanket.png' // 이불 이미지
import house from '../../assets/house.png' // 지붕 이미지
import './SkyAnimation.css'

const SkyAnimation = () => {
  const [showHouse, setShowHouse] = useState(true) // 지붕 표시 여부
  const [startAnimation, setStartAnimation] = useState(false) // 배경 애니메이션 시작 여부
  const [score, setScore] = useState(0) // 로컬 스토리지에서 가져온 점수
  const [messageVisible, setMessageVisible] = useState(false) // 점수 표시 여부
  const [scrollPosition, setScrollPosition] = useState(0) // 스크롤 위치 (단계에 따라 조정)

  useEffect(() => {
    // 점수 가져오기
    const touchCount = Number(localStorage.getItem('touchCount')) || 0
    setScore(touchCount)

    // 점수에 따른 스크롤 위치 계산
    const maxScore = 250 // 최대 점수
    const totalStages = 5 // 배경 단계 수
    const stageHeight = 1 / totalStages // 각 단계의 높이
    const calculatedPosition = Math.min((touchCount / maxScore) * totalStages, totalStages - 1)
    setScrollPosition(calculatedPosition * stageHeight)

    // 4초 후 애니메이션 시작
    const timer = setTimeout(() => {
      setShowHouse(false)
      setStartAnimation(true)
    }, 4000)

    return () => clearTimeout(timer) // 타이머 클린업
  }, [])

  useEffect(() => {
    if (startAnimation) {
      // 배경 애니메이션이 끝난 후 점수 표시
      const animationDuration = scrollPosition * 5000 // 점수에 따른 애니메이션 시간
      const timer = setTimeout(() => {
        setMessageVisible(true)
        setStartAnimation(false) // 애니메이션 종료
      }, animationDuration)

      return () => clearTimeout(timer)
    }
  }, [startAnimation, scrollPosition])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 배경 */}
      <div
        className="background"
        style={{
          transform: startAnimation ? `translateY(-${scrollPosition * 100}%)` : 'translateY(0)',
          transition: `transform ${scrollPosition * 5}s linear`,
        }}
      ></div>

      {/* 지붕 (초기 상태) */}
      {showHouse && <img src={house} alt="지붕" className="absolute bottom-0 left-1/2 w-48 -translate-x-1/2 transform" />}

      {/* 이불 */}
      {!messageVisible && (
        <img src={blanket} alt="이불" className={`absolute bottom-1/2 left-1/2 z-10 w-36 -translate-x-1/2 translate-y-1/2 transform ${startAnimation ? 'blanket-fly' : 'blanket-launch'}`} />
      )}

      {/* 점수 메시지 */}
      {messageVisible && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold text-white">
          <span>{score}m까지 날아갔습니다</span>
          <div className="mt-5 flex gap-5">
            <button className="">재도전</button>
            <Link to="/rank">순위보기</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkyAnimation
